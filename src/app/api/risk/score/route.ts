import { NextResponse } from "next/server";

import { scoreAivss, type AivssInput } from "@/lib/aivss";

export async function POST(request: Request) {
  const payload = (await request.json()) as AivssInput;

  if (
    payload?.exploitation === undefined ||
    payload?.impact === undefined ||
    payload?.detectability === undefined
  ) {
    return NextResponse.json({ error: "Invalid AIVSS input" }, { status: 400 });
  }

  const result = scoreAivss(payload);
  return NextResponse.json({ result });
}
