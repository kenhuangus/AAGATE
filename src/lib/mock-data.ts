import type { Agent, Policy } from './types';

export const policies: Policy[] = [
  {
    id: 'p001',
    name: 'Data Access Control',
    description: 'Ensures agents only access authorized data sources.',
    control: 'NIST AI RMF - V.1',
    regoCode: `package aagate

default allow = false

allow {
    input.subject.role == "admin"
}

allow {
    input.subject.role == "auditor"
    input.action == "read"
}`,
  },
  {
    id: 'p002',
    name: 'Behavioral Constraints',
    description: 'Restricts agent actions to a predefined set of operations.',
    control: 'NIST AI RMF - V.2',
    regoCode: `package aagate

default allow = false

allowed_actions := {"query", "summarize", "translate"}

allow {
    allowed_actions[input.action]
}`,
  },
  {
    id: 'p003',
    name: 'PII Redaction',
    description: 'Requires the agent to redact Personally Identifiable Information from its outputs.',
    control: 'NIST AI RMF - P.2',
    regoCode: `package aagate

default requires_redaction = false

requires_redaction {
    contains(input.data, "pii")
}`,
  },
];

export const agents: Agent[] = [
  {
    id: 'agent-001',
    name: 'Janus',
    type: 'Autonomous Agent',
    status: 'Online',
    riskScore: 22,
    lastCheckIn: '2024-07-31T10:00:00Z',
    model: 'Gemini 2.0-Flash',
    version: '1.2.3',
    riskHistory: [
      { date: '2024-07-25', riskScore: 20 },
      { date: '2024-07-26', riskScore: 21 },
      { date: '2024-07-27', riskScore: 20 },
      { date: '2024-07-28', riskScore: 23 },
      { date: '2024-07-29', riskScore: 22 },
      { date: '2024-07-30', riskScore: 22 },
      { date: '2024-07-31', riskScore: 22 },
    ],
    logs: [
        { timestamp: '2024-07-31T10:00:00Z', level: 'INFO', message: 'Agent online and connected.' },
        { timestamp: '2024-07-31T10:01:15Z', level: 'INFO', message: 'Executing task: Summarize_Report_A.pdf' },
    ],
    policies: ['p001', 'p002'],
  },
  {
    id: 'agent-002',
    name: 'Cerebra',
    type: 'Language Model',
    status: 'Online',
    riskScore: 8,
    lastCheckIn: '2024-07-31T10:02:15Z',
    model: 'Gemini 2.0-Nano',
    version: '2.0.1',
    riskHistory: [
        { date: '2024-07-25', riskScore: 10 },
        { date: '2024-07-26', riskScore: 9 },
        { date: '2024-07-27', riskScore: 9 },
        { date: '2024-07-28', riskScore: 8 },
        { date: '2024-07-29', riskScore: 8 },
        { date: '2024-07-30', riskScore: 7 },
        { date: '2024-07-31', riskScore: 8 },
    ],
    logs: [
        { timestamp: '2024-07-31T10:02:15Z', level: 'INFO', message: 'Agent online and connected.' },
    ],
    policies: ['p002', 'p003'],
  },
  {
    id: 'agent-003',
    name: 'Sentinel',
    type: 'Data Analysis',
    status: 'Warning',
    riskScore: 78,
    lastCheckIn: '2024-07-31T09:55:30Z',
    model: 'Custom-Analytics-v3',
    version: '3.1.0',
    riskHistory: [
        { date: '2024-07-25', riskScore: 45 },
        { date: '2024-07-26', riskScore: 48 },
        { date: '2024-07-27', riskScore: 55 },
        { date: '2024-07-28', riskScore: 65 },
        { date: '2024-07-29', riskScore: 72 },
        { date: '2024-07-30', riskScore: 75 },
        { date: '2024-07-31', riskScore: 78 },
    ],
    logs: [
        { timestamp: '2024-07-31T09:55:30Z', level: 'INFO', message: 'Agent online and connected.' },
        { timestamp: '2024-07-31T09:58:00Z', level: 'WARN', message: 'High memory usage detected: 92%.' },
        { timestamp: '2024-07-31T09:59:05Z', level: 'ERROR', message: 'Failed to access data source: /secure/db1. Permission denied.' },
    ],
    policies: ['p001'],
  },
  {
    id: 'agent-004',
    name: 'Oracle',
    type: 'Language Model',
    status: 'Offline',
    riskScore: 45,
    lastCheckIn: '2024-07-30T18:30:00Z',
    model: 'Gemini 2.0-Flash',
    version: '1.5.0',
    riskHistory: [
        { date: '2024-07-25', riskScore: 40 },
        { date: '2024-07-26', riskScore: 42 },
        { date: '2024-07-27', riskScore: 41 },
        { date: '2024-07-28', riskScore: 43 },
        { date: '2024-07-29', riskScore: 45 },
        { date: '2024-07-30', riskScore: 45 },
        { date: '2024-07-31', riskScore: 45 },
    ],
    logs: [
        { timestamp: '2024-07-30T18:30:00Z', level: 'ERROR', message: 'Agent connection lost. Last heartbeat missed.' },
    ],
    policies: ['p001', 'p002', 'p003'],
  },
];
