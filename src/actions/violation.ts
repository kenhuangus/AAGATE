"use server";

import {
  analyzePolicyViolation,
  type AnalyzePolicyViolationInput,
  type AnalyzePolicyViolationOutput,
} from "@/ai/flows/analyze-policy-violation";

export type AnalyzeViolationActionResult =
  | { success: true; data: AnalyzePolicyViolationOutput }
  | { success: false; error: string };

export async function analyzeViolationAction(
  input: AnalyzePolicyViolationInput
): Promise<AnalyzeViolationActionResult> {
  try {
    const result = await analyzePolicyViolation(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, error: errorMessage };
  }
}
