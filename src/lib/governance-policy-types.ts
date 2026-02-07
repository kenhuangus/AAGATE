import { z } from "zod";

export const policyRuleSchema = z.union([
  z.object({
    type: z.literal("role_action"),
    allowRoles: z.array(z.string()),
    allowActions: z.array(z.string()).optional(),
  }),
  z.object({
    type: z.literal("action_only"),
    allowActions: z.array(z.string()),
  }),
]);

export const governancePolicySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  control: z.string(),
  version: z.string(),
  rule: policyRuleSchema,
  signature: z.string(),
});

export type GovernancePolicy = z.infer<typeof governancePolicySchema>;

export const governancePolicyInputSchema = governancePolicySchema.omit({
  signature: true,
});

export type GovernancePolicyInput = z.infer<
  typeof governancePolicyInputSchema
>;

export const policyEvaluationInputSchema = z.object({
  subject: z.object({
    id: z.string(),
    role: z.string(),
  }),
  action: z.string(),
  resource: z.string().optional(),
});

export type PolicyEvaluationInput = z.infer<
  typeof policyEvaluationInputSchema
>;

export const policyEvaluationResultSchema = z.object({
  decision: z.enum(["allow", "deny"]),
  matchedPolicies: z.array(z.string()),
  explanation: z.string(),
});

export type PolicyEvaluationResult = z.infer<
  typeof policyEvaluationResultSchema
>;
