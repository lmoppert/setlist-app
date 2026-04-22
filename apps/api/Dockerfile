# Build Stage
FROM node:20-slim AS builder
WORKDIR /app
COPY . .
RUN npm install
# Nx Build für die API
RUN npx nx build api --prod

# Production Stage
FROM node:20-slim
WORKDIR /app

# System Bibliotheken für Prisma installieren
RUN apt-get update -y && apt-get install -y openssl libssl-dev && rm -rf /var/lib/apt/lists/*

# Nur die gebauten Dateien und die nötigsten Module kopieren
COPY --from=builder /app/dist/apps/api .
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/prisma ./prisma

# Prisma Client generieren (für Postgres)
RUN npx prisma generate

EXPOSE 3000
CMD ["node", "main.js"]
