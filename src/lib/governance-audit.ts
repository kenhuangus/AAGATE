import crypto from "crypto";

import type {
  PolicyEvaluationInput,
  PolicyEvaluationResult,
} from "@/lib/governance-policy-types";

export type PolicyAuditEntry = {
  id: string;
  timestamp: string;
  subject: PolicyEvaluationInput["subject"];
  action: string;
  resource?: string;
  decision: PolicyEvaluationResult["decision"];
  matchedPolicies: string[];
  explanation: string;
};

let auditLog: PolicyAuditEntry[] = [];

export async function recordPolicyAudit(
  input: PolicyEvaluationInput,
  result: PolicyEvaluationResult
): Promise<PolicyAuditEntry> {
  const entry: PolicyAuditEntry = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    subject: input.subject,
    action: input.action,
    resource: input.resource,
    decision: result.decision,
    matchedPolicies: result.matchedPolicies,
    explanation: result.explanation,
  };

  auditLog = [entry, ...auditLog].slice(0, 100);
  return entry;
}

export async function listPolicyAudit(): Promise<PolicyAuditEntry[]> {
  return auditLog.slice();
}

export async function resetPolicyAudit(): Promise<void> {
  auditLog = [];
}
