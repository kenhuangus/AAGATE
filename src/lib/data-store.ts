import { promises as fs } from "fs";
import path from "path";
import type { Agent, Policy } from "./types";

type DataStore = {
  agents: Agent[];
  policies: Policy[];
};

const dataFilePath = path.join(process.cwd(), "src", "lib", "data-store.json");

async function readDataStore(): Promise<DataStore> {
  try {
    const rawData = await fs.readFile(dataFilePath, "utf-8");
    return JSON.parse(rawData) as DataStore;
  } catch (error) {
    throw new Error(`Failed to read data store: ${String(error)}`);
  }
}

async function writeDataStore(data: DataStore): Promise<void> {
  try {
    const serialized = JSON.stringify(data, null, 2);
    await fs.writeFile(dataFilePath, serialized, "utf-8");
  } catch (error) {
    throw new Error(`Failed to write data store: ${String(error)}`);
  }
}

export async function getAgents(): Promise<Agent[]> {
  const data = await readDataStore();
  return data.agents;
}

export async function getAgentById(agentId: string): Promise<Agent | undefined> {
  const data = await readDataStore();
  return data.agents.find((agent) => agent.id === agentId);
}

export async function getPolicies(): Promise<Policy[]> {
  const data = await readDataStore();
  return data.policies;
}

export async function createPolicy(input: Omit<Policy, "id">): Promise<Policy> {
  const data = await readDataStore();
  const newPolicy: Policy = {
    ...input,
    id: `p${Date.now()}`,
  };
  data.policies = [...data.policies, newPolicy];
  await writeDataStore(data);
  return newPolicy;
}

export async function updatePolicy(
  policyId: string,
  updates: Omit<Policy, "id">
): Promise<Policy> {
  const data = await readDataStore();
  const index = data.policies.findIndex((policy) => policy.id === policyId);
  if (index === -1) {
    throw new Error(`Policy ${policyId} not found.`);
  }
  const updatedPolicy: Policy = { id: policyId, ...updates };
  data.policies = [
    ...data.policies.slice(0, index),
    updatedPolicy,
    ...data.policies.slice(index + 1),
  ];
  await writeDataStore(data);
  return updatedPolicy;
}
