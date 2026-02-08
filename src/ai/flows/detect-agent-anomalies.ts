'use server';
/**
 * @fileOverview AI-powered anomaly detection for agent behavior.
 *
 * - detectAgentAnomalies - A function to flag unusual agent behavior based on security signals.
 * - DetectAgentAnomaliesInput - The input type for the detectAgentAnomalies function.
 * - DetectAgentAnomaliesOutput - The return type for the detectAgentAnomalies function.
 */

import { z } from "genkit";

import { scoreAnomalySignals } from "@/lib/telemetry-scoring";

const DetectAgentAnomaliesInputSchema = z.object({
  agentId: z.string().describe('The ID of the agent to analyze.'),
  securitySignals: z.array(z.string()).describe('A list of security signals for the agent.'),
});
export type DetectAgentAnomaliesInput = z.infer<typeof DetectAgentAnomaliesInputSchema>;

const DetectAgentAnomaliesOutputSchema = z.object({
  isAnomalous: z.boolean().describe('Whether the agent behavior is anomalous.'),
  anomalyScore: z.number().describe('A score indicating the severity of the anomaly.'),
  explanation: z.string().describe('An explanation of why the agent behavior is considered anomalous.'),
  suggestedRemediation: z.string().describe('Suggested actions to remediate the anomalous behavior.'),
});
export type DetectAgentAnomaliesOutput = z.infer<typeof DetectAgentAnomaliesOutputSchema>;

export async function detectAgentAnomalies(
  input: DetectAgentAnomaliesInput
): Promise<DetectAgentAnomaliesOutput> {
  const scored = scoreAnomalySignals(input.securitySignals);
  return {
    isAnomalous: scored.isAnomalous,
    anomalyScore: scored.score,
    explanation: scored.explanation,
    suggestedRemediation: scored.suggestedRemediation,
  };
}
