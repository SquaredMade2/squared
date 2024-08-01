# Base stage
FROM node:18-alpine AS base

# Builder stage
FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk update
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Install pnpm and turbo globally
RUN npm install -g pnpm turbo

COPY . .
RUN turbo prune www --docker

# Installer stage
FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm again to make it available in this stage
RUN npm install -g pnpm

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install

# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

# Final stage - Runner
FROM base AS runner
WORKDIR /app

# Install pnpm again to ensure it's available for the final stage
RUN npm install -g pnpm

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 astro
USER astro

RUN ls -R /app
COPY --from=installer /app/apps/www/astro.config.js .
COPY --from=installer /app/apps/www/package.json .

CMD node apps/www/dist/server/entry.mjs
