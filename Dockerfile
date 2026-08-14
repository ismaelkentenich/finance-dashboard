# Base image shared across all stages to keep the build consistent
FROM node:20-alpine AS base

# Install production-independent dependencies required for the build
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Build the Next.js application using the installed dependencies
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable Next.js telemetry during the image build
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Create a minimal production image containing only the runtime artifacts
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Run the application as a non-root user following container security best practices
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy static assets required by the application at runtime
COPY --from=builder /app/public ./public

# Copy the optimized standalone Next.js server and static build assets
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Drop root privileges before starting the application
USER nextjs

EXPOSE 3000

# Start the standalone Next.js server
CMD ["node", "server.js"]