FROM node:20-alpine AS base

FROM base AS builder
RUN apk update
RUN apk add --no-cache libc6-compat python3 make g++

# Set working directory
WORKDIR /app
RUN npm install -g turbo
RUN npm install -g pnpm
COPY . .
RUN turbo prune api --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

# Copy Prisma schema files separately to ensure they are available
COPY packages/db/prisma ./packages/db/prisma
COPY packages/test-db/prisma ./packages/test-db/prisma

# First install dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
RUN npm install -g pnpm

RUN pnpm install

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .

# Accept build arguments and set them as environment variables
ARG NODE_ENV
ARG NEXT_PUBLIC_CONFIRM_URL
ARG PORT
ARG JWT_SECRET
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG GOOGLE_REDIRECT_URI
ARG SESSION_SECRET
ARG EMAIL_USERNAME
ARG EMAIL_PASSWORD
ARG POSTGRES_PRISMA_URL
ARG POSTGRES_URL_NON_POOLING

# Set build arguments as environment variables
ENV NODE_ENV=${NODE_ENV}
ENV NEXT_PUBLIC_CONFIRM_URL=${NEXT_PUBLIC_CONFIRM_URL}
ENV PORT=${PORT}
ENV JWT_SECRET=${JWT_SECRET}
ENV GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
ENV GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
ENV GOOGLE_REDIRECT_URI=${GOOGLE_REDIRECT_URI}
ENV SESSION_SECRET=${SESSION_SECRET}
ENV EMAIL_USERNAME=${EMAIL_USERNAME}
ENV EMAIL_PASSWORD=${EMAIL_PASSWORD}
ENV POSTGRES_PRISMA_URL=${POSTGRES_PRISMA_URL}
ENV POSTGRES_URL_NON_POOLING=${POSTGRES_URL_NON_POOLING}

RUN pnpm turbo build --filter=api...

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 expressjs
RUN adduser --system --uid 1001 expressjs
USER expressjs
COPY --from=installer /app .

CMD ts-node -r tsconfig-paths/register apps/api/index.ts