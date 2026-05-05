# P2P Bike & Car Rental Marketplace

[![CI](https://github.com/TejaVullam/Vehicle_Rental_Portal/actions/workflows/ci.yml/badge.svg)](https://github.com/TejaVullam/Vehicle_Rental_Portal/actions/workflows/ci.yml)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-%3E%3D9.0.0-blue)](https://pnpm.io/)
[![TypeScript](https://img.shields.io/badge/typescript-%5E5.4.5-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

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

## Quality Assurance

Run the complete CI pipeline locally:

```sh
# Type checking
pnpm typecheck

# Linting
pnpm lint

# Testing
pnpm test

# Building
pnpm build
```

## Project Roadmap

### Phase 0 ✅ - Foundation (Completed)

- [x] Monorepo setup with Turbo
- [x] CI/CD pipeline with GitHub Actions
- [x] Database schema with Prisma
- [x] Error handling & logging
- [x] Environment management

### Phase 1 ✅ - Core Platform (Completed)

- [x] Authentication system (JWT)
- [x] User profiles
- [x] Vehicle listings
- [x] Booking engine
- [x] Payment escrow
- [x] Ratings & reviews

### Phase 2 ✅ - Marketplace (In Progress)

- [x] Cancellation policies with refund management
- [x] Pickup/Return workflows with checkpoint tracking
- [x] Damage reporting with media attachments
- [x] Dispute resolution framework
- [x] Notification engine
- [ ] Advanced search & filters
- [ ] Frontend UI components

**Phase 2 Highlights:**

- Database: 4 new models (CancellationPolicy, BookingCheckpoint, DamageReport, Notification)
- API: 15+ new REST endpoints integrated with booking flow
- Features:
  - Booking cancellation with automatic refund processing
  - Checkpoint tracking for pickup/return events
  - Damage reporting with photo evidence
  - Real-time notifications for booking events
  - User notification dashboard with read status tracking

### Phase 3 📊 - Business (Planned)

- [ ] Owner earnings dashboard
- [ ] Analytics & reporting
- [ ] Fraud detection
- [ ] Admin moderation

### Phase 4 🔒 - Hardening (Planned)

- [ ] Security audit
- [ ] Performance optimization
- [ ] Load testing
- [ ] Production deployment

## Contributing

1. Create a feature branch: `git checkout -b feat/your-feature`
2. Make your changes and commit: `git commit -m "feat: your feature"`
3. Push to GitHub: `git push origin feat/your-feature`
4. Open a Pull Request with a detailed description

## Support

For questions or issues, please open a GitHub Issue or contact the maintainers.
