import crypto from "crypto";

export type AgentIdentity = {
  did: string;
  vcHash: string;
  spiffeId: string;
};

export type AgentRegistration = {
  id: string;
  name: string;
  capabilities: string[];
  publicKey: string;
};

export type AgentRecord = AgentRegistration & {
  identity: AgentIdentity;
  registeredAt: string;
  status: "active" | "revoked";
};

let registry: AgentRecord[] = [];

function generateDid(agentId: string) {
  return `did:aagate:${agentId}`;
}

function issueIdentity(agentId: string): AgentIdentity {
  const did = generateDid(agentId);
  const vcHash = crypto
    .createHash("sha256")
    .update(`${did}:${Date.now()}`)
    .digest("hex");
  return {
    did,
    vcHash,
    spiffeId: `spiffe://aagate/${agentId}`,
  };
}

export async function registerAgent(
  registration: AgentRegistration
): Promise<AgentRecord> {
  const identity = issueIdentity(registration.id);
  const record: AgentRecord = {
    ...registration,
    identity,
    registeredAt: new Date().toISOString(),
    status: "active",
  };
  registry = [record, ...registry.filter(r => r.id !== registration.id)];
  return record;
}

export async function listAgents(): Promise<AgentRecord[]> {
  return registry.slice();
}

export async function revokeAgent(agentId: string): Promise<void> {
  registry = registry.map(record =>
    record.id === agentId ? { ...record, status: "revoked" } : record
  );
}

export async function resetAgents(): Promise<void> {
  registry = [];
}
