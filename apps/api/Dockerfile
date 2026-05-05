# Base Stage
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Builder Stage
FROM base AS builder
RUN pnpm install -g turbo
COPY . .
RUN turbo prune api --docker

# Installer Stage
FROM base AS installer
WORKDIR /app
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN pnpm turbo run build --filter=api...

# Runner Stage
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

# Only copy compiled api and its production dependencies
COPY --from=installer /app/apps/api/dist ./apps/api/dist
COPY --from=installer /app/apps/api/package.json ./apps/api/package.json
COPY --from=installer /app/node_modules ./node_modules
# Also copy shared workspace packages to node_modules? 
# Usually pruning is better but this is a simplified API runner
COPY --from=installer /app/packages ./packages

EXPOSE 3001
CMD ["node", "apps/api/dist/index.js"]
