import { NextResponse } from "next/server";

import {
  governancePolicyInputSchema,
  type GovernancePolicyInput,
} from "@/lib/governance-policy-types";
import {
  addGovernancePolicy,
  listGovernancePolicies,
  resetGovernancePolicies,
} from "@/lib/governance-policies";

export async function GET() {
  const policies = await listGovernancePolicies();
  return NextResponse.json({ policies });
}

export async function POST(request: Request) {
  const payload = (await request.json()) as GovernancePolicyInput;
  const parsed = governancePolicyInputSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid governance policy", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const policy = await addGovernancePolicy(parsed.data);
  return NextResponse.json({ policy }, { status: 201 });
}

export async function DELETE() {
  await resetGovernancePolicies();
  return NextResponse.json({ status: "reset" });
}
