# Base stage
FROM node:18-alpine AS base

# Builder stage
FROM base AS builder
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g pnpm
COPY . .
RUN pnpm install
RUN pnpm build

# Installer stage
FROM base AS installer
WORKDIR /app
RUN apk update
RUN apk add --no-cache libc6-compat

# Install pnpm again to make it available in this stage
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml to install dependencies
COPY --from=builder package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy built files from the builder stage
COPY --from=builder /app/dist ./dist

# Final stage - Runner
FROM base AS runner
WORKDIR /app

# Install pnpm again to ensure it's available for the final stage
RUN npm install -g pnpm

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 astro
USER astro

COPY --from=installer /app/apps/web/next.config.js .
COPY --from=installer /app/apps/web/package.json .

# Install dependencies for astro
RUN pnpm install --frozen-lockfile

# Expose the port and set the command to run the application
EXPOSE 3000
RUN npx astro start
