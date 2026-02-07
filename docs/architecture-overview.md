# AAGATE Architecture Overview (MVP vs. Target Control Plane)

## Purpose
This document clarifies the scope of the current **dashboard MVP** in this repo and the **target control plane** described in the AAGATE paper. It also maps existing UI features to the NIST AI RMF functions (Govern, Map, Measure, Manage) so contributors can track alignment over time.

## Current MVP (Dashboard Scope)
The repo currently implements a web-based governance dashboard with Genkit-assisted analysis and mock data. Core capabilities include:
- **Overview**: agent status and risk trends.
- **Anomaly Detection**: AI-assisted classification of behavioral signals.
- **Policy Management**: Rego policy viewing and editing.
- **Shadow Monitor**: drift comparison UI.
- **Violation Analysis**: AI-assisted classification and remediation guidance.

These features provide visibility and analysis but **do not** implement the runtime control plane (tool gateway, policy enforcement, containment, etc.).

## Target Control Plane (Paper Scope)
The AAGATE paper describes a Kubernetes-native governance control plane that implements the NIST AI RMF with:
- **Govern**: signed supply chain, GitOps, zero-trust mesh, policy engine, accountability hooks.
- **Map**: MAESTRO threat mapping, Agent Naming Service (ANS), Tool-Gateway chokepoint.
- **Measure**: UEBA pipeline, AIVSS scoring, SSVC decisioning, QSAF monitors.
- **Manage**: Janus Shadow-Monitor-Agent, kill switch containment, incident response workflows.

This repo does not yet include these runtime services, manifests, or enforcement mechanisms.

## RMF Function Mapping (MVP vs. Target)
| RMF Function | MVP in this Repo | Target Control Plane Components |
| --- | --- | --- |
| **Govern** | Policy UI, mock Rego policies | Signed images, GitOps, OPA policy ingestion, zero-trust mesh, audit ledger |
| **Map** | Violation analysis context | MAESTRO mapping, ANS registry, Tool-Gateway chokepoint, LPCI defenses |
| **Measure** | Genkit anomaly detection UI | UEBA pipeline, AIVSS scoring service, SSVC decision tree, QSAF monitors |
| **Manage** | Violation analysis suggestions | Janus SMA, kill switch, incident broker, automated containment |

## Next Steps
- Implement the **event schemas** in `docs/event-schemas.md` as the contract between UI and control plane.
- Add service scaffolding (Phase 1–2) to begin moving from dashboard-only to control plane.

## Governance Engine (Implemented Demo)
The repository now ships a lightweight governance engine to demonstrate the **Govern** function end-to-end in code:
- **Governance policy API** (`/api/governance-policies`) with signing and input validation.
- **Policy evaluation endpoint** (`/api/governance-policies/evaluate`) that records immutable audit entries.
- **Audit log API** (`/api/governance-policies/audit`) to expose decisions to the dashboard.

This is an in-memory, local demo implementation intended to be replaced by persistent services in production.

## Runtime Control Plane (Code Prototypes)
The following runtime service APIs are implemented as production-ready prototypes:
- **Tool-Gateway** (`/api/tool-gateway`): policy-enforced egress proxy with allowlisting, policy evaluation, and telemetry events.
- **Agent Naming Service (ANS)** (`/api/ans`): agent registration, identity issuance, and revocation.
- **Risk Engines** (`/api/risk/score`, `/api/risk/decision`): AIVSS scoring and SSVC decisions.
- **Janus SMA** (`/api/janus`): shadow-monitor evaluation and kill switch enforcement.
- **Telemetry Stream** (`/api/telemetry`): Kafka REST proxy integration or in-memory fallback.
