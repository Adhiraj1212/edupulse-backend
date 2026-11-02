# EduPulse Backend (`edupulse-backend`)

REST API for Student Record Management in the EduPulse System.

## Architecture

* **Runtime:** Node.js 22 (runs as non-root user `node` on port `5000`).
* **Database:** MySQL 8.4 (`student_db`, table `students`).
* **Event Broker:** RabbitMQ (`amqp://...`), publishes student lifecycle events (create, update, delete).
* **Health Check:** `GET /health` returns `200 OK`.

## DevSecOps CI/CD Pipeline

Every push to `main` triggers `.github/workflows/ci-cd.yml`:
1. **Secret Scanning:** `gitleaks` checks for hardcoded credentials.
2. **SCA & Dependency Vulnerability Gate:** `npm audit --omit=dev --audit-level=high` fails builds on exploitable packages.
3. **SAST Syntax & Linting:** `node --check` verifies all JavaScript sources.
4. **Dockerfile Linting:** `hadolint` ensures compliance with container hardening guidelines.
5. **Vulnerability Scanning:** Aqua `trivy` (v0.36.0) scans the container for OS and library CVEs.
6. **CycloneDX SBOM:** Generated and preserved as a compliance artifact.
7. **Container Registry:** Builds and pushes lowercase image tags to GitHub Container Registry (`ghcr.io`).
8. **Keyless AWS SSM Deployment:** Assumes AWS IAM Role via OIDC and triggers a zero-downtime rolling update on EC2 using AWS Systems Manager Run Command (strictly **no SSH keys**).

## Required GitHub Actions Variables

To deploy this service from GitHub Actions, configure the following under **Settings** -> **Secrets and variables** -> **Actions** -> **Variables**:

| Variable | Description | Example |
|---|---|---|
| `AWS_ROLE_ARN` | IAM Role ARN with SSM permissions | `arn:aws:iam::123456789012:role/GitHubActions-devops-ec2ssm-role` |
| `INSTANCE_ID` | Target EC2 Instance ID | `i-0123456789abcdef0` |
| `AWS_REGION` | AWS Region | `eu-north-1` |

## Local Development

```bash
npm install
npm start
```
