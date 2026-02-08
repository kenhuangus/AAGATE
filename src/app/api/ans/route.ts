import { NextResponse } from "next/server";

import {
  listAgents,
  registerAgent,
  resetAgents,
  revokeAgent,
  type AgentRegistration,
} from "@/lib/agent-registry";
import { publishTelemetry } from "@/lib/telemetry-stream";

export async function GET() {
  const agents = await listAgents();
  return NextResponse.json({ agents });
}

export async function POST(request: Request) {
  const payload = (await request.json()) as AgentRegistration;

  if (!payload?.id || !payload?.name || !payload?.publicKey) {
    return NextResponse.json({ error: "Invalid registration" }, { status: 400 });
  }

  const record = await registerAgent(payload);
  await publishTelemetry({
    eventType: "agent.registered",
    timestamp: new Date().toISOString(),
    payload: {
      agent: {
        id: record.id,
        name: record.name,
        type: "Agent",
        model: "unknown",
        version: "unknown",
        capabilities: record.capabilities,
        identity: record.identity,
      },
      metadata: {
        source: "ANS",
        correlationId: record.id,
      },
    },
  });
  return NextResponse.json({ record }, { status: 201 });
}

export async function DELETE(request: Request) {
  const payload = (await request.json()) as { agentId?: string };

  if (payload?.agentId) {
    await revokeAgent(payload.agentId);
    return NextResponse.json({ status: "revoked" });
  }

  await resetAgents();
  return NextResponse.json({ status: "reset" });
}
