FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
# ENV NODE_ENV production
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS worker

WORKDIR /app
COPY . .

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN chown -R nextjs:nodejs ./

COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules

# Next.js collects completely anonymous telemetry data about general usage.
ENV NEXT_TELEMETRY_DISABLED 1

# Environment variables must be present at build time, https://github.com/vercel/next.js/discussions/14030
ARG DOPPLER_TOKEN
ENV DOPPLER_TOKEN=${DOPPLER_TOKEN}
RUN export DOPPLER_TOKEN=${DOPPLER_TOKEN}

# Doppler CLI
RUN wget -q -t3 'https://packages.doppler.com/public/cli/rsa.8004D9FF50437357.key' -O /etc/apk/keys/cli@doppler-8004D9FF50437357.rsa.pub && \
  echo 'https://packages.doppler.com/public/cli/alpine/any-version/main' | tee -a /etc/apk/repositories && \
  apk add doppler
# RUN doppler setup -t ${DOPPLER_TOKEN}

ENV NODE_ENV production

RUN \
  if [ -f yarn.lock ]; then doppler run -- yarn run build; \
  elif [ -f package-lock.json ]; then doppler run -- npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && doppler run -- pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Environment variables must be present at build time, https://github.com/vercel/next.js/discussions/14030
ARG DOPPLER_TOKEN
ENV DOPPLER_TOKEN=${DOPPLER_TOKEN}
RUN export DOPPLER_TOKEN=${DOPPLER_TOKEN}

RUN chown -R nextjs:nodejs .next/
USER nextjs

# CMD ls -la ./
CMD \
  if [ -f yarn.lock ]; then doppler run -- yarn start0; \
  elif [ -f package-lock.json ]; then doppler run -- npm start0; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && doppler run -- pnpm start0; \
  else echo "Lockfile not found." && exit 1; \
  fi
