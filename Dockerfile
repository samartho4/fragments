# ==================== Stage 1: Dependencies ====================
FROM node:22.14.0 AS dependencies

# Metadata
LABEL maintainer="Samarth <samarthx04@gmail.com>"
LABEL description="Fragments microservice"

# Set environment variables
ENV NODE_ENV=production
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm ci --only=production

# ==================== Stage 2: Production ====================
FROM node:22.14.0-alpine3.21@sha256:9bef0ef1e268f60627da9ba7d7605e8831d5b56ad07487d24d1aa386336d1944 AS production


# Install dependencies for healthcheck and debugging
# Install dependencies for healthcheck and debugging
# hadolint ignore=DL3018
RUN apk add --no-cache \
    curl \
    dumb-init



# Set working directory
WORKDIR /app

RUN addgroup -g 1001 -S nodejs && \
    adduser -S appuser -u 1001 -G nodejs


# Copy node_modules from dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy package files
COPY --from=dependencies /app/package.json /app/package-lock.json ./

# Copy application source
COPY ./src ./src
COPY ./tests/.htpasswd ./tests/.htpasswd

# Set proper permissions
RUN chown -R appuser:nodejs /app

# Switch to non-root user
USER root

# Expose application port
ARG PORT=8080
ENV PORT=$PORT
EXPOSE $PORT

# Healthcheck using curl
HEALTHCHECK --interval=30s --timeout=10s CMD curl -f http://localhost:8080/ || exit 1

# Start application with proper signal handling
CMD ["dumb-init", "node", "src/index.js"]