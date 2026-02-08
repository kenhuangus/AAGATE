'use server';
/**
 * @fileOverview Policy violation analysis AI agent.
 *
 * - analyzePolicyViolation - A function that handles the policy violation analysis process.
 * - AnalyzePolicyViolationInput - The input type for the analyzePolicyViolation function.
 * - AnalyzePolicyViolationOutput - The return type for the analyzePolicyViolation function.
 */

import { z } from "genkit";

import { classifyPolicyViolation } from "@/lib/telemetry-scoring";

const AnalyzePolicyViolationInputSchema = z.object({
  policyViolationDescription: z
    .string()
    .describe('The description of the policy violation.'),
  securityLogs: z
    .string()
    .describe('Security logs related to the policy violation.'),
});
export type AnalyzePolicyViolationInput = z.infer<
  typeof AnalyzePolicyViolationInputSchema
>;

const AnalyzePolicyViolationOutputSchema = z.object({
  classification: z.string().describe('The classification of the policy violation.'),
  context: z.string().describe('The context of the policy violation using MAESTRO, AIVSS, SEI SSVC, and the CSA Red Teaming Guide.'),
  suggestedRemediations: z
    .string()
    .describe('Suggested remediations to address the security issue.'),
});
export type AnalyzePolicyViolationOutput = z.infer<
  typeof AnalyzePolicyViolationOutputSchema
>;

export async function analyzePolicyViolation(
  input: AnalyzePolicyViolationInput
): Promise<AnalyzePolicyViolationOutput> {
  return classifyPolicyViolation(input.policyViolationDescription, input.securityLogs);
}
