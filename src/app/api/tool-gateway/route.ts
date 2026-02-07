import { NextResponse } from "next/server";

import { handleToolRequest, type ToolRequest } from "@/lib/tool-gateway";

export async function POST(request: Request) {
  const payload = (await request.json()) as ToolRequest;

  if (!payload?.agentId || !payload?.action || !payload?.targetUrl) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }

  const result = await handleToolRequest(payload);
  return NextResponse.json(result, { status: result.decision === "allow" ? 200 : 403 });
}
