import crypto from "crypto";

import type {
  GovernancePolicy,
  GovernancePolicyInput,
  PolicyEvaluationInput,
  PolicyEvaluationResult,
} from "@/lib/governance-policy-types";

const signingKey =
  process.env.GOVERNANCE_POLICY_SIGNING_KEY ?? "dev-governance-key";

const seedPolicies: GovernancePolicyInput[] = [
  {
    id: "gov-001",
    name: "Data Access Control",
    description: "Allow only approved roles to access sensitive data sources.",
    control: "NIST AI RMF - V.1",
    version: "1.0.0",
    rule: {
      type: "role_action",
      allowRoles: ["admin", "auditor"],
      allowActions: ["read"],
    },
  },
  {
    id: "gov-002",
    name: "Behavioral Constraints",
    description: "Restrict agents to the allowed action list.",
    control: "NIST AI RMF - V.2",
    version: "1.0.0",
    rule: {
      type: "action_only",
      allowActions: ["query", "summarize", "translate"],
    },
  },
];

let policies: GovernancePolicy[] = seedPolicies.map(signPolicy);

function signPolicy(policy: GovernancePolicyInput): GovernancePolicy {
  const payload = JSON.stringify(policy);
  const signature = crypto
    .createHmac("sha256", signingKey)
    .update(payload)
    .digest("hex");
  return { ...policy, signature };
}

export async function listGovernancePolicies(): Promise<GovernancePolicy[]> {
  return policies.slice();
}

export async function addGovernancePolicy(
  input: GovernancePolicyInput
): Promise<GovernancePolicy> {
  const policy = signPolicy(input);
  policies = [policy, ...policies];
  return policy;
}

export async function resetGovernancePolicies(): Promise<void> {
  policies = seedPolicies.map(signPolicy);
}

export async function evaluatePolicies(
  input: PolicyEvaluationInput
): Promise<PolicyEvaluationResult> {
  const matchedPolicies: string[] = [];

  for (const policy of policies) {
    if (policy.rule.type === "role_action") {
      const roleMatch = policy.rule.allowRoles.includes(input.subject.role);
      const actionMatch =
        !policy.rule.allowActions ||
        policy.rule.allowActions.includes(input.action);
      if (roleMatch && actionMatch) {
        matchedPolicies.push(policy.id);
      }
    }

    if (policy.rule.type === "action_only") {
      if (policy.rule.allowActions.includes(input.action)) {
        matchedPolicies.push(policy.id);
      }
    }
  }

  const decision = matchedPolicies.length > 0 ? "allow" : "deny";
  const explanation =
    decision === "allow"
      ? "Request matched governance policies."
      : "No governance policy matched this request.";

  return { decision, matchedPolicies, explanation };
}
