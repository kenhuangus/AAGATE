"use server";

import { detectAgentAnomalies, type DetectAgentAnomaliesInput } from "@/ai/flows/detect-agent-anomalies";

export async function detectAnomaliesAction(input: DetectAgentAnomaliesInput) {
  try {
    const result = await detectAgentAnomalies(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, error: errorMessage };
  }
}
