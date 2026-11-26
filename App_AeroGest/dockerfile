# Dockerfile pour AeroGest

# Étape 1: Construction de l'application
FROM node:18-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json package-lock.json* ./

# Installer les dépendances
RUN npm ci

# Copier le reste de l'application
COPY . .

# Générer le client Prisma
RUN npm run db:generate

# Construire l'application
RUN npm run build

# Étape 2: Image de production
FROM node:18-alpine AS runner

WORKDIR /app

# Copier les dépendances de production
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json

# Installer uniquement les dépendances de production
RUN npm ci --only=production

# Copier l'application construite
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

USER nextjs

# Exposer le port
EXPOSE 3000

# Commande de démarrage
CMD ["npm", "start"]