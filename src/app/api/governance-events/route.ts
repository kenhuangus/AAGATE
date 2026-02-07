import { NextResponse } from "next/server";
import {
  governanceEventSummarySchema,
  type GovernanceEventSummary,
} from "@/lib/event-schemas";
import {
  addGovernanceEvent,
  getGovernanceEvents,
  resetGovernanceEvents,
} from "@/lib/governance-store";

export async function GET() {
  const events = await getGovernanceEvents();
  return NextResponse.json({ events });
}

export async function POST(request: Request) {
  const payload = (await request.json()) as GovernanceEventSummary;
  const parsed = governanceEventSummarySchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid event payload", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const event = await addGovernanceEvent(parsed.data);
  return NextResponse.json({ event }, { status: 201 });
}

export async function DELETE() {
  await resetGovernanceEvents();
  return NextResponse.json({ status: "reset" });
}
