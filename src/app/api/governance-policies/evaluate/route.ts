import { NextResponse } from "next/server";

import {
  policyEvaluationInputSchema,
  type PolicyEvaluationInput,
} from "@/lib/governance-policy-types";
import { evaluatePolicies } from "@/lib/governance-policies";
import { recordPolicyAudit } from "@/lib/governance-audit";

export async function POST(request: Request) {
  const payload = (await request.json()) as PolicyEvaluationInput;
  const parsed = policyEvaluationInputSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid policy evaluation input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const result = await evaluatePolicies(parsed.data);
  const auditEntry = await recordPolicyAudit(parsed.data, result);

  return NextResponse.json({ result, auditEntry }, { status: 200 });
}
