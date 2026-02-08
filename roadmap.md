# AAGATE Roadmap (Epics + Milestones)

This roadmap turns the improvement recommendations into a concrete backlog. It follows the phased plan in the docs and is organized as milestones and epics.

## Milestone 0 — Documentation + Contracts (Phase 0)
**Goal:** Align the repo to the paper’s scope and lock event contracts.

### Epic 0.1 — Architecture + Gap Matrix
- Publish a component gap matrix enumerating required services (Tool-Gateway, ANS, GOA, UEBA, Janus, etc.), their status, and ownership.
- Ensure the MVP vs. control plane boundary is explicit.

### Epic 0.2 — Event Schema Lock (v1)
- Lock the event schemas into versioned JSON Schema files.
- Add validation guidance for producers/consumers.

## Milestone 1 — Governance Control Plane Foundations (Phase 1: Govern)
**Goal:** Move from mock policies to real governance enforcement.

### Epic 1.1 — OPA Policy Ingestion + Audit
- Signed policy bundles.
- Policy evaluation API + immutable audit log.

### Epic 1.2 — GitOps + Supply Chain
- CI to build/sign images.
- Helm/ArgoCD scaffolding.

### Epic 1.3 — Zero-Trust Mesh
- Istio mTLS + Cilium policy templates.
- Default-deny egress rules.

## Milestone 2 — Risk Mapping Core (Phase 2: Map)
**Goal:** Implement chokepoints and identity services.

### Epic 2.1 — Tool-Gateway Service
- Egress allowlists, rate limits, audit hashing.
- Emit `tool.invocation` events.

### Epic 2.2 — Agent Naming Service (ANS)
- DID/VC issuance.
- `agent.registered` events.

### Epic 2.3 — MAESTRO Crosswalk + LPCI Defenses
- Threat → mitigation mapping.
- Taint tracking and sanitization at gateway.

## Milestone 3 — Risk Measurement Pipeline (Phase 3: Measure)
**Goal:** Deterministic scoring and decisioning.

### Epic 3.1 — Telemetry Ingestion + Storage
- Kafka ingestion.
- Qdrant/Redis storage.

### Epic 3.2 — AIVSS Scoring Service
- Deterministic scoring with configurable weights.

### Epic 3.3 — SSVC Decision Engine
- Implement decision tree in GOA.

### Epic 3.4 — QSAF Monitoring
- Detect loops, starvation, flooding patterns.

## Milestone 4 — Proactive Defense & Response (Phase 4: Manage)
**Goal:** Active containment and incident response.

### Epic 4.1 — Janus Shadow-Monitor-Agent
- Pre-execution checks.

### Epic 4.2 — Kill Switch Containment
- Automated mesh policy injection.

### Epic 4.3 — Incident Response Broker
- Escalation + human-in-the-loop workflows.

## Milestone 5 — Accountability & Assurance (Phase 5)
**Goal:** Provide integrity guarantees and optional public auditability.

### Epic 5.1 — ZK Compliance Proofs
- Log integrity proofs.

### Epic 5.2 — Optional On-chain Hooks
- Agent registry + governance event mirroring.

### Epic 5.3 — DIRF Controls
- Consent, provenance, identity usage checks.
