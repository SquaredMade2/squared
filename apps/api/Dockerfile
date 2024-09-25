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
ARG POSTGRES_URL
ARG POSTGRES_PRISMA_URL
ARG POSTGRES_URL_NO_SSL
ARG POSTGRES_URL_NON_POOLING
ARG POSTGRES_USER
ARG POSTGRES_HOST
ARG POSTGRES_PASSWORD
ARG POSTGRES_DATABASE

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
ENV POSTGRES_URL=${POSTGRES_URL}
ENV POSTGRES_PRISMA_URL=${POSTGRES_PRISMA_URL}
ENV POSTGRES_URL_NO_SSL=${POSTGRES_URL_NO_SSL}
ENV POSTGRES_URL_NON_POOLING=${POSTGRES_URL_NON_POOLING}
ENV POSTGRES_USER=${POSTGRES_USER}
ENV POSTGRES_HOST=${POSTGRES_HOST}
ENV POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
ENV POSTGRES_DATABASE=${POSTGRES_DATABASE}

# Build the project
RUN pnpm turbo build --filter=api...

# Runner stage
FROM node:20-slim AS runner
WORKDIR /app

# Install pnpm again to ensure it's available for the final stage
RUN npm install -g pnpm

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 express
USER express

# Copy necessary files from the installer stage
COPY --from=installer /app/apps/api/package.json .
COPY --from=installer /app/apps/api/dist ./dist
COPY --from=installer /app/apps/api/node_modules ./node_modules

# Set the working directory for the Express server
WORKDIR /app/dist

# Start the Express server
CMD ["node", "index.js"]
