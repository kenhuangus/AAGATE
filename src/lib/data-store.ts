import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { z } from "zod";
import type { Agent, Policy } from "./types";

const dataFilePath = process.env.DATA_STORE_PATH
  ? path.resolve(process.env.DATA_STORE_PATH)
  : path.join(process.cwd(), "src", "lib", "data-store.json");

const agentSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["Language Model", "Autonomous Agent", "Data Analysis"]),
  status: z.enum(["Online", "Offline", "Warning"]),
  riskScore: z.number(),
  lastCheckIn: z.string(),
  model: z.string(),
  version: z.string(),
  riskHistory: z.array(z.object({ date: z.string(), riskScore: z.number() })),
  logs: z.array(
    z.object({
      timestamp: z.string(),
      level: z.enum(["INFO", "WARN", "ERROR"]),
      message: z.string(),
    })
  ),
  policies: z.array(z.string()),
});

const policySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  control: z.string(),
  regoCode: z.string(),
});

const dataStoreSchema = z.object({
  agents: z.array(agentSchema),
  policies: z.array(policySchema),
});

type DataStore = z.infer<typeof dataStoreSchema>;

async function readDataStore(): Promise<DataStore> {
  try {
    const rawData = await fs.readFile(dataFilePath, "utf-8");
    const parsed = JSON.parse(rawData);
    return dataStoreSchema.parse(parsed);
  } catch (error) {
    throw new Error(`Failed to read data store: ${String(error)}`);
  }
}

async function writeDataStore(data: DataStore): Promise<void> {
  try {
    const serialized = JSON.stringify(data, null, 2);
    const tempPath = `${dataFilePath}.${Date.now()}.tmp`;
    await fs.writeFile(tempPath, serialized, "utf-8");
    await fs.rename(tempPath, dataFilePath);
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
    id: `p-${randomUUID()}`,
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
