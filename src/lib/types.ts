export type Agent = {
  id: string;
  name: string;
  type: 'Language Model' | 'Autonomous Agent' | 'Data Analysis';
  status: 'Online' | 'Offline' | 'Warning';
  riskScore: number;
  lastCheckIn: string;
  model: string;
  version: string;
  riskHistory: RiskHistory[];
  logs: AgentLog[];
  policies: string[]; // array of policy IDs
};

export type RiskHistory = {
  date: string;
  riskScore: number;
};

export type AgentLog = {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
};

export type Policy = {
  id: string;
  name: string;
  description: string;
  control: string;
  regoCode: string;
};
