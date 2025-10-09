## HIP - React 19 + AWS Amplify Gen 2 Application

This repository provides a modern React 19 application built with AWS Amplify Gen 2, emphasizing type safety, performance, and developer experience through cutting-edge web technologies.

## Overview

HIP is built following constitutional principles that enforce React 19 patterns, AWS Amplify Gen 2 architecture, and Vite build system. The application leverages automatic React optimizations, type-safe infrastructure, and enterprise-grade AWS services.

## Architecture

- **Frontend**: React 19 with automatic compiler optimizations, TypeScript strict mode, Vite build system
- **Backend**: AWS Amplify Gen 2 with code-defined infrastructure, AppSync GraphQL API, DynamoDB database
- **Authentication**: Amazon Cognito with Amplify UI React components
- **Deployment**: AWS Amplify Hosting with CI/CD pipeline

## Features

- **Modern React**: Leverages React 19's new `use` Hook, automatic optimizations, and improved hydration
- **Type Safety**: Full TypeScript coverage with Amplify-generated types
- **Real-time Data**: GraphQL subscriptions with AWS AppSync
- **Secure Authentication**: Amazon Cognito with social providers support

## Deploying to AWS

For detailed instructions on deploying your application, refer to the [deployment section](https://docs.amplify.aws/react/start/quickstart/#deploy-a-fullstack-app-to-aws) of our documentation.

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.

## Developer

Run the dev server:

```bash
npm run dev
```

Run the full test suite (Vitest):

```bash
npm test -- --run
```

Run a single test by name (example):

```bash
npm test -- -t "Visit tracking flow"
```

Testing notes:
- Tests are written using Vitest and React Testing Library under a TDD workflow — write failing tests, implement behavior, then refactor.
- Integration tests mock the `@aws-amplify/ui-react` `Authenticator` to keep tests deterministic and offline-friendly; API-level services are mocked via `aws-amplify/data` in `tests/setup.ts` to avoid network calls.
- UI components use optimistic updates for faster UX in tests (and real usage). Integration tests assert the optimistic UI behaviors and basic LWW semantics where applicable.

If you need to run tests against real cloud resources, configure Amplify in `src/main.tsx` with your `amplify_outputs.json` and adjust the tests to not use the mocked Authenticator.

## Deploy

Prereqs:
- AWS account and credentials set up locally
- Amplify Gen 2 CLI (AmpX) available via npx

Steps:
1. Provision a sandbox to validate infra and API locally tied to your account:
	```bash
	npx ampx sandbox
	```
2. When ready for production deploy:
	```bash
	npx ampx deploy
	```
3. For Amplify Hosting, connect the repo in the AWS Amplify console to enable CI/CD on pushes to your main branch.

### Optional: Persist visits with Amplify

You can persist visited POIs per signed-in user using the `Visit` model. Enable via Vite env flag and ensure Amplify Auth is configured and user is signed in:

```bash
export VITE_USE_AMPLIFY_VISITS=true
npm run dev
```

When enabled, the app attempts to read/write visits using the generated Amplify Data client. Without the flag (default), visits are tracked in-memory for fast testing and offline use.

### Optional: Run tests against real Amplify

By default, tests mock Amplify Auth/UI and Data. If you want to run tests against a real backend:
- Remove or conditionally bypass the `Authenticator` mock in `tests/integration/auth-flow.test.tsx`
- Remove or guard the `aws-amplify/data` mock in `tests/setup.ts`
- Ensure `amplify_outputs.json` is valid and Cognito user pools are configured