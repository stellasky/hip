<!--
Sync Impact Report

- Version change: 0.0.0 → 1.0.0
- Modified principles: N/A (initial ratification)
- Added sections:
	- Stack & Constraints
	- Development Workflow & Quality Gates
- Removed sections: None
- Templates requiring updates:
	- ✅ .specify/templates/plan-template.md (added explicit Constitution Check gates)
	- ✅ .specify/templates/tasks-template.md (clarified when tests are REQUIRED by constitution)
	- ✅ README.md (reviewed; no changes required)
- Updates applied:
	- ✅ RATIFICATION_DATE set to 2025-10-16
-->

# Hip Constitution
<!-- Example: Spec Constitution, TaskFlow Constitution, etc. -->

## Core Principles

### I. Single Stack: Vite + React + Amplify Gen 2
<!-- Example: I. Library-First -->
The application MUST use Vite (vite@5) with React (react@19) and AWS Amplify
Gen 2 for backend-as-code. The backend is defined in TypeScript under
`amplify/` via `defineBackend`, with resources provisioned through Amplify
pipelines.
<!-- Example: Every feature starts as a standalone library; Libraries must be self-contained, independently testable, documented; Clear purpose required - no organizational-only libraries -->

### II. Backend as Code, Minimal Surface
<!-- Example: II. CLI Interface -->
All AWS resources MUST be declared as code:
- Auth via `defineAuth` (Cognito User Pools) with email login.
- Data via `defineData` and schema models (e.g., `Trip`) with owner-based auth.
- No ad‑hoc console changes; changes require pull requests and review.
<!-- Example: Every library exposes functionality via CLI; Text in/out protocol: stdin/args → stdout, errors → stderr; Support JSON + human-readable formats -->

### III. Client-Driven Data Access Only
<!-- Example: III. Test-First (NON-NEGOTIABLE) -->
All CRUDL operations MUST use the Amplify Data client generated in the
frontend (e.g., `generateClient<Schema>()`). Observability/live updates MUST
use client facilities such as `observeQuery`. Direct calls that bypass Amplify
client contracts are NOT allowed.
<!-- Example: TDD mandatory: Tests written → User approved → Tests fail → Then implement; Red-Green-Refactor cycle strictly enforced -->

### IV. Build & Deploy Pipeline Alignment
<!-- Example: IV. Integration Testing -->
Builds MUST conform to `amplify.yml`:
- Backend deploy via `npx ampx pipeline-deploy`.
- Frontend build via `npm run build` (runs `tsc && vite build`).
- Artifacts emitted to `dist/` and published by Amplify Hosting.
Amplify outputs MUST be consumed via `amplify_outputs.json` and configured
through `Amplify.configure(outputs)` at startup.
<!-- Example: Focus areas requiring integration tests: New library contract tests, Contract changes, Inter-service communication, Shared schemas -->

### V. Security, Quality, and UX Guardrails
<!-- Example: V. Observability, VI. Versioning & Breaking Changes, VII. Simplicity -->
- Authenticator: The React tree MUST wrap protected routes/components with
	`@aws-amplify/ui-react` Authenticator.
- Authorization: Default mode is `userPool`; models using owner rules MUST
	enforce ownership for mutating operations.
- Type safety: TypeScript build MUST pass (no `tsc` errors). ESLint MUST pass
	with zero warnings in CI.
- React StrictMode MUST remain enabled in `main.tsx`.
- Secrets/config MUST be sourced from Amplify-managed env and outputs; no hard‑
	coded secrets.
<!-- Example: Text I/O ensures debuggability; Structured logging required; Or: MAJOR.MINOR.BUILD format; Or: Start simple, YAGNI principles -->

## Stack & Constraints
<!-- Example: Additional Constraints, Security Requirements, Performance Standards, etc. -->

- Framework: React 19, Vite 5, TypeScript 5.
- AWS Amplify Gen 2 backend with resources declared in `amplify/`:
	- `auth/resource.ts`: email login with Cognito.
	- `data/resource.ts`: `Trip` model with owner authorization, default
		authorization mode `userPool`, optional API key mode for public rules.
- UI: `@aws-amplify/ui-react` Authenticator provides sign-in and session.
- Build: `tsc && vite build`; output directory `dist/`.
- Hosting/CD: Amplify Hosting pipeline configured via `amplify.yml`.
- Prohibited: Server code outside Amplify resources; unmanaged AWS changes;
	bypassing Amplify Data client.
<!-- Example: Technology stack requirements, compliance standards, deployment policies, etc. -->

## Development Workflow & Quality Gates
<!-- Example: Development Workflow, Review Process, Quality Gates, etc. -->

Before merging any change, the following gates MUST pass:
- Stack compliance: Changes conform to Core Principles I–V.
- Types and lint: `tsc` has zero errors; ESLint has zero warnings.
- Build: `npm run build` succeeds; outputs to `dist/`.
- Auth guard: Protected UI flows remain wrapped by Authenticator.
- Backend-as-code: Any resource/schema updates are in `amplify/` and include a
	brief migration note in the PR description.
- Data contracts: When schema changes affect models or auth rules, add/update a
	minimal integration check (e.g., a scripted client call or e2e note) to prove
	end-to-end behavior.

Code review MUST verify the above. Violations require explicit justification in
the PR with rollback/mitigation steps.
<!-- Example: Code review requirements, testing gates, deployment approval process, etc. -->

## Governance
<!-- Example: Constitution supersedes all other practices; Amendments require documentation, approval, migration plan -->

This Constitution supersedes conflicting practices in this repository.

Amendments:
- Proposals occur via PRs that update this file and reference impacted files
	(`amplify/*`, `amplify.yml`, `README.md`, templates under `.specify/`).
- Provide a migration note for any behavior or contract change (auth rules,
	schema fields, build outputs, hosting settings).

Versioning Policy (of this Constitution):
- MAJOR: Removal or redefinition of principles; governance changes that require
	workflow rewrites.
- MINOR: New principle added or materially expanded guidance.
- PATCH: Clarifications, wording, or non-semantic refinements.

Compliance Reviews:
- Constitution Check gates MUST be included in planning artifacts and re-checked
	during review.
- CI MUST fail on lint/type/build violations.
- Periodic (at least quarterly) review to confirm the stack and constraints
	mirror reality (React/Vite/Amplify versions, pipeline configuration).
<!-- Example: All PRs/reviews must verify compliance; Complexity must be justified; Use [GUIDANCE_FILE] for runtime development guidance -->

**Version**: 1.0.0 | **Ratified**: 2025-10-16 | **Last Amended**: 2025-10-16
<!-- Example: Version: 2.1.1 | Ratified: 2025-06-13 | Last Amended: 2025-07-16 -->
