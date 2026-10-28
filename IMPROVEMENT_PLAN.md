# AAGATE Improvement Plan: From Dashboard MVP to Production AI Agent Security Platform

**Goal:** Transform AAGATE from a read-only governance dashboard into a production-ready platform that can actually secure AI agents in real deployments.

**Current State:** Next.js dashboard with mock data, in-memory state, no authentication, no real agent integration, no persistence. Provides visibility but cannot enforce security controls at runtime.

**Target State:** Runtime governance control plane implementing NIST AI RMF (Govern, Map, Measure, Manage) with real enforcement, identity, persistence, and multi-tenant isolation.

---

## Executive Summary

| Area | Current State | Target State | Priority |
|------|--------------|--------------|----------|
| Data Persistence | In-memory only (lost on restart) | Persistent database (PostgreSQL/Redis) | P0 |
| Authentication | None (open access) | OAuth2/OIDC + RBAC + API keys | P0 |
| Agent Integration | Mock agents only | Agent SDK + mTLS + registration workflow | P0 |
| Policy Enforcement | Rego stored but not evaluated by OPA | OPA sidecar + signed policy bundles | P0 |
| Secrets Management | Env vars / hardcoded | Vault/Secret Manager integration | P0 |
| Supply Chain | None | Image signing, SBOM, provenance | P1 |
| Multi-tenancy | Single org | Workspaces, RBAC, data isolation | P1 |
| Alerting | None | Email, Slack, PagerDuty webhooks | P1 |
| Audit Integrity | In-memory, mutable | Append-only, tamper-evident log | P1 |
| Real-time Monitoring | Polling only | WebSockets, event streaming | P2 |
| Compliance Reporting | None | NIST AI RMF, SOC2, ISO 27001 reports | P2 |

---

## Phase 0: Foundation & Security Hardening (Weeks 1-4)

### P0: Critical Security Fixes

### 1. Authentication & Authorization System

**Files to create:**
- `src/lib/auth.ts` - Session management, JWT handling, RBAC
- `src/middleware.ts` - Route-level auth middleware
- `src/app/api/auth/login/route.ts` - Login endpoint
- `src/app/api/auth/logout/route.ts` - Logout endpoint
- `src/app/api/auth/me/route.ts` - Current user info

**What to implement:**
- OAuth2/OIDC login (Google, GitHub, or custom provider)
- Session cookies: HttpOnly, Secure, SameSite=Strict
- RBAC roles: `admin`, `security-operator`, `viewer`
- API key management for programmatic access
- Route protection: all `/api/*` endpoints require valid session or API key

**Security impact:** Prevents unauthorized access to agent controls, kill switches, and policy management.

### 2. Persistent Data Store

**Files to create:**
- `src/lib/db.ts` - Database connection (PostgreSQL via Prisma/Drizzle)
- `prisma/schema.prisma` - Data models
- `prisma/migrations/` - Database migrations

**Models needed:**
- `Agent` - registered agents with identity, status, risk score
- `Policy` - governance policies with versions and signatures
- `AuditLog` - immutable policy evaluation records
- `TelemetryEvent` - agent telemetry events
- `User` - platform users with roles
- `Organization` - multi-tenant orgs
- `KillSwitchRecord` - kill switch activations

**Security impact:** Data survives restarts; enables audit trails and historical analysis.

### 3. Secrets Management

**Files to create:**
- `src/lib/secrets.ts` - Secret retrieval abstraction
- `.env.example` - Template for required secrets

**What to implement:**
- Remove all hardcoded secrets (`dev-governance-key`, etc.)
- Integrate with HashiCorp Vault, AWS Secrets Manager, or env-based secrets
- Encrypt sensitive fields at rest (API keys, private keys)

**Security impact:** Prevents secret leakage via source code or logs.

---

## Phase 3: Operations & Compliance (Weeks 17-24)

### P2: Production Readiness

### 11. Multi-Tenancy

**Files to create/modify:**
- `src/lib/tenant-context.ts` - Tenant isolation middleware
- `src/app/api/orgs/route.ts` - Organization management

**What to implement:**
- Organization-level data isolation
- Per-org policy sets and risk thresholds
- Per-org billing and usage quotas
- Cross-org audit visibility (for MSSPs)

### 12. Alerting & Notification

**Files to create:**
- `src/lib/alert-manager.ts` - Alert rule evaluation
- `src/lib/notifier.ts` - Notification dispatch (email, Slack, PagerDuty)
- `src/app/api/alerts/route.ts` - Alert management API

**What to implement:**
- Alert rules: risk score threshold, anomaly detected, kill switch activated
- Notification channels: email, Slack webhook, PagerDuty
- Alert escalation: notify security team after N minutes unacknowledged
- Alert suppression windows

### 13. Audit Trail Integrity

**Files to create/modify:**
- `src/lib/audit-chain.ts` - Hash-chained audit log
- `src/lib/audit-export.ts` - Export audit logs for compliance

**What to implement:**
- Append-only audit log with SHA-256 hash chaining
- Tamper-evident log entries
- Export to SIEM (Splunk, ELK, Sentinel)
- Retention policies per compliance requirement

### 14. Compliance Reporting

**Files to create:**
- `src/lib/compliance-reporter.ts` - Generate compliance reports
- `src/app/api/compliance/reports/route.ts` - Report generation API

**What to implement:**
- NIST AI RMF control mapping report
- SOC2 Type II evidence collection
- ISO 27001 Annex A controls evidence
- Executive summary dashboard

---

## Phase 4: Advanced Capabilities (Weeks 25+)

### P2/P3: Advanced Security

### 15. Zero-Trust Mesh Integration

**Files to create:**
- `src/lib/istio-policies.ts` - Istio AuthorizationPolicy generation
- `src/lib/cilium-policies.ts` - Cilium network policy generation

**What to implement:**
- Istio mTLS for service-to-service communication
- Cilium egress policies for agent network isolation
- Automatic policy injection on kill switch activation

### 16. Zero-Knowledge Compliance Proofs

**Files to create:**
- `src/lib/zk-proofs.ts` - ZK-SNARK compliance proofs

**What to implement:**
- Log integrity proofs without revealing sensitive data
- On-chain hooks for public auditability (optional)

### 17. DIRF Controls (Data, Identity, Risk, Framework)

**Files to create:**
- `src/lib/dirf-consent.ts` - Consent management
- `src/lib/dirf-provenance.ts` - Data provenance tracking

**What to implement:**
- User consent tracking for data processing
- Data lineage and provenance
- Identity usage audits

---

## Detailed File-Level Implementation Plan

### P0 Files to Create (Foundation)

```
src/lib/auth.ts                          # Session + JWT + RBAC
src/middleware.ts                        # Next.js auth middleware
src/lib/db.ts                            # Database connection
prisma/schema.prisma                     # ORM schema
src/lib/secrets.ts                       # Secret management abstraction
packages/agent-sdk/                      # Agent SDK (separate package)
```

### P0 Files to Modify

```
src/app/api/tool-gateway/route.ts        # Add auth + persistent store
src/lib/tool-gateway.ts                  # Integrate OPA + DB
src/lib/governance-policies.ts           # Sign policies + OPA delegation
src/lib/killswitch.ts                    # Persistent kill switch state
src/lib/aivss.ts                         # Configurable weights from DB
src/lib/ssvc.ts                          # Persistent decisions
```

### P1 Files to Create (RMF Functions)

```
src/lib/opa-client.ts                    # OPA runtime client
src/lib/maestro-mapping.ts               # Threat model mapping
src/lib/lpci-defenses.ts                 # Prompt injection defenses
src/lib/ueba-pipeline.ts                 # Behavior analytics
src/lib/containment-engine.ts            # Automated containment
src/lib/incident-response.ts             # Incident workflows
src/lib/alert-manager.ts                 # Alert rules
src/lib/notifier.ts                      # Notification dispatch
src/lib/audit-chain.ts                   # Hash-chained audit log
src/lib/compliance-reporter.ts           # Compliance reports
```

---

## Immediate Next Steps (First 2 Weeks)

### Week 1: Authentication + Persistence

1. **Install dependencies:**
   ```bash
   npm install @auth/core @auth/prisma-adapter prisma bcryptjs
   npm install -D @prisma/client
   ```

2. **Create Prisma schema** (`prisma/schema.prisma`):
   Include models: User, Organization, Agent, Policy, AuditLog, Account, Session, VerificationToken

3. **Create auth middleware** (`src/middleware.ts`):
   Protect all `/api/*` routes; require session or API key

4. **Set up environment variables** (`.env.example`):
   ```
   DATABASE_URL=postgresql://user:pass@localhost:5432/aagate
   NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
   NEXTAUTH_URL=http://localhost:9002
   GOOGLE_CLIENT_ID=your-oauth-client-id
   GOOGLE_CLIENT_SECRET=your-oauth-client-secret
   VAULT_ADDR=https://vault.internal.company.com
   OPA_ADDR=http://opa:8181
   ```

### Week 2: Agent SDK + OPA Integration

1. **Create Agent SDK** (`packages/agent-sdk/`):
   - Auto-registration with ANS
   - mTLS certificate management
   - Policy download and local evaluation
   - Tool invocation interception

2. **Deploy OPA sidecar**:
   - Docker Compose for local development
   - Kubernetes deployment for production
   - Signed Rego bundle loading

3. **Update tool-gateway** to use OPA + persistent store instead of in-memory evaluation.

---

## Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Agents governed | 0 (mock only) | 100+ real agents |
| Policy evaluations | In-memory mock | OPA-enforced, audited |
| Data persistence | Lost on restart | Persistent (PostgreSQL) |
| Authentication | None | OAuth2 + RBAC + API keys |
| Secrets | Hardcoded/env | Vault-managed, encrypted |
| Audit trail | Mutable in-memory | Hash-chained, tamper-evident |
| Kill switch | In-memory, non-persistent | Persistent, with mesh integration |
| Multi-tenancy | None | Organization-level isolation |
| Compliance reporting | None | NIST AI RMF, SOC2, ISO 27001 |

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Performance overhead from OPA evaluation | Cache policy decisions with TTL; OPA sidecar pattern |
| Single point of failure | Deploy control plane with replicas; leader election |
| Secret leakage in logs | Sanitize logs; never log request bodies with PII |
| Agent SDK compromise | Sign SDK releases; verify checksums on agent startup |
| Policy misconfiguration | Dry-run mode; policy simulation before deployment |

---

## Conclusion

AAGATE has a solid foundation with the right architectural vision (NIST AI RMF alignment, event schemas, control plane APIs). However, it cannot currently secure AI agents in production because it lacks: **authentication, persistence, real agent integration, OPA enforcement, and secrets management.**

The improvement plan above transforms it from a dashboard MVP into a production governance control plane over approximately 6 months, delivered in 4 phases with clear deliverables at each step.

**Recommended starting point:** Week 1 - Authentication + Persistence (the foundation everything else builds on).