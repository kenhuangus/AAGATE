"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createPolicy, updatePolicy } from "@/lib/data-store";

const policySchema = z.object({
  name: z.string().min(1, "Policy name is required."),
  description: z.string().min(1, "Policy description is required."),
  control: z.string().min(1, "Control is required."),
  regoCode: z.string().min(1, "Rego code is required."),
});

export type PolicyFormValues = z.infer<typeof policySchema>;

export async function createPolicyAction(input: PolicyFormValues) {
  const validated = policySchema.parse(input);
  const policy = await createPolicy(validated);
  revalidatePath("/policies");
  return policy;
}

export async function updatePolicyAction(policyId: string, input: PolicyFormValues) {
  const validated = policySchema.parse(input);
  const policy = await updatePolicy(policyId, validated);
  revalidatePath("/policies");
  return policy;
}
