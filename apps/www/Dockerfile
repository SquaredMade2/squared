# Base image
FROM node:20-alpine AS base

# Install pnpm and turbo globally in the base image
RUN npm install -g pnpm turbo

# Builder stage
FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy source files for pruning
COPY . .

# Prune unnecessary files for the 'www' service
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

# Copy full project files from builder and build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

# Build the 'www' service
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

# Copy necessary files from the installer stage
COPY --from=installer /app/apps/www/next.config.js .
COPY --from=installer /app/apps/www/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/www/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/www/.next/static ./apps/www/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/www/public ./apps/www/public

# Start the server
CMD ["node", "apps/www/server.js"]
