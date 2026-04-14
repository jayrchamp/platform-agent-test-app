# ── Test App — Multi-stage Docker build ──────────────────────────────────────
#
# Stage 1: Install deps + build Vue app
# Stage 2: Production image (Node 22 Alpine, serves static + /health)
#
# Build:  docker build -t test-app:latest .
# Run:    docker run -p 3000:3000 test-app:latest

# ── Stage 1: Build ──────────────────────────────────────────────────────────

FROM node:22-alpine AS builder

WORKDIR /build

COPY package.json yarn.lock* package-lock.json* ./
RUN if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    else npm install; fi

COPY . .
RUN npm run build

# ── Stage 2: Production ────────────────────────────────────────────────────

FROM node:22-alpine

WORKDIR /app

# Copy built assets + server
COPY --from=builder /build/dist/ dist/
COPY --from=builder /build/server.js ./
COPY --from=builder /build/package.json ./

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/health || exit 1

EXPOSE 3000

CMD ["node", "server.js"]
