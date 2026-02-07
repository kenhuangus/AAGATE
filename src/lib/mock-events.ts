import type { GovernanceEventSummary } from "@/lib/event-schemas";

export const governanceEvents: GovernanceEventSummary[] = [
  {
    eventType: "agent.registered",
    eventId: "evt-001",
    timestamp: "2024-07-31T10:03:12Z",
    agentId: "agent-005",
    summary: "ANS issued VC and SPIFFE identity for agent 'Relay'.",
    severity: "Low",
  },
  {
    eventType: "tool.invocation",
    eventId: "evt-002",
    timestamp: "2024-07-31T10:04:45Z",
    agentId: "agent-003",
    summary: "Tool-Gateway allowed CRM sync with scoped OAuth token.",
    severity: "Medium",
  },
  {
    eventType: "agent.anomaly.detected",
    eventId: "evt-003",
    timestamp: "2024-07-31T10:05:12Z",
    agentId: "agent-003",
    summary: "UEBA detected recursion loop with memory pressure signals.",
    severity: "High",
  },
  {
    eventType: "policy.violation",
    eventId: "evt-004",
    timestamp: "2024-07-31T10:05:40Z",
    agentId: "agent-003",
    summary: "PII redaction policy denied output; AIVSS score 8.7.",
    severity: "High",
  },
  {
    eventType: "containment.executed",
    eventId: "evt-005",
    timestamp: "2024-07-31T10:06:05Z",
    agentId: "agent-003",
    summary: "GOA applied kill switch via Istio AuthorizationPolicy.",
    severity: "Critical",
  },
];
