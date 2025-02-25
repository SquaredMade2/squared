FROM node:22-alpine AS base

FROM base AS builder
RUN apk update
RUN apk add --no-cache libc6-compat python3 make g++

# Set working directory
WORKDIR /app
RUN npm install -g turbo pnpm ts-node tsconfig-paths
COPY . .
RUN turbo prune api --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat python3 make g++ openssl

WORKDIR /app

# Copy the package.json and lockfile of the isolated subworkspace
COPY --from=builder /app/apps/api /app/apps/api
COPY --from=builder /app/packages/builder /app/packages/builder
COPY --from=builder /app/packages/context /app/packages/context
COPY --from=builder /app/packages/logger /app/packages/logger
COPY --from=builder /app/packages/rpc /app/packages/rpc
COPY --from=builder /app/packages/superjson /app/packages/superjson
COPY --from=builder /app/packages/typescript-config /app/packages/typescript-config

# First install dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
RUN npm install -g turbo pnpm ts-node tsconfig-paths

RUN pnpm install

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .

# Accept build arguments and set them as environment variables
ARG NODE_ENV
ARG NEXT_PUBLIC_CONFIRM_URL
ARG PORT
ARG GITHUB_CLIENT_ID
ARG GITHUB_CLIENT_SECRET
ARG EMAIL_USERNAME
ARG EMAIL_PASSWORD
ARG DATABASE_URL

# Set build arguments as environment variables
ENV NODE_ENV=${NODE_ENV}
ENV NEXT_PUBLIC_CONFIRM_URL=${NEXT_PUBLIC_CONFIRM_URL}
ENV PORT=${PORT}
ENV GITHUB_CLIENT_ID=${GITHUB_CLIENT_ID}
ENV GITHUB_CLIENT_SECRET=${GITHUB_CLIENT_SECRET}
ENV DATABASE_URL=${DATABASE_URL}
ENV NODE_OPTIONS="--max-old-space-size=4096"

RUN pnpm db:migrate

FROM base AS runner
WORKDIR /app
RUN apk add --no-cache openssl
COPY --from=installer /app .
WORKDIR /app/apps/api

RUN npm install -g turbo pnpm ts-node tsconfig-paths

# Don't run production as root
RUN addgroup --system --gid 1001 expressjs
RUN adduser --system --uid 1001 expressjs
USER expressjs

CMD ["ts-node", "src/api/index.ts"]