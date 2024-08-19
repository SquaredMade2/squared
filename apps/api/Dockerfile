# Base image
FROM node:20-alpine AS base

# Builder stage
FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm and turbo globally
RUN npm install -g pnpm turbo

COPY . .
RUN turbo prune api --docker

# Installer stage
FROM base AS installer
WORKDIR /app

# Install dependencies
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile --ignore-scripts
RUN pnpm cache clean --all

# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN pnpm turbo build --filter=api...

# Runner stage
FROM node:20-slim AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs
USER expressjs

COPY --from=installer /app .

CMD ["node", "apps/api/dist/index.js"]
