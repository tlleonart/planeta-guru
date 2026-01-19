FROM node:20-alpine AS base

RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN corepack enable pnpm

COPY package.json pnpm-lock.yaml* ./
RUN pnpm i

COPY . .

ARG NEXT_PUBLIC_BASE_API_URL
ARG PLATFORM_KEY
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG CLERK_SECRET_KEY

ENV NEXT_PUBLIC_BASE_API_URL=$NEXT_PUBLIC_BASE_API_URL
ENV PLATFORM_KEY=$PLATFORM_KEY
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV CLERK_SECRET_KEY=$CLERK_SECRET_KEY

RUN pnpm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=base --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=base --chown=nextjs:nodejs /app/.next/static ./app/.next/static
COPY --from=base /app/public ./app/public
COPY --from=base /app/messages ./app/messages

USER nextjs

WORKDIR /app/app

ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]