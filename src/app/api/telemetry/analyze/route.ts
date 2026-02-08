import { NextResponse } from "next/server";

import { runTelemetryAnalysis } from "@/lib/telemetry-analysis";

export async function GET() {
  const result = await runTelemetryAnalysis();
  return NextResponse.json(result);
}
