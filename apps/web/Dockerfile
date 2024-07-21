# Specify the correct Node.js version
FROM node:21.1.0

# Install pnpm
RUN npm install -g pnpm@9.3.0

# Set the working directory in the container
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm@9.3.0

# Accept build arguments and set them as environment variables
ARG NEXT_PUBLIC_SERVER
ENV NEXT_PUBLIC_SERVER=${NEXT_PUBLIC_SERVER}

ARG NEXT_PUBLIC_URL
ENV NEXT_PUBLIC_URL=${NEXT_PUBLIC_URL}

ARG GOOGLE_CLIENT_ID
ENV GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}

ARG GOOGLE_CLIENT_SECRET
ENV GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}

ARG NEXTAUTH_SECRET
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}

ARG GITHUB_CLIENT_ID
ENV GITHUB_CLIENT_ID=${GITHUB_CLIENT_ID}

ARG GITHUB_CLIENT_SECRET
ENV GITHUB_CLIENT_SECRET=${GITHUB_CLIENT_SECRET}

ARG NEXTAUTH_URL
ENV NEXTAUTH_URL=${NEXTAUTH_URL}

ARG SENTRY_AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}

ARG NEXT_PUBLIC_CLIENT_ID
ENV NEXT_PUBLIC_CLIENT_ID=${NEXT_PUBLIC_CLIENT_ID}

# Copy package.json and pnpm-lock.yaml to the workdir
COPY package*.json pnpm-lock.yaml ./

# Install packages using pnpm
RUN pnpm install

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Build the Next.js application
RUN pnpm run build:digitalocean

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Define the command to run your app using the custom build command
CMD ["pnpm", "run", "start"]
