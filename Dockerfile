# Phase Platform - Multi-stage Docker Build
# ====================
# Dependencies Stage
# ====================
FROM node:18.17-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm with specific version (matches local 9.6.0)
RUN corepack enable && corepack prepare pnpm@9.6.0 --activate

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/types/package.json ./packages/types/
COPY packages/*/package.json ./packages/*/

# Copy source files for types package first
COPY packages/types ./packages/types

# Copy remaining source files
COPY tools ./tools/

# Debug: List files to verify copying
RUN ls -la

# Install dependencies with verbose output
RUN pnpm install --prefer-offline --verbose

# ====================
# Builder Stage
# ====================
FROM node:18-alpine AS builder
WORKDIR /app

# Install pnpm and build dependencies
RUN apk add --no-cache libc6-compat python3 make g++

RUN corepack enable && corepack prepare pnpm@9.6.0 --activate

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules

# Copy source code
COPY . .
COPY tools/*/src ./tools/*/src

# Generate Prisma client
RUN pnpm db:generate

# Build the application
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# ====================
# Runner Stage
# ====================
FROM node:18-alpine AS runner
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Install runtime dependencies
RUN apk add --no-cache dumb-init curl

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

# Copy Prisma files
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

# Set correct permissions
USER nextjs

# Expose port
EXPOSE 3000

# Set environment variables
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