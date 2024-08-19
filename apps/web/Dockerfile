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
FROM node:20-alpine AS runner
WORKDIR /app

# Install a simple static server
RUN npm install -g serve

# Copy the built static files from the installer stage
COPY --from=installer /app/apps/www/dist /app/www

# Expose port 4000
EXPOSE 4000

# Serve the static files using 'serve'
CMD ["serve", "-s", "www", "-l", "4000"]
