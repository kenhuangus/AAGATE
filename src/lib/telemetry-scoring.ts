import type { AgentLog, RiskHistory } from "@/lib/types";

import type { TelemetryEvent } from "@/lib/telemetry-stream";

const signalWeights: Record<string, number> = {
  recursive_calls: 20,
  memory_spike: 18,
  data_exfiltration: 35,
  policy_violation: 30,
  failed_auth: 15,
  unexpected_tool_use: 12,
  privilege_escalation: 28,
  rate_limit_hit: 8,
};

const remediationBySignal: Record<string, string> = {
  recursive_calls: "Limit recursion depth and add loop detection guards.",
  memory_spike: "Throttle workloads and enable memory watchdogs for the agent.",
  data_exfiltration: "Enforce egress allowlists and redact sensitive fields.",
  policy_violation: "Review policy mappings and tighten agent permissions.",
  failed_auth: "Rotate credentials and verify identity assertions.",
  unexpected_tool_use: "Restrict tool access and require human approval for high-risk tools.",
  privilege_escalation: "Apply least-privilege policies and audit identity claims.",
  rate_limit_hit: "Apply backoff and tune rate limit thresholds.",
};

const eventWeights: Record<string, number> = {
  "agent.anomaly.detected": 25,
  "policy.violation": 30,
  "tool.invocation": 3,
  "containment.executed": 40,
  "agent.heartbeat": -4,
  "agent.recovered": -6,
};

const severityWeights: Record<string, number> = {
  Low: 4,
  Medium: 10,
  High: 20,
  Critical: 35,
};

export type AnomalyScoreResult = {
  score: number;
  isAnomalous: boolean;
  explanation: string;
  suggestedRemediation: string;
};

export type PolicyViolationClassification = {
  classification: string;
  context: string;
  suggestedRemediations: string;
};

export type TelemetryDerivedAgent = {
  riskScore: number;
  status?: "Online" | "Offline" | "Warning";
  lastCheckIn?: string;
  logs: AgentLog[];
  riskHistory: RiskHistory[];
};

const clampScore = (value: number) => Math.max(0, Math.min(100, value));

const normalizeText = (value: string) => value.toLowerCase();

const detectKeywords = (input: string, keywords: string[]) =>
  keywords.some((keyword) => input.includes(keyword));

export function scoreAnomalySignals(signals: string[]): AnomalyScoreResult {
  const normalizedSignals = signals.map((signal) => signal.trim().toLowerCase());
  const weightedScore = normalizedSignals.reduce(
    (acc, signal) => acc + (signalWeights[signal] ?? 6),
    0
  );
  const score = clampScore(weightedScore);
  const isAnomalous = score >= 50;
  const topSignal = normalizedSignals.find((signal) => signalWeights[signal]) ?? normalizedSignals[0];
  const explanation =
    normalizedSignals.length === 0
      ? "No telemetry signals supplied; anomaly confidence remains low."
      : `Signals ${normalizedSignals.join(", ")} produced a risk score of ${score}.`;
  const suggestedRemediation =
    (topSignal && remediationBySignal[topSignal]) ??
    "Review recent telemetry, tighten access controls, and rerun baseline checks.";

  return { score, isAnomalous, explanation, suggestedRemediation };
}

export function classifyPolicyViolation(
  description: string,
  securityLogs: string
): PolicyViolationClassification {
  const normalizedDescription = normalizeText(description);
  const normalizedLogs = normalizeText(securityLogs);
  const combined = `${normalizedDescription} ${normalizedLogs}`;

  if (detectKeywords(combined, ["pii", "personal data", "redaction"])) {
    return {
      classification: "PII Exposure",
      context:
        "Mapped to MAESTRO data exposure and AIVSS impact vectors; SSVC recommends rapid containment.",
      suggestedRemediations:
        "Enable PII redaction, block outbound channels, and trigger a compliance review.",
    };
  }

  if (detectKeywords(combined, ["unauthorized", "permission", "access denied"])) {
    return {
      classification: "Unauthorized Access",
      context:
        "Aligned with MAESTRO access control failures and AIVSS exploitation vectors.",
      suggestedRemediations:
        "Revalidate identity claims, rotate credentials, and tighten role-based policies.",
    };
  }

  if (detectKeywords(combined, ["exfiltration", "egress", "data leak"])) {
    return {
      classification: "Data Exfiltration",
      context:
        "Associated with MAESTRO egress chokepoints and SSVC escalation criteria.",
      suggestedRemediations:
        "Apply tool gateway allowlists, enable hashing audits, and quarantine the agent.",
    };
  }

  if (detectKeywords(combined, ["prompt injection", "jailbreak", "tool abuse"])) {
    return {
      classification: "Prompt/Tool Misuse",
      context:
        "Touches MAESTRO manipulation risks and CSA red teaming misuse categories.",
      suggestedRemediations:
        "Harden prompts, apply input sanitization, and require human-in-the-loop approvals.",
    };
  }

  return {
    classification: "Policy Deviation",
    context:
      "General deviation from governance policy; map to AIVSS baseline and SSVC tracking.",
    suggestedRemediations:
      "Review affected policies, update monitoring alerts, and retrain the agent on allowed actions.",
  };
}

const getAgentIdFromTelemetry = (event: TelemetryEvent): string | undefined => {
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
  return undefined;
};

const getSeverityWeight = (payload: Record<string, unknown>) => {
  const severity = payload.severity;
  if (typeof severity === "string" && severityWeights[severity]) {
    return severityWeights[severity];
  }
  return 0;
};

const getLogFromTelemetry = (event: TelemetryEvent): AgentLog | null => {
  const payload = event.payload as Record<string, unknown>;
  if (typeof payload.message !== "string") {
    return null;
  }
  const level = typeof payload.level === "string" ? payload.level : "INFO";
  if (level !== "INFO" && level !== "WARN" && level !== "ERROR") {
    return null;
  }
  return {
    timestamp: event.timestamp,
    level,
    message: payload.message,
  };
};

export function deriveAgentFromTelemetry(
  baseRiskScore: number,
  telemetryEvents: TelemetryEvent[]
): TelemetryDerivedAgent {
  const logs: AgentLog[] = [];
  const dailyRisk: Record<string, number> = {};
  let lastCheckIn: string | undefined;
  let status: "Online" | "Offline" | "Warning" | undefined;
  let riskScore = baseRiskScore;

  telemetryEvents.forEach((event) => {
    const payload = event.payload as Record<string, unknown>;
    const weight = eventWeights[event.eventType] ?? 0;
    const severityWeight = getSeverityWeight(payload);
    const dayKey = event.timestamp.split("T")[0];
    dailyRisk[dayKey] = (dailyRisk[dayKey] ?? baseRiskScore) + weight + severityWeight;
    riskScore = clampScore(riskScore + weight + severityWeight);

    const logEntry = getLogFromTelemetry(event);
    if (logEntry) {
      logs.push(logEntry);
    }

    if (event.eventType === "agent.heartbeat") {
      lastCheckIn = event.timestamp;
      status = "Online";
    }

    if (event.eventType === "agent.anomaly.detected" || event.eventType === "policy.violation") {
      status = "Warning";
    }

    if (event.eventType === "containment.executed") {
      status = "Offline";
    }
  });

  const riskHistory: RiskHistory[] = Object.entries(dailyRisk).map(([date, score]) => ({
    date,
    riskScore: clampScore(Math.round(score)),
  }));

  return {
    riskScore,
    status,
    lastCheckIn,
    logs,
    riskHistory,
  };
}

export function filterTelemetryForAgent(
  events: TelemetryEvent[],
  agentId: string
): TelemetryEvent[] {
  return events.filter((event) => getAgentIdFromTelemetry(event) === agentId);
}
