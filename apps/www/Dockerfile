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

# Re-install pnpm in this stage
RUN npm install -g pnpm

# Install dependencies
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile --ignore-scripts

# Remove unnecessary packages
RUN pnpm prune --prod

# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

RUN pnpm turbo build --filter=www...

# Runner stage
FROM node:20-slim AS runner
WORKDIR /app

# Install pnpm again to ensure it's available for the final stage
RUN npm install -g pnpm

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/www/next.config.js .
COPY --from=installer /app/apps/www/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/www/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/www/.next/static ./apps/www/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/www/public ./apps/www/public

CMD ["node", "apps/www/server.js"]
