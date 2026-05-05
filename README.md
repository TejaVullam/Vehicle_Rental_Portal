# P2P Bike & Car Rental Marketplace

This repository contains the monorepo setup for the P2P Bike & Car Rental Marketplace platform.

## Architecture

- **apps/web**: Next.js 14, Tailwind CSS, shadcn/ui.
- **apps/api**: Express.js REST API.
- **packages/ui**: Shared React components.
- **packages/types**: Shared TypeScript interfaces.
- **packages/shared**: Shared utilities and constants.
- **packages/config**: Shared ESLint, Prettier, and TypeScript configs.
- **packages/testing**: Shared test configs.

## Getting Started

1. Install dependencies:

   ```sh
   pnpm install
   ```

2. Run development servers:

   ```sh
   pnpm dev
   ```

3. Run builds:
   ```sh
   pnpm build
   ```

## Development Guidelines

- Always use `pnpm` as the package manager.
- Commits must follow [Conventional Commits](https://www.conventionalcommits.org/).
- Ensure `pnpm run lint` and `pnpm run typecheck` pass before submitting PRs.
