import { NextResponse } from "next/server";

import { listPolicyAudit, resetPolicyAudit } from "@/lib/governance-audit";

export async function GET() {
  const audit = await listPolicyAudit();
  return NextResponse.json({ audit });
}

export async function DELETE() {
  await resetPolicyAudit();
  return NextResponse.json({ status: "reset" });
}
