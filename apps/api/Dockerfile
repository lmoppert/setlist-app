# 1. Build Stage
FROM node:24-slim AS builder
WORKDIR /app
COPY . .

# Pakete installieren und builds durchführen
RUN npm install
RUN npx nx build api --prod

# 2. Production Stage
FROM node:24-slim
# WICHTIG: Pfad definieren
WORKDIR /usr/src/app

# System-Libs für Prisma (unverzichtbar)
RUN apt-get update -y && \
    apt-get install -y openssl libssl-dev && \
    rm -rf /var/lib/apt/lists/*

# Kopieren der Dateien aus dem Builder
COPY --from=builder /app/dist/apps/api .
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/prisma ./prisma

RUN npx prisma generate

# Entry Scripts kopieren
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
COPY start.sh /usr/local/bin/start.sh

# Executable machen
RUN chmod +x /usr/local/bin/docker-entrypoint.sh && \
    chmod +x /usr/local/bin/start.sh

# Upload-Ordner erstellen und Berechtigungen setzen
# Wir erstellen den Ordner hier im Container-Dateisystem
RUN mkdir -p uploads && \
    chown -R node:node /usr/src/app

# JETZT erst auf den User wechseln
USER node

EXPOSE 3000

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["/usr/local/bin/start.sh"]