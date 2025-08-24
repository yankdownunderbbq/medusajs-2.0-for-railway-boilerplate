# Minimal Dockerfile for Medusa 2.0 Backend
# Uses npm, Node.js 18, copies only what exists

FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install system dependencies for Medusa
RUN apk add --no-cache python3 make g++ cairo-dev jpeg-dev pango-dev

# Copy package files for dependency installation
COPY package.json package-lock.json ./

# Copy all dependencies again for build (including devDependencies)
RUN npm ci && npm cache clean --force

# Copy source code and configuration files
COPY src ./src
COPY medusa-config.js ./
COPY tsconfig.json ./

# Copy environment file if it exists (Railway will override with env vars anyway)
COPY .env* ./

# Build the Medusa application
RUN npm run build --no-admin

# Expose port
EXPOSE 9000

# Start the application
CMD ["npm", "start"]