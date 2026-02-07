import { NextResponse } from "next/server";

import { evaluateJanus, type JanusInput } from "@/lib/janus-sma";

export async function POST(request: Request) {
  const payload = (await request.json()) as JanusInput;

  if (!payload?.agentId || !payload?.plannedAction) {
    return NextResponse.json({ error: "Invalid Janus input" }, { status: 400 });
  }

  const result = await evaluateJanus(payload);
  return NextResponse.json({ result });
}
