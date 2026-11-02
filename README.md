# EduPulse Backend (`edupulse-backend`)

REST API for Student Record Management in the EduPulse System.

## Architecture

* **Runtime:** Node.js 22 (runs as non-root user `node` on port `5000`).
* **Database:** MySQL 8.4 (`student_db`, table `students`).
* **Event Broker:** RabbitMQ (`amqp://...`), publishes student lifecycle events (create, update, delete).
* **Health Check:** `GET /health` returns `200 OK`.

## DevSecOps Pipeline

1. **Secret Scanning:** `gitleaks` checks for hardcoded credentials.
2. **SCA & Dependency Vulnerability Gate:** `npm audit --omit=dev --audit-level=high` fails builds on exploitable packages.
3. **SAST Syntax & Linting:** `node --check` verifies all JavaScript sources.
4. **Dockerfile Linting:** `hadolint` ensures compliance with container hardening guidelines.
5. **Vulnerability Scanning:** Aqua `trivy` scans the resulting container for OS and library CVEs.
6. **CycloneDX SBOM:** Generated and preserved as a compliance artifact.
7. **Container Signing:** Signed with Sigstore `cosign` using GitHub OIDC tokens.
8. **Automated ECS Deploy:** Triggers zero-downtime rolling update on Amazon ECS Fargate.

## Required Environment Variables

| Variable | Description |
|---|---|
| `DB_HOST` | MySQL database hostname or IP |
| `DB_USER` | Database username (`student`) |
| `DB_PASSWORD` | Injected via AWS Secrets Manager |
| `DB_DATABASE` | `student_db` |
| `DB_TABLE` | `students` |
| `RABBITMQ_URL` | AMQP connection URL with credentials |

## Local Development

```bash
npm install
npm start
```
