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

# Accept build arguments and set them as environment variables
ARG NEXT_PUBLIC_CONFIRM_URL
ENV NEXT_PUBLIC_CONFIRM_URL=${NEXT_PUBLIC_CONFIRM_URL}

ARG PORT
ENV PORT=${PORT}

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}

ARG JWT_SECRET
ENV JWT_SECRET=${JWT_SECRET}

ARG EMAIL_USERNAME
ENV EMAIL_USERNAME=${EMAIL_USERNAME}

ARG EMAIL_PASSWORD
ENV EMAIL_PASSWORD=${EMAIL_PASSWORD}

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