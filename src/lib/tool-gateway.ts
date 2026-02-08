import crypto from "crypto";

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
const rateLimitWindowMs = 60_000;
const rateLimitMax = Number(process.env.TOOL_GATEWAY_RATE_LIMIT_PER_MIN ?? "60");
const requestLog = new Map<string, number[]>();

const sensitiveIndicators = [
  "ssn",
  "social security",
  "credit card",
  "password",
  "api_key",
  "private_key",
  "secret",
  "pii",
];

function isAllowedTarget(targetUrl: string) {
  if (allowList.length === 0) return true;
  return allowList.some(prefix => targetUrl.startsWith(prefix));
}

function hashPayload(payload: unknown) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(payload ?? {}))
    .digest("hex");
}

function hasSensitiveContent(body: unknown) {
  const serialized = JSON.stringify(body ?? "").toLowerCase();
  return sensitiveIndicators.some((indicator) => serialized.includes(indicator));
}

function enforceRateLimit(agentId: string) {
  const now = Date.now();
  const windowStart = now - rateLimitWindowMs;
  const timestamps = requestLog.get(agentId) ?? [];
  const recent = timestamps.filter((timestamp) => timestamp >= windowStart);
  if (recent.length >= rateLimitMax) {
    requestLog.set(agentId, recent);
    return false;
  }
  recent.push(now);
  requestLog.set(agentId, recent);
  return true;
}

async function emitToolInvocationEvent(params: {
  request: ToolRequest;
  decision: "allow" | "deny";
  policyIds: string[];
  requestHash: string;
  responseHash?: string;
}) {
  const audit: { requestHash: string; responseHash?: string } = {
    requestHash: params.requestHash,
  };
  if (params.responseHash) {
    audit.responseHash = params.responseHash;
  }

  await publishTelemetry({
    eventType: "tool.invocation",
    timestamp: new Date().toISOString(),
    payload: {
      agentId: params.request.agentId,
      tool: {
        name: params.request.action,
        target: params.request.targetUrl,
        method: params.request.method ?? "POST",
      },
      policy: {
        decision: params.decision,
        policyIds: params.policyIds,
      },
      audit,
    },
  });
}

export async function handleToolRequest(
  request: ToolRequest
): Promise<ToolResponse> {
  const requestHash = hashPayload({
    agentId: request.agentId,
    action: request.action,
    targetUrl: request.targetUrl,
    body: request.body,
  });

  if (await isQuarantined(request.agentId)) {
    await emitToolInvocationEvent({
      request,
      decision: "deny",
      policyIds: ["killswitch"],
      requestHash,
    });
    return { decision: "deny", reason: "Agent quarantined by kill switch." };
  }

  if (!isAllowedTarget(request.targetUrl)) {
    await emitToolInvocationEvent({
      request,
      decision: "deny",
      policyIds: ["allowlist"],
      requestHash,
    });
    return { decision: "deny", reason: "Target URL not in allowlist." };
  }

  if (!enforceRateLimit(request.agentId)) {
    await emitToolInvocationEvent({
      request,
      decision: "deny",
      policyIds: ["rate-limit"],
      requestHash,
    });
    return { decision: "deny", reason: "Rate limit exceeded." };
  }

  if (hasSensitiveContent(request.body)) {
    await emitToolInvocationEvent({
      request,
      decision: "deny",
      policyIds: ["lpci-sanitization"],
      requestHash,
    });
    return { decision: "deny", reason: "Sensitive data detected in payload." };
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
    await emitToolInvocationEvent({
      request,
      decision: "deny",
      policyIds: evaluation.matchedPolicies,
      requestHash,
    });
    return { decision: "deny", reason: evaluation.explanation };
  }

  const response = await fetch(request.targetUrl, {
    method: request.method ?? "POST",
    headers: { "Content-Type": "application/json" },
    body: request.body ? JSON.stringify(request.body) : undefined,
  });

  const upstreamBody = await response.json().catch(() => null);
  const responseHash = hashPayload(upstreamBody);
  await emitToolInvocationEvent({
    request,
    decision: "allow",
    policyIds: evaluation.matchedPolicies,
    requestHash,
    responseHash,
  });

  return {
    decision: "allow",
    reason: "Policy evaluation passed.",
    upstreamStatus: response.status,
    upstreamBody,
  };
}
