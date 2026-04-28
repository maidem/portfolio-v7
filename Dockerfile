# Multi-stage build für Nuxt 4 Portfolio
# Build-Stage: kompiliert auch native Module (better-sqlite3) für @nuxt/content
FROM node:22-alpine AS builder

WORKDIR /app

# Build-Tools für native Module (better-sqlite3)
RUN apk add --no-cache python3 make g++

# Dependencies installieren
COPY package*.json ./
RUN npm ci

# Source Code kopieren und Nuxt bauen (SSR)
COPY . .
RUN npm run build

# Production Image — Nitro-Output ist self-contained (eigene node_modules in .output/server)
FROM node:22-alpine

WORKDIR /app

# Build Output kopieren
COPY --from=builder /app/.output ./.output

# Markdown-Inhalte werden zur Laufzeit von /api/pdf-content gelesen
COPY --from=builder /app/content ./content

# Statische public-Assets (Fonts, Favicon) kommen über .output/public — nichts weiter zu kopieren

# Non-root User für Security
RUN addgroup -g 1001 -S nodejs \
  && adduser -S nuxtapp -u 1001 -G nodejs \
  && chown -R nuxtapp:nodejs /app
USER nuxtapp

ENV NODE_ENV=production
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000

# Health Check
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => { if (r.statusCode !== 200) process.exit(1) }).on('error', () => process.exit(1))"

EXPOSE 3000

# Nitro Server starten
CMD ["node", ".output/server/index.mjs"]
