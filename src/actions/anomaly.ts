"use server";

import {
  detectAgentAnomalies,
  type DetectAgentAnomaliesInput,
  type DetectAgentAnomaliesOutput,
} from "@/ai/flows/detect-agent-anomalies";

export type DetectAnomaliesActionResult =
  | { success: true; data: DetectAgentAnomaliesOutput }
  | { success: false; error: string };

export async function detectAnomaliesAction(
  input: DetectAgentAnomaliesInput
): Promise<DetectAnomaliesActionResult> {
  try {
    const result = await detectAgentAnomalies(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, error: errorMessage };
  }
}
