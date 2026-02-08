# AAGATE Component Gap Matrix (MVP vs. Control Plane)

This matrix enumerates the services described in the paper and tracks their status in the repo.

| Component | RMF Function | Purpose | Repo Status | Notes/Owner |
| --- | --- | --- | --- | --- |
| Governance Policy API | Govern | Policy ingestion + evaluation | Prototype API | Replace in-memory store with persistent service. |
| Policy Audit Log | Govern | Immutable decision trail | Prototype API | Wire to durable storage and signing. |
| GitOps/Supply Chain | Govern | Signed builds + deploy | Missing | Add CI + signing + ArgoCD/Helm. |
| Zero-Trust Mesh | Govern | mTLS + segmentation | Missing | Provide Istio/Cilium policies. |
| Tool-Gateway | Map | Egress policy chokepoint | Prototype API | Add rate limits + audit hashing. |
| Agent Naming Service (ANS) | Map | Identity registry + DID/VC | Prototype API | Add issuance + revocation workflows. |
| MAESTRO Crosswalk | Map | Threat-to-mitigation map | Missing | Publish maintained crosswalk artifacts. |
| LPCI Defenses | Map | Taint tracking/sanitization | Missing | Implement at gateway layer. |
| AIVSS Scoring Engine | Measure | Deterministic scoring | Prototype API | Expand into pipeline + telemetry inputs. |
| SSVC Decision Engine | Measure | Decision workflow | Prototype API | Implement decision trees + routing. |
| UEBA Pipeline | Measure | Behavior profiling | Missing | Telemetry ingestion + feature extraction. |
| QSAF Monitors | Measure | Cognitive degradation | Missing | Detect loops/starvation/flooding. |
| Janus SMA | Manage | Shadow monitoring + kill switch | Prototype API | Add runtime hooks + policy injection. |
| Incident Broker | Manage | Response orchestration | Missing | Build escalation workflows. |
| ZK Compliance Proofs | Accountability | Log integrity proofs | Missing | Optional phase 5 feature. |
| On-chain Hooks | Accountability | Event mirroring | Missing | Optional phase 5 feature. |
| DIRF Controls | Accountability | Consent/provenance/ID checks | Missing | Optional phase 5 feature. |
