# Production Dockerfile for Medusa 2.0 Backend
# Optimized for Railway deployment with npm

# Use Node.js 18 LTS for production stability
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Install system dependencies required for Medusa and native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    musl-dev \
    giflib-dev \
    pixman-dev \
    pangomm-dev \
    libjpeg-turbo-dev \
    freetype-dev

# Configure npm for production
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_UPDATE_NOTIFIER=false
ENV NODE_ENV=production

# Stage 1: Install dependencies
FROM base AS deps

# Copy package files first for optimal Docker layer caching
COPY package.json package-lock.json ./

# Install dependencies using npm ci for faster, reliable production installs
# --only=production excludes devDependencies
# --ignore-scripts prevents potentially unsafe scripts from running
RUN npm ci --only=production --ignore-scripts && npm cache clean --force

# Stage 2: Build the application
FROM base AS builder

# Copy package files
COPY package.json package-lock.json ./

# Install ALL dependencies (including devDependencies) needed for build
RUN npm ci --ignore-scripts && npm cache clean --force

# Copy source code
COPY . .

# Build the Medusa application
# This runs: medusa build && node src/scripts/postBuild.js
RUN npm run build

# Stage 3: Production runtime
FROM base AS runner

# Create a non-root user for security
RUN addgroup --system --gid 1001 medusa && \
    adduser --system --uid 1001 medusa

# Copy package.json for runtime
COPY package.json ./

# Copy production dependencies from deps stage
COPY --from=deps --chown=medusa:medusa /app/node_modules ./node_modules

# Copy built application from builder stage
COPY --from=builder --chown=medusa:medusa /app/.medusa ./.medusa

# Copy necessary runtime files
COPY --chown=medusa:medusa medusa-config.js ./
COPY --chown=medusa:medusa src/scripts ./src/scripts
COPY --chown=medusa:medusa scripts ./scripts

# Switch to non-root user for security
USER medusa

# Expose the port Medusa runs on
EXPOSE 9000

# Health check to ensure the server is running
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD node -e "require('http').get('http://localhost:9000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Start the Medusa server using Railway-specific start script
# This avoids issues with init-backend in containerized environments
CMD ["node", "scripts/railway-start.js"]