# Tasks: Musical Band Fan Appreciation App

**Input**: Design documents from `/Users/coryluellen/Documents/spec/hip/specs/001-modify-this-app/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → ✅ COMPLETE: Implementation plan loaded
   → Extracted: React 19, AWS Amplify Gen 2, TypeScript, Vite structure
2. Load optional design documents:
   → ✅ data-model.md: Extracted entities (Band, POI, User, Visit, Comment, Photo)
   → ✅ contracts/: GraphQL schema and Storage API contracts loaded
   → ✅ research.md: AWS Location Service, S3 storage, testing decisions extracted
3. Generate tasks by category:
   → ✅ Setup: Amplify backend, React 19 frontend, testing framework
   → ✅ Tests: Contract tests for GraphQL APIs, integration tests for user flows
   → ✅ Core: Data models, services, React components, authentication
   → ✅ Integration: Map services, photo storage, real-time subscriptions
   → ✅ Polish: Performance, accessibility, documentation
4. Apply task rules:
   → ✅ Different files marked [P] for parallel execution
   → ✅ Same file tasks sequential (no [P])
   → ✅ Tests before implementation (TDD constitutional requirement)
5. Number tasks sequentially (T001-T045)
6. Generate dependency graph and parallel execution examples
7. Validate task completeness:
   → ✅ All GraphQL contracts have failing tests before implementation
   → ✅ All entities have failing tests before model creation
   → ✅ All user stories have integration tests before implementation
   → ✅ TDD Red-Green-Refactor cycle properly sequenced
8. Return: SUCCESS (45 tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **React + Amplify**: `src/` (React components), `amplify/` (backend resources), `tests/` at repository root
- **Components**: `src/components/`, `src/pages/`, `src/services/`
- **Amplify Backend**: `amplify/auth/`, `amplify/data/`, `amplify/storage/`
- **Tests**: `tests/integration/`, `tests/components/`, `tests/api/`

## Phase 3.1: Setup
- [x] T001 Remove existing todo functionality from src/App.tsx and clean up unused components
- [x] T002 Update package.json dependencies for React 19, AWS Amplify Gen 2, and mapping libraries
- [x] T003 [P] Configure ESLint rules for React 19 patterns in .eslintrc.js
- [x] T004 [P] Setup Vitest configuration in vitest.config.ts with React Testing Library
- [x] T005 [P] Create TypeScript type definitions in src/types/ for Band, POI, User entities
- [x] T006 Create static data files in src/data/bands.json and src/data/pois.json with sample data

## Phase 3.2: Tests First (TDD) ⚠️ CONSTITUTIONAL REQUIREMENT - MUST COMPLETE BEFORE 3.3
**NON-NEGOTIABLE: Constitutional Principle VI mandates these tests MUST be written and MUST FAIL before ANY implementation. This is the Red phase of Red-Green-Refactor cycle.**

### Contract Tests (GraphQL API)
- [x] T007 [P] GraphQL User operations contract test in tests/api/user-operations.test.ts
- [x] T008 [P] GraphQL Visit operations contract test in tests/api/visit-operations.test.ts  
- [x] T009 [P] GraphQL Comment operations contract test in tests/api/comment-operations.test.ts
- [x] T010 [P] GraphQL Photo operations contract test in tests/api/photo-operations.test.ts

### Component Tests
- [x] T011 [P] BandList component test in tests/components/BandList.test.tsx
- [x] T012 [P] BandDetail component test in tests/components/BandDetail.test.tsx
- [x] T013 [P] POIList component test in tests/components/POIList.test.tsx
- [x] T014 [P] POIDetail component test in tests/components/POIDetail.test.tsx
- [x] T015 [P] MapView component test in tests/components/MapView.test.tsx
- [x] T016 [P] PhotoUpload component test in tests/components/PhotoUpload.test.tsx

### Integration Tests (User Stories)
- [x] T017 [P] User registration and authentication flow test in tests/integration/auth-flow.test.tsx
- [x] T018 [P] Band selection and POI discovery flow test in tests/integration/band-discovery.test.tsx
- [x] T019 [P] Visit tracking functionality test in tests/integration/visit-tracking.test.tsx
- [x] T020 [P] Comment system integration test in tests/integration/comment-system.test.tsx
- [x] T021 [P] Photo upload and storage test in tests/integration/photo-upload.test.tsx

## Phase 3.3: Core Implementation (GREEN PHASE - ONLY after tests are failing)
**TDD Green Phase: Write minimal code to make tests pass. Constitutional compliance requires failing tests from Phase 3.2.**

### Amplify Backend Resources
- [x] T022 [P] Define User, Visit, Comment, Photo data models in amplify/data/resource.ts
- [x] T023 [P] Configure AWS Cognito authentication in amplify/auth/resource.ts
- [x] T024 [P] Setup S3 storage for photos in amplify/storage/resource.ts

### Service Layer
- [x] T025 [P] Implement band service with JSON data loading in src/services/bandService.ts
- [x] T026 [P] Implement POI service with JSON data and filtering in src/services/poiService.ts
- [x] T027 [P] Implement user service with Amplify GraphQL client in src/services/userService.ts
- [x] T028 [P] Implement visit service for tracking POI visits in src/services/visitService.ts
- [x] T029 [P] Implement comment service with real-time updates in src/services/commentService.ts
- [x] T030 [P] Implement photo service with S3 upload in src/services/photoService.ts

### React Components
- [x] T031 [P] Create BandList component for band selection in src/components/bands/BandList.tsx
- [x] T032 [P] Create BandDetail component with POI list in src/components/bands/BandDetail.tsx
- [x] T033 [P] Create POIList component for list view in src/components/pois/POIList.tsx
- [x] T034 [P] Create POIDetail component with visit/comment/photo features in src/components/pois/POIDetail.tsx
- [x] T035 [P] Create MapView component with Amazon Location Service in src/components/pois/MapView.tsx
- [x] T036 [P] Create PhotoUpload component with progress tracking in src/components/shared/PhotoUpload.tsx

### Pages and Navigation
- [x] T037 Update src/main.tsx with Amplify configuration and authentication setup
- [x] T038 Create page components in src/pages/ for BandList, BandDetail, and POIDetail routes
- [x] T039 Implement navigation and routing with React Router in src/App.tsx

## Phase 3.4: Integration
- [ ] T040 Connect all components to Amplify authentication and implement auth guards
- [ ] T041 Setup GraphQL subscriptions for real-time comment and photo updates
- [ ] T042 Integrate Amazon Location Service with map components for offline capability
- [ ] T043 Configure photo upload with progress tracking and storage limit validation

## Phase 3.5: Polish (REFACTOR PHASE)
**TDD Refactor Phase: Improve code quality while keeping tests green. Complete the Red-Green-Refactor cycle.**
- [ ] T044 [P] Add utility function tests in tests/utils/ for validation, map, and image utilities
- [ ] T045 [P] Update README.md with setup instructions, features, and deployment guide

## Dependencies

### Critical Path Dependencies
- **Setup Phase**: T001-T006 must complete before any other work
- **TDD Requirement**: T007-T021 (all tests) MUST complete and FAIL before T022-T043 (implementation)
- **Backend First**: T022-T024 (Amplify resources) before T025-T030 (services)
- **Services Before Components**: T025-T030 before T031-T036
- **Components Before Pages**: T031-T036 before T037-T039
- **Core Before Integration**: T022-T039 before T040-T043

### File Conflict Prevention
- **src/main.tsx**: T037 blocks T040 (sequential modifications)
- **src/App.tsx**: T001 → T039 (sequential modifications)
- **amplify/data/resource.ts**: T022 (single file, no parallel)

## Parallel Execution Examples

### Phase 3.2: Tests (All can run simultaneously)
```bash
# Contract Tests (Parallel Group 1)
Task: "GraphQL User operations contract test in tests/api/user-operations.test.ts"
Task: "GraphQL Visit operations contract test in tests/api/visit-operations.test.ts"
Task: "GraphQL Comment operations contract test in tests/api/comment-operations.test.ts"
Task: "GraphQL Photo operations contract test in tests/api/photo-operations.test.ts"

# Component Tests (Parallel Group 2)
Task: "BandList component test in tests/components/BandList.test.tsx"
Task: "BandDetail component test in tests/components/BandDetail.test.tsx"
Task: "POIList component test in tests/components/POIList.test.tsx"
Task: "POIDetail component test in tests/components/POIDetail.test.tsx"
Task: "MapView component test in tests/components/MapView.test.tsx"
Task: "PhotoUpload component test in tests/components/PhotoUpload.test.tsx"

# Integration Tests (Parallel Group 3)
Task: "User registration and authentication flow test in tests/integration/auth-flow.test.tsx"
Task: "Band selection and POI discovery flow test in tests/integration/band-discovery.test.tsx"
Task: "Visit tracking functionality test in tests/integration/visit-tracking.test.tsx"
Task: "Comment system integration test in tests/integration/comment-system.test.tsx"
Task: "Photo upload and storage test in tests/integration/photo-upload.test.tsx"
```

### Phase 3.3: Implementation (After all tests fail)
```bash
# Backend Resources (Parallel Group 1)
Task: "Define User, Visit, Comment, Photo data models in amplify/data/resource.ts"
Task: "Configure AWS Cognito authentication in amplify/auth/resource.ts"
Task: "Setup S3 storage for photos in amplify/storage/resource.ts"

# Service Layer (Parallel Group 2 - after backend)
Task: "Implement band service with JSON data loading in src/services/bandService.ts"
Task: "Implement POI service with JSON data and filtering in src/services/poiService.ts"
Task: "Implement user service with Amplify GraphQL client in src/services/userService.ts"
Task: "Implement visit service for tracking POI visits in src/services/visitService.ts"
Task: "Implement comment service with real-time updates in src/services/commentService.ts"
Task: "Implement photo service with S3 upload in src/services/photoService.ts"

# React Components (Parallel Group 3 - after services)
Task: "Create BandList component for band selection in src/components/bands/BandList.tsx"
Task: "Create BandDetail component with POI list in src/components/bands/BandDetail.tsx"
Task: "Create POIList component for list view in src/components/pois/POIList.tsx"
Task: "Create POIDetail component with visit/comment/photo features in src/components/pois/POIDetail.tsx"
Task: "Create MapView component with Amazon Location Service in src/components/pois/MapView.tsx"
Task: "Create PhotoUpload component with progress tracking in src/components/shared/PhotoUpload.tsx"
```

## Notes
- **[P] tasks**: Different files, no dependencies, can run simultaneously
- **Constitutional Requirement**: ALL tests (T007-T021) MUST be written and MUST FAIL before ANY implementation (T022-T043)
- **TDD Cycle**: Red (failing tests) → Green (minimal implementation) → Refactor (code quality)
- **Commit Strategy**: Commit after each completed task for traceability
- **File Conflicts**: Tasks modifying the same file are sequential (no [P] marker)

## Validation Checklist
*GATE: Constitutional and technical requirements*

- [x] All GraphQL contracts have corresponding failing tests before implementation
- [x] All entities (Band, POI, User, Visit, Comment, Photo) have failing tests before model creation
- [x] All user stories have integration tests before implementation
- [x] TDD Red-Green-Refactor cycle properly sequenced across phases
- [x] Parallel tasks target different files with no conflicts
- [x] Each task specifies exact file path for implementation
- [x] Setup → Tests → Implementation → Integration → Polish dependency order maintained
- [x] Constitutional Principle VI (TDD) compliance verified