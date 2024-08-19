# Base image
FROM node:20-alpine AS base

# Builder stage
FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm and turbo globally
RUN npm install -g pnpm turbo

COPY . .
RUN turbo prune www --docker

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
RUN pnpm turbo build --filter=www...

# Runner stage
FROM node:20-slim AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 astro
USER astro

COPY --from=installer /app/apps/www/astro.config.mjs ./astro.config.mjs
COPY --from=installer /app/apps/www/package.json ./package.json

CMD ["node", "apps/www/dist/server/entry.mjs"]
