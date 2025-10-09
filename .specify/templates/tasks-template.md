# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → contract test task
   → research.md: Extract decisions → setup tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: models, services, CLI commands
   → Integration: DB, middleware, logging
   → Polish: unit tests, performance, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have failing tests written first? (Constitutional TDD requirement)
   → All entities have failing tests before model creation?
   → All endpoints have failing tests before implementation?
   → TDD Red-Green-Refactor cycle properly sequenced?
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **React + Amplify**: `src/` (React components), `amplify/` (backend resources), `tests/` at repository root
- **Components**: `src/components/`, `src/pages/`, `src/services/`
- **Amplify Backend**: `amplify/auth/`, `amplify/data/`, `amplify/storage/`
- **Tests**: `tests/integration/`, `tests/components/`, `tests/api/`
- Paths shown below assume React + Amplify Gen 2 structure

## Phase 3.1: Setup
- [ ] T001 Initialize React 19 + Vite project with TypeScript
- [ ] T002 Configure Amplify Gen 2 backend resources in amplify/
- [ ] T003 [P] Configure ESLint with React 19 rules and Prettier
- [ ] T004 [P] Setup Vitest and React Testing Library

## Phase 3.2: Tests First (TDD) ⚠️ CONSTITUTIONAL REQUIREMENT - MUST COMPLETE BEFORE 3.3
**NON-NEGOTIABLE: Constitutional Principle VI mandates these tests MUST be written and MUST FAIL before ANY implementation. This is the Red phase of Red-Green-Refactor cycle.**
- [ ] T005 [P] Component test for UserProfile in tests/components/UserProfile.test.tsx
- [ ] T006 [P] API integration test for user queries in tests/api/user-queries.test.ts
- [ ] T007 [P] Authentication flow test in tests/integration/auth-flow.test.tsx
- [ ] T008 [P] Data model test for User type in tests/api/user-model.test.ts

## Phase 3.3: Core Implementation (GREEN PHASE - ONLY after tests are failing)
**TDD Green Phase: Write minimal code to make tests pass. Constitutional compliance requires failing tests from Phase 3.2.**
- [ ] T009 [P] Define User data model in amplify/data/resource.ts
- [ ] T010 [P] Configure Cognito auth in amplify/auth/resource.ts
- [ ] T011 [P] Create UserProfile React component in src/components/UserProfile.tsx
- [ ] T012 [P] Implement user service with Amplify client in src/services/userService.ts
- [ ] T013 Setup Amplify configuration in src/main.tsx
- [ ] T014 Implement authentication UI with Amplify UI React
- [ ] T015 Add error boundaries and loading states

## Phase 3.4: Integration
- [ ] T016 Connect components to Amplify Auth
- [ ] T017 Implement real-time subscriptions with AppSync
- [ ] T018 Configure Amplify hosting deployment
- [ ] T019 Setup environment-specific configurations

## Phase 3.5: Polish (REFACTOR PHASE)
**TDD Refactor Phase: Improve code quality while keeping tests green. Complete the Red-Green-Refactor cycle.**
- [ ] T020 [P] Add unit tests for utility functions in tests/utils/
- [ ] T021 Performance optimization and Core Web Vitals compliance
- [ ] T022 [P] Update README with deployment instructions
- [ ] T023 Add accessibility testing and ARIA compliance
- [ ] T024 Run end-to-end testing with Amplify preview environment

## Dependencies
- Tests (T004-T007) before implementation (T008-T014)
- T008 blocks T009, T015
- T016 blocks T018
- Implementation before polish (T019-T023)

## Parallel Example
```
# Launch T004-T007 together:
Task: "Contract test POST /api/users in tests/contract/test_users_post.py"
Task: "Contract test GET /api/users/{id} in tests/contract/test_users_get.py"
Task: "Integration test registration in tests/integration/test_registration.py"
Task: "Integration test auth in tests/integration/test_auth.py"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Commit after each task
- Avoid: vague tasks, same file conflicts

## Task Generation Rules
*Applied during main() execution*

1. **From Contracts**:
   - Each contract file → contract test task [P]
   - Each endpoint → implementation task
   
2. **From Data Model**:
   - Each entity → model creation task [P]
   - Relationships → service layer tasks
   
3. **From User Stories**:
   - Each story → integration test [P]
   - Quickstart scenarios → validation tasks

4. **Ordering (TDD Constitutional Requirement)**:
   - Setup → Tests (RED) → Models (GREEN) → Services (GREEN) → Endpoints (GREEN) → Polish (REFACTOR)
   - Constitutional Principle VI: Tests MUST come before implementation
   - Dependencies block parallel execution

## Validation Checklist
*GATE: Checked by main() before returning*

- [ ] All contracts have corresponding tests
- [ ] All entities have model tasks
- [ ] All tests come before implementation
- [ ] Parallel tasks truly independent
- [ ] Each task specifies exact file path
- [ ] No task modifies same file as another [P] task