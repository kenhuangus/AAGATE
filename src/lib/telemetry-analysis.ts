import { listTelemetry, type TelemetryEvent } from "@/lib/telemetry-stream";
import { scoreAivss } from "@/lib/aivss";

type UebaScore = {
  agentId: string;
  baselineScore: number;
  aivssScore: number;
  signals: string[];
};

type QsafAlert = {
  agentId: string;
  type: "loop" | "starvation" | "flooding";
  details: string;
};

const heartbeatWindowMinutes = Number(process.env.QSAF_HEARTBEAT_WINDOW_MIN ?? "10");
const floodingThreshold = Number(process.env.QSAF_FLOODING_THRESHOLD ?? "120");
const loopThreshold = Number(process.env.QSAF_LOOP_THRESHOLD ?? "5");

const eventWeights: Record<string, number> = {
  "policy.violation": 20,
  "agent.anomaly.detected": 18,
  "tool.invocation": 4,
  "containment.executed": 30,
};

const getAgentId = (event: TelemetryEvent): string | null => {
  const payload = event.payload as Record<string, unknown>;
  if (typeof payload.agentId === "string") {
    return payload.agentId;
  }
  if (payload.agent && typeof payload.agent === "object") {
    const agent = payload.agent as Record<string, unknown>;
    if (typeof agent.id === "string") {
      return agent.id;
    }
  }
  return null;
};

const getToolName = (event: TelemetryEvent): string | null => {
  const payload = event.payload as Record<string, unknown>;
  if (payload.tool && typeof payload.tool === "object") {
    const tool = payload.tool as Record<string, unknown>;
    if (typeof tool.name === "string") {
      return tool.name;
    }
  }
  if (typeof payload.action === "string") {
    return payload.action;
  }
  return null;
};

function buildUebaScores(events: TelemetryEvent[]): UebaScore[] {
  const byAgent = new Map<string, TelemetryEvent[]>();

  events.forEach((event) => {
    const agentId = getAgentId(event);
    if (!agentId) return;
    if (!byAgent.has(agentId)) {
      byAgent.set(agentId, []);
    }
    byAgent.get(agentId)?.push(event);
  });

  return Array.from(byAgent.entries()).map(([agentId, agentEvents]) => {
    const signals: string[] = [];
    const weightedScore = agentEvents.reduce((acc, event) => {
      if (eventWeights[event.eventType]) {
        signals.push(event.eventType);
      }
      return acc + (eventWeights[event.eventType] ?? 1);
    }, 0);

    const baselineScore = Math.min(100, weightedScore);
    const aivss = scoreAivss({
      exploitation: Math.min(10, baselineScore / 10),
      impact: Math.min(10, baselineScore / 9),
      detectability: Math.max(0, 10 - baselineScore / 10),
    });

    return {
      agentId,
      baselineScore,
      aivssScore: aivss.score,
      signals: Array.from(new Set(signals)),
    };
  });
}

function buildQsafAlerts(events: TelemetryEvent[]): QsafAlert[] {
  const alerts: QsafAlert[] = [];
  const byAgent = new Map<string, TelemetryEvent[]>();

  events.forEach((event) => {
    const agentId = getAgentId(event);
    if (!agentId) return;
    if (!byAgent.has(agentId)) {
      byAgent.set(agentId, []);
    }
    byAgent.get(agentId)?.push(event);
  });

  const now = Date.now();
  const windowMs = heartbeatWindowMinutes * 60_000;

  byAgent.forEach((agentEvents, agentId) => {
    const heartbeat = agentEvents.find((event) => event.eventType === "agent.heartbeat");
    if (!heartbeat || now - new Date(heartbeat.timestamp).getTime() > windowMs) {
      alerts.push({
        agentId,
        type: "starvation",
        details: `No heartbeat in the last ${heartbeatWindowMinutes} minutes.`,
      });
    }

    const recentEvents = agentEvents.filter(
      (event) => now - new Date(event.timestamp).getTime() <= 60_000
    );
    if (recentEvents.length > floodingThreshold) {
      alerts.push({
        agentId,
        type: "flooding",
        details: `Event rate exceeded ${floodingThreshold} events/minute.`,
      });
    }

    const toolNames = recentEvents.map((event) => getToolName(event)).filter(Boolean) as string[];
    if (toolNames.length >= loopThreshold) {
      const lastTool = toolNames[toolNames.length - 1];
      const streak = toolNames.reverse().findIndex((tool) => tool !== lastTool);
      if (streak === -1 || streak >= loopThreshold - 1) {
        alerts.push({
          agentId,
          type: "loop",
          details: `Repeated tool invocation detected for ${lastTool}.`,
        });
      }
    }
  });

  return alerts;
}

export async function runTelemetryAnalysis() {
  const events = await listTelemetry();
  return {
    uebaScores: buildUebaScores(events),
    qsafAlerts: buildQsafAlerts(events),
  };
}
