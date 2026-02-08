# MAESTRO Threat Crosswalk (Draft v1)

This crosswalk maps MAESTRO layers to representative threats and AAGATE mitigations.

| MAESTRO Layer | Representative Threats | AAGATE Mitigations | Telemetry/Event Hooks |
| --- | --- | --- | --- |
| Model | Prompt injection, jailbreaks | Policy guardrails, prompt sanitization, tool gating | `policy.violation`, `agent.anomaly.detected` |
| Agent | Privilege escalation, unsafe tool use | ANS identity controls, tool-gateway allowlists | `agent.registered`, `tool.invocation` |
| Orchestration | Workflow abuse, cascading failures | Rate limits, kill switch containment | `tool.invocation`, `containment.executed` |
| Data | PII exposure, data exfiltration | LPCI sanitization, audit hashing | `policy.violation`, `tool.invocation` |
| Infrastructure | Lateral movement, egress abuse | Zero-trust mesh, default-deny egress | `containment.executed` |

This document is intended to evolve alongside threat intel and should be versioned with changes to event schemas.
