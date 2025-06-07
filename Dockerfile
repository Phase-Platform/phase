# Phase Platform - Multi-stage Docker Build
# ====================
# Dependencies Stage
# ====================
FROM node:18.17-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm with specific version
ARG PNPM_VERSION=9.6.0
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/types/package.json ./packages/types/
COPY packages/database/package.json ./packages/database/
COPY packages/ui/package.json ./packages/ui/
COPY packages/api/package.json ./packages/api/
COPY packages/config/package.json ./packages/config/

# Install dependencies
RUN pnpm install --frozen-lockfile

# ====================
# Builder Stage
# ====================
FROM node:18-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat python3 make g++

ARG PNPM_VERSION=9.6.0
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate

# Copy package files and lockfile
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/types/package.json ./packages/types/
COPY packages/database/package.json ./packages/database/
COPY packages/ui/package.json ./packages/ui/
COPY packages/api/package.json ./packages/api/
COPY packages/config/package.json ./packages/config/

# Copy source code
COPY . .

# Install dependencies (will use cache from deps stage)
RUN pnpm install --frozen-lockfile

# Build all packages using the root build command
RUN pnpm build

# Generate database
RUN pnpm db:generate

# Build the web app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN cd apps/web && pnpm build

# ====================
# Runner Stage
# ====================
FROM node:18-alpine AS runner
WORKDIR /app

# Create user and group
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Install runtime dependencies
RUN apk add --no-cache dumb-init curl

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

# Copy database artifacts
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/packages/database/prisma ./packages/database/prisma

# Create healthcheck script
RUN echo '#!/usr/bin/env node\n\
const http = require("http");\n\
const options = {\n\
  host: "localhost",\n\
  port: process.env.PORT || 3000,\n\
  path: "/api/health",\n\
  timeout: 2000\n\
};\n\
const healthCheck = http.request(options, (res) => {\n\
  console.log(`Health check status: ${res.statusCode}`);\n\
  if (res.statusCode === 200) {\n\
    process.exit(0);\n\
  } else {\n\
    process.exit(1);\n\
  }\n\
});\n\
healthCheck.on("error", (err) => {\n\
  console.error("Health check failed:", err);\n\
  process.exit(1);\n\
});\n\
healthCheck.end();' > healthcheck.js && chmod +x healthcheck.js

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node healthcheck.js || exit 1

# Start the application
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "apps/web/server.js"]