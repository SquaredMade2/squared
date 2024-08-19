# Base image
FROM node:20-alpine AS base

# Builder stage
FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm and turbo globally
RUN npm install -g pnpm turbo

COPY . .
RUN turbo prune web --docker

# Installer stage
FROM base AS installer
WORKDIR /app

# Re-install pnpm in this stage
RUN npm install -g pnpm

# Install dependencies
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile --ignore-scripts
RUN pnpm cache clean --all

# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

# Accept build arguments and set them as environment variables
ARG NEXT_PUBLIC_SERVER
ENV NEXT_PUBLIC_SERVER=${NEXT_PUBLIC_SERVER}

ARG NEXT_PUBLIC_URL
ENV NEXT_PUBLIC_URL=${NEXT_PUBLIC_URL}

ARG NEXT_PUBLIC_CLIENT_ID
ENV NEXT_PUBLIC_CLIENT_ID=${NEXT_PUBLIC_CLIENT_ID}

ARG NEXT_PUBLIC_GITHUB_CLIENT_SECRET
ENV NEXT_PUBLIC_GITHUB_CLIENT_SECRET=${NEXT_PUBLIC_GITHUB_CLIENT_SECRET}

ARG KINDE_CLIENT_ID
ENV KINDE_CLIENT_ID=${KINDE_CLIENT_ID}

ARG KINDE_CLIENT_SECRET
ENV KINDE_CLIENT_SECRET=${KINDE_CLIENT_SECRET}

ARG KINDE_ISSUER_URL
ENV KINDE_ISSUER_URL=${KINDE_ISSUER_URL}

ARG KINDE_SITE_URL
ENV KINDE_SITE_URL=${KINDE_SITE_URL}

ARG KINDE_POST_LOGOUT_REDIRECT_URL
ENV KINDE_POST_LOGOUT_REDIRECT_URL=${KINDE_POST_LOGOUT_REDIRECT_URL}

ARG KINDE_POST_LOGIN_REDIRECT_URL
ENV KINDE_POST_LOGIN_REDIRECT_URL=${KINDE_POST_LOGIN_REDIRECT_URL}

ARG NEXTAUTH_SECRET
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}

ARG GOOGLE_CLIENT_ID
ENV GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}

ARG GOOGLE_CLIENT_SECRET
ENV GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}

ARG GITHUB_CLIENT_ID
ENV GITHUB_CLIENT_ID=${GITHUB_CLIENT_ID}

ARG GITHUB_CLIENT_SECRET
ENV GITHUB_CLIENT_SECRET=${GITHUB_CLIENT_SECRET}

RUN pnpm turbo build --filter=web...

# Runner stage
FROM node:20-slim AS runner
WORKDIR /app

# Install pnpm again to ensure it's available for the final stage
RUN npm install -g pnpm

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/web/next.config.js .
COPY --from=installer /app/apps/web/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

CMD ["node", "apps/web/server.js"]
