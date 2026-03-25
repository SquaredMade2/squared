# Base image
FROM oven/bun:1 AS base

# Builder stage
FROM base AS builder
RUN apt-get update && apt-get install -y --no-install-recommends libc6 && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# Install turbo globally
RUN bun install -g turbo

COPY . .
RUN turbo prune www --docker

# Installer stage
FROM base AS installer
WORKDIR /app

# Install dependencies
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/bun.lock ./bun.lock
RUN bun install --frozen-lockfile --ignore-scripts

# Remove unnecessary packages
RUN bun prune --prod

# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

RUN bun turbo build --filter=www...

# Runner stage
FROM oven/bun:1 AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/www/next.config.mjs .
COPY --from=installer /app/apps/www/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/www/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/www/.next/static ./apps/www/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/www/public ./apps/www/public

CMD ["node", "apps/www/server.js"]
