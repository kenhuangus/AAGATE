import { evaluatePolicies } from "@/lib/governance-policies";
import { recordPolicyAudit } from "@/lib/governance-audit";
import { isQuarantined } from "@/lib/killswitch";
import { publishTelemetry } from "@/lib/telemetry-stream";

export type ToolRequest = {
  agentId: string;
  subjectRole: string;
  action: string;
  targetUrl: string;
  method?: string;
  body?: unknown;
};

export type ToolResponse = {
  decision: "allow" | "deny";
  reason: string;
  upstreamStatus?: number;
  upstreamBody?: unknown;
};

const allowList = (process.env.TOOL_GATEWAY_ALLOWLIST ?? "").split(",").filter(Boolean);

function isAllowedTarget(targetUrl: string) {
  if (allowList.length === 0) return true;
  return allowList.some(prefix => targetUrl.startsWith(prefix));
}

export async function handleToolRequest(
  request: ToolRequest
): Promise<ToolResponse> {
  if (await isQuarantined(request.agentId)) {
    return { decision: "deny", reason: "Agent quarantined by kill switch." };
  }

  if (!isAllowedTarget(request.targetUrl)) {
    return { decision: "deny", reason: "Target URL not in allowlist." };
  }

  const evaluation = await evaluatePolicies({
    subject: { id: request.agentId, role: request.subjectRole },
    action: request.action,
    resource: request.targetUrl,
  });
  await recordPolicyAudit(
    {
      subject: { id: request.agentId, role: request.subjectRole },
      action: request.action,
      resource: request.targetUrl,
    },
    evaluation
  );

  if (evaluation.decision === "deny") {
    return { decision: "deny", reason: evaluation.explanation };
  }

  const response = await fetch(request.targetUrl, {
    method: request.method ?? "POST",
    headers: { "Content-Type": "application/json" },
    body: request.body ? JSON.stringify(request.body) : undefined,
  });

  const upstreamBody = await response.json().catch(() => null);

  await publishTelemetry({
    eventType: "tool.invocation",
    timestamp: new Date().toISOString(),
    payload: {
      agentId: request.agentId,
      action: request.action,
      targetUrl: request.targetUrl,
      status: response.status,
    },
  });

  return {
    decision: "allow",
    reason: "Policy evaluation passed.",
    upstreamStatus: response.status,
    upstreamBody,
  };
}
