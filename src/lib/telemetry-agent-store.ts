import { getAgents, getAgentById } from "@/lib/data-store";
import { listTelemetry } from "@/lib/telemetry-stream";
import type { Agent } from "@/lib/types";
import {
  deriveAgentFromTelemetry,
  filterTelemetryForAgent,
} from "@/lib/telemetry-scoring";

type AgentSeed = Omit<Agent, "riskScore" | "riskHistory" | "logs" | "status" | "lastCheckIn"> &
  Partial<Pick<Agent, "riskScore" | "riskHistory" | "logs" | "status" | "lastCheckIn">>;

const buildAgentFromTelemetry = (
  seed: AgentSeed,
  telemetryEvents: ReturnType<typeof filterTelemetryForAgent>
): Agent => {
  const derived = deriveAgentFromTelemetry(seed.riskScore ?? 10, telemetryEvents);
  return {
    ...seed,
    riskScore: derived.riskScore,
    riskHistory: derived.riskHistory.length > 0 ? derived.riskHistory : seed.riskHistory ?? [],
    logs: derived.logs.length > 0 ? derived.logs : seed.logs ?? [],
    status: derived.status ?? seed.status ?? "Online",
    lastCheckIn: derived.lastCheckIn ?? seed.lastCheckIn ?? new Date().toISOString(),
  };
};

const buildAgentSeedFromRegistration = (payload: Record<string, unknown>): AgentSeed | null => {
  const agent = payload.agent;
  if (!agent || typeof agent !== "object") {
    return null;
  }
  const agentRecord = agent as Record<string, unknown>;
  if (
    typeof agentRecord.id !== "string" ||
    typeof agentRecord.name !== "string" ||
    typeof agentRecord.type !== "string" ||
    typeof agentRecord.model !== "string" ||
    typeof agentRecord.version !== "string"
  ) {
    return null;
  }

  return {
    id: agentRecord.id,
    name: agentRecord.name,
    type: agentRecord.type as Agent["type"],
    model: agentRecord.model,
    version: agentRecord.version,
    policies: Array.isArray(agentRecord.policies)
      ? (agentRecord.policies as string[])
      : [],
  };
};

export async function getTelemetryAgents(): Promise<Agent[]> {
  const [baseAgents, telemetryEvents] = await Promise.all([
    getAgents(),
    listTelemetry(),
  ]);

  const agentsById = new Map<string, AgentSeed>();

  baseAgents.forEach((agent) => {
    agentsById.set(agent.id, agent);
  });

  telemetryEvents.forEach((event) => {
    if (event.eventType === "agent.registered") {
      const seed = buildAgentSeedFromRegistration(event.payload);
      if (seed && !agentsById.has(seed.id)) {
        agentsById.set(seed.id, seed);
      }
    }
  });

  return Array.from(agentsById.values()).map((seed) => {
    const agentTelemetry = filterTelemetryForAgent(telemetryEvents, seed.id);
    return buildAgentFromTelemetry(seed, agentTelemetry);
  });
}

export async function getTelemetryAgentById(agentId: string): Promise<Agent | undefined> {
  const [baseAgent, telemetryEvents] = await Promise.all([
    getAgentById(agentId),
    listTelemetry(),
  ]);

  let seed = baseAgent;
  if (!seed) {
    const registration = telemetryEvents.find((event) => {
      if (event.eventType !== "agent.registered") {
        return false;
      }
      const payload = event.payload as Record<string, unknown>;
      const registered = buildAgentSeedFromRegistration(payload);
      return registered?.id === agentId;
    });
    if (registration) {
      seed = buildAgentSeedFromRegistration(registration.payload) as Agent | null;
    }
  }

  if (!seed) {
    return undefined;
  }

  const agentTelemetry = filterTelemetryForAgent(telemetryEvents, seed.id);
  return buildAgentFromTelemetry(seed, agentTelemetry);
}
