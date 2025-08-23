'use server';
/**
 * @fileOverview AI-powered anomaly detection for agent behavior.
 *
 * - detectAgentAnomalies - A function to flag unusual agent behavior based on security signals.
 * - DetectAgentAnomaliesInput - The input type for the detectAgentAnomalies function.
 * - DetectAgentAnomaliesOutput - The return type for the detectAgentAnomalies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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

export async function detectAgentAnomalies(input: DetectAgentAnomaliesInput): Promise<DetectAgentAnomaliesOutput> {
  return detectAgentAnomaliesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectAgentAnomaliesPrompt',
  input: {schema: DetectAgentAnomaliesInputSchema},
  output: {schema: DetectAgentAnomaliesOutputSchema},
  prompt: `You are a security expert tasked with detecting anomalous behavior in AI agents.

  Analyze the following security signals for agent ID {{{agentId}}} and determine if the agent's behavior is anomalous.

  Security Signals:
  {{#each securitySignals}}- {{{this}}}
  {{/each}}

  Based on these signals, determine the isAnomalous boolean, provide an anomalyScore (0-100), an explanation for your determination, and suggest a remediation.

  Ensure that the output can be parsed as valid JSON.`,
});

const detectAgentAnomaliesFlow = ai.defineFlow(
  {
    name: 'detectAgentAnomaliesFlow',
    inputSchema: DetectAgentAnomaliesInputSchema,
    outputSchema: DetectAgentAnomaliesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
