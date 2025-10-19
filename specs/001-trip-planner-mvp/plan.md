# Implementation Plan: Trip Planner MVP

**Branch**: `001-trip-planner-mvp` | **Date**: 2025-10-16 | **Spec**: /Users/coryluellen/Documents/spec/hip/specs/001-trip-planner-mvp/spec.md
**Input**: Feature specification from `/specs/001-trip-planner-mvp/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Enable authenticated users to create trips (name-only at creation), then add addresses incrementally which are geocoded into places; show trips with progress (visited/geocoded), display Trip Details with a list and a small non‑interactive map preview, and allow toggling visited state. Duplicate addresses are detected and users are warned with a default merge behavior. Implementation uses React + Vite with Amplify Gen 2 backend‑as‑code (auth + data) per Constitution.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: JavaScript/TypeScript (React 19, TypeScript 5)  
**Primary Dependencies**: React, @aws-amplify/ui-react, aws-amplify  
**Storage**: Amplify Data models (owner-scoped)  
**Testing**: Top-level `tests/` directory split by `unit/` and `integration/`  
**Target Platform**: Mobile web (modern browsers)  
**Project Type**: Single web app (frontend + Amplify backend-as-code)  
**Performance Goals**: P75 TTI < 2.0s for Trips and Trip Details  
**Constraints**: Owner authorization; no unmanaged AWS changes; build via `tsc && vite build`  
**Scale/Scope**: MVP: 1 user role, up to 100 places per trip (v1)

**Integrations**: Maps + Geocoding via AWS Location Service (Maps/Places). Resources will be added via Amplify backend-as-code; client uses AWS SDK with Cognito auth. No secrets embedded in code.

**MVP Clarifications reflected here**:
- Address entry: incremental (single address per add) on Trip Details (no bulk in MVP)
- Map: list-first with a small non‑interactive preview (no marker/list sync in MVP)
- Progress: visited count / total geocoded places
- Duplicates: warn and offer merge (default = merge)
- Auth: required for all features; unauthenticated users see login gate; empty trips shows CTA

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The following MUST be true for this feature (see Hip Constitution):

- Uses the approved stack: Vite (vite@5), React (react@19), TypeScript (tsc), Amplify Gen 2.
- Any backend changes are declared in `amplify/` via `defineAuth`, `defineData`, `defineBackend`.
- Data access is via Amplify Data client (`generateClient<Schema>()`), including live updates via `observeQuery` when needed.
- Build contract preserved: `npm run build` executes `tsc && vite build`, emits to `dist/` and aligns with `amplify.yml`.
- Authenticator wraps protected UI; default authorization mode is `userPool` with owner rules enforced on protected models.
- Lint/types: ESLint zero warnings; `tsc` zero errors.

Gate Evaluation: PASS (aligned with current repo and constitution). Testing layout chosen; max places set to 100; provider set to AWS Location Service via backend-as-code.

## Project Structure

### Documentation (this feature)

```
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: Single project web app. Frontend in `src/` with pages/components; backend-as-code in `amplify/` for auth/data. Tests under top-level `tests/` with `unit/` and `integration/`.

## Complexity Tracking

*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |

No violations anticipated. If geocoding requires additional service, prefer client-side integration; avoid adding a new backend service outside Amplify.

