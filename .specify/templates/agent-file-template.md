# HIP Development Guidelines

Auto-generated from all feature plans. Last updated: [DATE]

## Active Technologies
**Frontend**: React 19, TypeScript 5.6+, Vite 5.4+
**Backend**: AWS Amplify Gen 2, AWS AppSync, Amazon DynamoDB
**Authentication**: Amazon Cognito with Amplify UI React
**Testing**: Vitest, React Testing Library
**Deployment**: AWS Amplify Hosting

## Project Structure
```
src/
├── components/          # React 19 components
├── pages/              # Route-level components  
├── services/           # Amplify client services
├── types/              # TypeScript definitions
└── utils/              # Utility functions
amplify/
├── auth/               # Cognito configuration
├── data/               # AppSync + DynamoDB schema
└── storage/            # S3 configuration (if needed)
tests/
├── components/         # Component tests
├── api/               # API integration tests
└── integration/       # End-to-end tests
```

## Commands
**Development**: `npm run dev` (Vite dev server)
**Build**: `npm run build` (TypeScript + Vite)
**Test**: `npm run test` (Vitest)
**Deploy**: `npx ampx sandbox` (Amplify sandbox)
**Deploy Prod**: `npx ampx deploy` (Amplify production)

## Code Style
**React**: Function components only, React 19 hooks, TypeScript strict mode
**Amplify**: Use generated types, avoid direct AWS SDK calls
**Testing**: Test-Driven Development mandatory - write failing tests first, then implement
**TypeScript**: No `any` types, prefer type inference, use Amplify generated types
**TDD Workflow**: Red (failing test) → Green (minimal implementation) → Refactor (improve quality)

## Recent Changes
[LAST 3 FEATURES AND WHAT THEY ADDED]

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->