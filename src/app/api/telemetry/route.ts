import { NextResponse } from "next/server";

import {
  publishTelemetry,
  listTelemetry,
  resetTelemetry,
  type TelemetryEvent,
} from "@/lib/telemetry-stream";

export async function GET() {
  const events = await listTelemetry();
  return NextResponse.json({ events });
}

export async function POST(request: Request) {
  const payload = (await request.json()) as TelemetryEvent;

  if (!payload?.eventType || !payload?.timestamp) {
    return NextResponse.json({ error: "Invalid telemetry event" }, { status: 400 });
  }

  await publishTelemetry(payload);
  return NextResponse.json({ status: "queued" }, { status: 202 });
}

export async function DELETE() {
  await resetTelemetry();
  return NextResponse.json({ status: "reset" });
}
