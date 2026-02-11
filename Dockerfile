# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=22.12.0
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Remix"

# Remix app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"
ARG YARN_VERSION=1.22.19
RUN npm install -g yarn@$YARN_VERSION --force


# Throw-away build stage to reduce size of final image
FROM base AS build

# Install packages needed to build node modules
RUN apt-get update \
    -o Acquire::ForceIPv4=true \
    -o Acquire::Retries=3 \
 && apt-get install -y --no-install-recommends \
    build-essential node-gyp pkg-config python-is-python3 openssl \
 && rm -rf /var/lib/apt/lists/*


# Install node modules
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=false

# Copy application code (excluding .generated from .dockerignore)
COPY . .

# Generate Prisma Client for Linux in Docker
RUN yarn prisma generate

# Build application
RUN yarn react-router build

# Remove development dependencies but keep Prisma CLI
RUN yarn install --production=true


# Final stage for app image
FROM base

# Install OpenSSL for Prisma
RUN apt-get update -y \
 && apt-get install -y --no-install-recommends openssl \
 && rm -rf /var/lib/apt/lists/*

# Copy built application
COPY --from=build /app /app

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "yarn", "run", "start" ]
