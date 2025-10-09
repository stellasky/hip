<!--
Sync Impact Report:
- Version change: 1.0.0 → 1.1.0 (added TDD principle)
- Modified principles: N/A
- Added sections: VI. Test-Driven Development (NON-NEGOTIABLE)
- Removed sections: N/A
- Templates requiring updates:
  ✅ Updated: plan-template.md (added TDD compliance check)
  ✅ Updated: tasks-template.md (enforced TDD workflow)
- Follow-up TODOs: None
-->

# HIP Constitution

## Core Principles

### I. React 19 First
All frontend development MUST use React 19 features and patterns. Components MUST leverage React 19's automatic optimizations through the React Compiler. Async operations SHOULD use the new `use` Hook where appropriate. Legacy React patterns (class components, deprecated lifecycle methods) are FORBIDDEN.

Rationale: React 19 provides automatic performance optimizations and improved developer experience that align with modern web development standards.

### II. AWS Amplify Gen 2 Architecture
All cloud infrastructure MUST be defined using AWS Amplify Gen 2 with TypeScript. Backend resources MUST be code-defined in the `amplify/` directory. Authentication MUST use Amazon Cognito. Data layer MUST use AWS AppSync with DynamoDB. Manual AWS console configuration is FORBIDDEN except for initial account setup.

Rationale: Amplify Gen 2 provides type-safe, version-controlled infrastructure that enables rapid development while maintaining enterprise-grade security and scalability.

### III. Vite Build System (NON-NEGOTIABLE)
All build processes MUST use Vite for development and production builds. Hot Module Replacement (HMR) MUST be functional in development. Build outputs MUST be optimized for modern browsers (ES2020+). Legacy build tools (Create React App, Webpack directly) are FORBIDDEN.

Rationale: Vite provides superior development experience with instant server start and lightning-fast HMR, essential for productive React development.

### IV. Type Safety Enforcement
All code MUST be written in TypeScript with strict mode enabled. Type assertions MUST be avoided unless absolutely necessary and documented. Any `any` types MUST be justified and approved. AWS Amplify generated types MUST be used for all API interactions.

Rationale: Type safety prevents runtime errors and provides better developer experience with autocomplete and refactoring support.

### V. Component-First Development
UI MUST be built using reusable, composable React components. Each component MUST have a single responsibility. Amplify UI components SHOULD be used where available before creating custom alternatives. Global state MUST be minimized and use React 19's built-in state management where possible.

Rationale: Component-based architecture promotes maintainability, testability, and consistency across the application.

### VI. Test-Driven Development (NON-NEGOTIABLE)
All feature development MUST follow strict Test-Driven Development (TDD) practices. Tests MUST be written first and MUST fail before any implementation begins. The Red-Green-Refactor cycle MUST be strictly enforced: Red (failing test) → Green (minimal implementation) → Refactor (improve code quality). No production code may be written without a failing test that validates the expected behavior.

Rationale: TDD ensures code quality, prevents regressions, drives better design decisions, and provides living documentation of system behavior. It is essential for maintaining reliability in a rapidly evolving React 19 + Amplify application.

## Technology Stack

### Required Technologies
- **Frontend**: React 19, TypeScript 5.6+, Vite 5.4+
- **Backend**: AWS Amplify Gen 2, AWS AppSync, Amazon DynamoDB
- **Authentication**: Amazon Cognito with Amplify UI React
- **Deployment**: AWS Amplify Hosting
- **Testing**: Vitest (aligned with Vite), React Testing Library
- **Linting**: ESLint with React 19 rules, Prettier

### Forbidden Technologies
- Class-based React components
- Create React App or ejected CRA projects  
- Direct AWS SDK usage (must use Amplify libraries)
- Client-side only authentication
- Manual AWS resource provisioning outside Amplify

## Development Workflow

### Code Quality Gates
Every pull request MUST pass:
- TypeScript compilation with zero errors
- ESLint validation with zero warnings
- All tests passing
- Amplify build and deployment preview success
- Performance budget compliance (Core Web Vitals)

### Testing Requirements
- TDD MUST be followed for all feature development (tests first, then implementation)
- Critical user flows MUST have integration tests written before implementation
- Amplify API interactions MUST be tested with mock data using failing tests first
- Component rendering MUST be tested with React Testing Library following TDD cycle
- Authentication flows MUST be tested end-to-end with failing tests written first
- All tests MUST pass before code review and deployment

### Deployment Process
All deployments MUST go through Amplify's CI/CD pipeline. Feature branches MUST use Amplify preview deployments. Production deployments MUST be triggered only from the main branch. Manual deployment steps are FORBIDDEN.

## Governance

This constitution supersedes all other development practices and guidelines. Any deviation from these principles MUST be documented with justification and approved through the standard review process.

Amendments to this constitution require:
1. Documentation of the proposed change and rationale
2. Impact assessment on existing codebase
3. Migration plan for affected code
4. Approval from project maintainers

All code reviews MUST verify constitutional compliance. Complexity that violates these principles MUST be justified or simplified. Teams SHOULD use the templates in `.specify/templates/` for feature development guidance.

**Version**: 1.1.0 | **Ratified**: 2025-10-01 | **Last Amended**: 2025-10-01