# AAGATE Improvement Plan (Paper Alignment Gap Analysis)

## Current Repository Snapshot (What Exists Today)
- The project is a Next.js/React dashboard with Genkit-based AI flows and mock data for agents and policies; there is no runtime governance control plane in this repo today. 【F:README.md†L11-L49】【F:src/lib/mock-data.ts†L1-L138】
- Two Genkit flows are implemented for anomaly detection and policy violation analysis, but they are prompt-driven UI helpers rather than production scoring/policy engines. 【F:src/ai/flows/detect-agent-anomalies.ts†L1-L60】【F:src/ai/flows/analyze-policy-violation.ts†L1-L64】
- The product blueprint lists UI features (overview, anomaly detection, policy management, shadow monitor, risk trends, violation analysis) aligned to a dashboard concept rather than a Kubernetes-native control plane. 【F:docs/blueprint.md†L1-L18】

## Gaps vs. the Paper (What’s Missing in This Repo)

### Govern (Foundation, Accountability, and Policy)
- **Signed supply chain + GitOps**: no build pipeline, signed images, or admission controls represented in-repo.
- **Zero-trust fabric**: no manifests or configurations for Istio mTLS, Cilium eBPF policies, or network segmentation.
- **Explainable policy engine**: current Rego policies are static mock samples; no policy ingestion, OPA evaluation service, or audit trail integration.
- **Decentralized accountability (optional)**: no on-chain ledger hooks, proof generation, or event mirroring.

### Map (MAESTRO Threat Mapping + Chokepoints)
- **Tool-Gateway chokepoint**: no service proxy, request auditing, or policy enforcement gateway for side-effects.
- **Agent Naming Service (ANS)**: no registry, DID/VC issuance, or service discovery layer.
- **LPCI defenses**: no taint tracking, tool/memory sanitization, or detection rules.

### Measure (AIVSS + SSVC + UEBA + QSAF)
- **AIVSS scoring**: not implemented as a scoring pipeline; anomaly detection is a prompt-based flow without a formal scoring model.
- **SSVC decisioning**: no decision tree, workflow, or incident schema.
- **UEBA behavior profiling**: no telemetry ingestion, feature extraction, or anomaly models.
- **QSAF monitoring**: no monitoring for cognitive degradation (loops, starvation, flooding).

### Manage (CSA Red Teaming + Containment)
- **Janus Shadow-Monitor-Agent**: no runtime shadow evaluation service or red team agent.
- **Millisecond kill switch**: no automated containment (e.g., Istio AuthorizationPolicy injection).
- **Incident response workflow**: no operational runbooks, escalation hooks, or incident broker.

### Platform/Deployment Gaps
- **Kubernetes manifests/Helm charts**: missing entire control plane deployment model described in the paper.
- **Observability stack**: no Prometheus/Grafana/Loki configuration or telemetry wiring.
- **Data-plane components**: no Kafka, Qdrant, Redis, or other services referenced in the architecture.

## Improvement Plan (Phased Roadmap)

### Phase 0 — Align the Repo to the Paper’s Scope (Documentation + Architecture)
1. **Add an architecture overview doc** that maps current UI features to the NIST AI RMF functions and clearly distinguishes “dashboard-only MVP” vs. “control plane target.”
2. **Publish a component gap matrix** that enumerates required services (Tool-Gateway, ANS, GOA, UEBA, Janus, etc.), their status, and ownership.
3. **Define event schemas** for policy violations, anomaly scores, and governance actions to avoid drift later.

### Phase 1 — Governance Control Plane Foundations (Govern)
1. **Policy ingestion service**: add an OPA/RegO policy engine with signed policy bundles and audit logs.
2. **GitOps + supply chain**: add CI to build/sign images and a Helm/ArgoCD structure for deploying the control plane.
3. **Zero-trust mesh**: include Istio + Cilium policy templates and default-deny egress rules.

### Phase 2 — Risk Mapping Core (Map)
1. **Tool-Gateway service** with strict allow lists, rate limits, and audit hashing.
2. **Agent Naming Service (ANS)** with DID/VC issuance and agent registration API.
3. **MAESTRO crosswalk artifacts**: provide a maintained map of layers → threats → mitigations.
4. **LPCI protection** with taint tracking and tool/memory sanitization at the gateway.

### Phase 3 — Risk Measurement Pipeline (Measure)
1. **Telemetry ingestion** (Kafka) and storage (Qdrant/Redis) for UEBA.
2. **AIVSS scoring engine** as a deterministic service, with configurable weights.
3. **SSVC decision tree** implemented in the GOA to route risk outcomes.
4. **QSAF monitors** to detect cognitive degradation patterns.

### Phase 4 — Proactive Defense & Response (Manage)
1. **Janus Shadow-Monitor-Agent** service to run pre-execution checks.
2. **Automated containment** through mesh policy injection (kill switch).
3. **Incident response broker** with escalation and human-in-the-loop workflows.

### Phase 5 — Accountability & Assurance
1. **ZK compliance proofs** for log integrity and budget enforcement.
2. **Optional on-chain hooks** for agent registry and governance events.
3. **DIRF controls** for consent, provenance, and identity usage checks.

## Recommended Next Actions (Short-Term)
- Start with **Phase 0 docs + schemas**, then implement **Phase 1** with OPA policy ingestion and GitOps scaffolding. This will anchor the repo to the paper’s governance model and provide a foundation for later MAESTRO/AIVSS/SSVC integrations.
- Keep the UI dashboard, but wire it to real governance events/services instead of mock data.
