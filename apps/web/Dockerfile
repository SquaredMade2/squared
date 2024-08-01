FROM node:18-alpine AS base

# This Dockerfile is copy-pasted into our main docs at /docs/handbook/deploying-with-docker.
# Make sure you update both files!

FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk update
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app
RUN npm install -g pnpm
RUN npm install -g turbo
COPY . .
RUN turbo prune web --docker

# Add lockfile and package.json's of isolated subworkspace
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

FROM base AS runner
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

CMD node apps/web/server.js