import { z } from "zod";

const baseEventSchema = z.object({
  eventType: z.string(),
  eventId: z.string(),
  timestamp: z.string(),
});

const agentIdentitySchema = z.object({
  did: z.string(),
  vcHash: z.string(),
  spiffeId: z.string(),
});

const agentSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  model: z.string(),
  version: z.string(),
  riskTier: z.string(),
  capabilities: z.array(z.string()),
  identity: agentIdentitySchema,
});

export const agentRegisteredSchema = baseEventSchema.extend({
  eventType: z.literal("agent.registered"),
  agent: agentSchema,
  metadata: z.object({
    source: z.string(),
    correlationId: z.string(),
  }),
});

export const toolInvocationSchema = baseEventSchema.extend({
  eventType: z.literal("tool.invocation"),
  agentId: z.string(),
  tool: z.object({
    name: z.string(),
    target: z.string(),
    method: z.string(),
    purpose: z.string(),
  }),
  policy: z.object({
    decision: z.enum(["allow", "deny"]),
    policyIds: z.array(z.string()),
    regoBundleHash: z.string(),
  }),
  risk: z.object({
    aivssScore: z.number(),
    ssvcDecision: z.string(),
  }),
  audit: z.object({
    requestHash: z.string(),
    responseHash: z.string(),
  }),
});

export const anomalyDetectedSchema = baseEventSchema.extend({
  eventType: z.literal("agent.anomaly.detected"),
  agentId: z.string(),
  anomaly: z.object({
    isAnomalous: z.boolean(),
    score: z.number(),
    signals: z.array(z.string()),
    explanation: z.string(),
  }),
  risk: z.object({
    aivssVector: z.string(),
    aivssScore: z.number(),
  }),
});

export const policyViolationSchema = baseEventSchema.extend({
  eventType: z.literal("policy.violation"),
  agentId: z.string(),
  policy: z.object({
    id: z.string(),
    name: z.string(),
    decision: z.enum(["allow", "deny"]),
  }),
  evidence: z.object({
    logRefs: z.array(z.string()),
    summary: z.string(),
  }),
  risk: z.object({
    aivssScore: z.number(),
    ssvcDecision: z.string(),
  }),
});

export const containmentExecutedSchema = baseEventSchema.extend({
  eventType: z.literal("containment.executed"),
  agentId: z.string(),
  action: z.object({
    type: z.string(),
    details: z.string(),
    initiator: z.string(),
  }),
  reason: z.object({
    trigger: z.string(),
    ssvcDecision: z.string(),
  }),
});

export const governanceEventSchema = z.union([
  agentRegisteredSchema,
  toolInvocationSchema,
  anomalyDetectedSchema,
  policyViolationSchema,
  containmentExecutedSchema,
]);

export type GovernanceEvent = z.infer<typeof governanceEventSchema>;

export const governanceEventSummarySchema = z.object({
  eventType: z.string(),
  eventId: z.string(),
  timestamp: z.string(),
  agentId: z.string().optional(),
  summary: z.string(),
  severity: z.enum(["Low", "Medium", "High", "Critical"]),
});

export type GovernanceEventSummary = z.infer<
  typeof governanceEventSummarySchema
>;
