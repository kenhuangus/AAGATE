# AAGATE Event Schemas (Locked v1)

These schemas define the minimal contract between the dashboard UI and the future control plane services. They are **implementation-agnostic** and can be mapped to Kafka topics, HTTP APIs, or a logging pipeline.

## Versioned JSON Schemas (v1)
The v1 contracts are now locked and published as JSON Schema files in `docs/schemas/`:
- `agent-registered.v1.schema.json`
- `tool-invocation.v1.schema.json`
- `agent-anomaly-detected.v1.schema.json`
- `policy-violation.v1.schema.json`
- `containment-executed.v1.schema.json`

## Reference API (local demo)
The dashboard now includes a lightweight Next.js API route for demo purposes:
- `GET /api/governance-events` → list events
- `POST /api/governance-events` → append an event (validated by `GovernanceEventSummary`)
- `DELETE /api/governance-events` → reset to seed data

## 1) Agent Registration Event
```json
{
  "eventType": "agent.registered",
  "eventId": "uuid",
  "timestamp": "2025-01-01T00:00:00Z",
  "agent": {
    "id": "agent-123",
    "name": "Janus",
    "type": "Autonomous Agent",
    "model": "Gemini 2.0-Flash",
    "version": "1.2.3",
    "riskTier": "TierHigh",
    "capabilities": ["summarize", "query"],
    "identity": {
      "did": "did:example:abc",
      "vcHash": "sha256:...",
      "spiffeId": "spiffe://aagate/agent-123"
    }
  },
  "metadata": {
    "source": "ANS",
    "correlationId": "uuid"
  }
}
```

## 2) Tool-Gateway Invocation Event
```json
{
  "eventType": "tool.invocation",
  "eventId": "uuid",
  "timestamp": "2025-01-01T00:00:00Z",
  "agentId": "agent-123",
  "tool": {
    "name": "http.request",
    "target": "https://api.example.com/resource",
    "method": "POST",
    "purpose": "sync_customer_record"
  },
  "policy": {
    "decision": "allow",
    "policyIds": ["p001"],
    "regoBundleHash": "sha256:..."
  },
  "risk": {
    "aivssScore": 6.2,
    "ssvcDecision": "Track"
  },
  "audit": {
    "requestHash": "sha256:...",
    "responseHash": "sha256:..."
  }
}
```

## 3) Anomaly Detection Event
```json
{
  "eventType": "agent.anomaly.detected",
  "eventId": "uuid",
  "timestamp": "2025-01-01T00:00:00Z",
  "agentId": "agent-123",
  "anomaly": {
    "isAnomalous": true,
    "score": 78,
    "signals": ["recursive_calls", "memory_spike"],
    "explanation": "Behavior deviates from baseline."
  },
  "risk": {
    "aivssVector": "CVSS:8.1/AARS:7.2",
    "aivssScore": 7.6
  }
}
```

## 4) Policy Violation Event
```json
{
  "eventType": "policy.violation",
  "eventId": "uuid",
  "timestamp": "2025-01-01T00:00:00Z",
  "agentId": "agent-123",
  "policy": {
    "id": "p003",
    "name": "PII Redaction",
    "decision": "deny"
  },
  "evidence": {
    "logRefs": ["loki://..."],
    "summary": "PII detected in output."
  },
  "risk": {
    "aivssScore": 8.7,
    "ssvcDecision": "Quarantine"
  }
}
```

## 5) Containment Action Event
```json
{
  "eventType": "containment.executed",
  "eventId": "uuid",
  "timestamp": "2025-01-01T00:00:00Z",
  "agentId": "agent-123",
  "action": {
    "type": "kill_switch",
    "details": "Istio AuthorizationPolicy applied: deny all egress",
    "initiator": "GOA"
  },
  "reason": {
    "trigger": "janus.alert=CRITICAL",
    "ssvcDecision": "Quarantine"
  }
}
```
