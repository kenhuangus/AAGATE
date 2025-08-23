"use server";

import { analyzePolicyViolation, type AnalyzePolicyViolationInput } from "@/ai/flows/analyze-policy-violation";

export async function analyzeViolationAction(input: AnalyzePolicyViolationInput) {
    try {
        const result = await analyzePolicyViolation(input);
        return { success: true, data: result };
    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return { success: false, error: errorMessage };
    }
}
