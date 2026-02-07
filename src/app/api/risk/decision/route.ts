import { NextResponse } from "next/server";

import { decideSsvc, type SsvcInput } from "@/lib/ssvc";

export async function POST(request: Request) {
  const payload = (await request.json()) as SsvcInput;

  if (!payload?.exploitation || !payload?.impact) {
    return NextResponse.json({ error: "Invalid SSVC input" }, { status: 400 });
  }

  const decision = decideSsvc(payload);
  return NextResponse.json({ decision });
}
