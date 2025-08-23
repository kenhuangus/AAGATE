'use server';
/**
 * @fileOverview Policy violation analysis AI agent.
 *
 * - analyzePolicyViolation - A function that handles the policy violation analysis process.
 * - AnalyzePolicyViolationInput - The input type for the analyzePolicyViolation function.
 * - AnalyzePolicyViolationOutput - The return type for the analyzePolicyViolation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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
  return analyzePolicyViolationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzePolicyViolationPrompt',
  input: {schema: AnalyzePolicyViolationInputSchema},
  output: {schema: AnalyzePolicyViolationOutputSchema},
  prompt: `You are a security expert specializing in classifying policy violations and suggesting remediations.

  Analyze the following policy violation description and security logs to classify the violation, provide context using MAESTRO, AIVSS, SEI SSVC, and the CSA Red Teaming Guide, and suggest remediations.

  Policy Violation Description: {{{policyViolationDescription}}}
  Security Logs: {{{securityLogs}}}

  Respond with the classification, context, and suggested remediations.
  `,
});

const analyzePolicyViolationFlow = ai.defineFlow(
  {
    name: 'analyzePolicyViolationFlow',
    inputSchema: AnalyzePolicyViolationInputSchema,
    outputSchema: AnalyzePolicyViolationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
