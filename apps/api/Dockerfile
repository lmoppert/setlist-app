# 1. Build Stage
FROM node:24-slim AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npx nx build api --prod

# 2. Production Stage
FROM node:24-slim
# WICHTIG: Pfad definieren
WORKDIR /usr/src/app

# System-Libs für Prisma (unverzichtbar)
RUN apt-get update -y && apt-get install -y openssl libssl-dev && rm -rf /var/lib/apt/lists/*

# Kopieren der Dateien aus dem Builder
COPY --from=builder /app/dist/apps/api .
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/prisma ./prisma

# Upload-Ordner erstellen und Berechtigungen setzen
# Wir erstellen den Ordner hier im Container-Dateisystem
RUN mkdir -p uploads && chown -R node:node /usr/src/app

# Prisma Client generieren
RUN npx prisma generate

# JETZT erst auf den User wechseln
USER node

EXPOSE 3000
CMD ["node", "main.js"]