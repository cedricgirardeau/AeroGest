Projet de logiciel de gestion de mouvement aéronautique AeroGest

Fonctionnalités Implémentées

Architecture Technique

Next.js 14 avec App Router et Server Components
TypeScript pour la typage fort
Tailwind CSS pour le styling moderne
Prisma ORM pour PostgreSQL
NextAuth.js pour l'authentification
React Query pour la gestion des états
xlsx et json2csv pour l'export de données

Authentification

Authentification locale (email/mot de passe) avec bcrypt
Authentification Office 365 (Microsoft Entra ID) configurable
Sélection d'aérodrome de rattachement par utilisateur
Gestion des rôles et permissions (Admin, Gestionnaire, Comptable, Utilisateur)

Modules Principaux

Tableau de bord avec statistiques en temps réel
Gestion des aéronefs (CRUD complet avec filtres)
Gestion des modèles d'aéronefs avec catégories de propulsion
Gestion des exploitants avec types et indicatifs OACI
Gestion des clients avec informations comptables
Gestion des vols et mouvements avec dossiers de vol DGAC
Module de facturation avec :
Rubriques de facturation (taxes d'atterrissage, parking)
Prestations supplémentaires
Factures et lignes de facture
Règlements
Module de comptabilité avec plan comptable M14
Module d'export avec :
Moteur de requêtes avancé
Filtres personnalisables
Export CSV, XLSX, JSON
Prévisualisation des données

Base de Données

Schéma complet avec 3 schémas PostgreSQL :
aer : Exploitation (pays, aérodromes, aéronefs, exploitants, dossiers de vol, mouvements)
fac : Facturation (clients, plan comptable, rubriques, factures, règlements)
sec : Sécurité (utilisateurs, rôles, permissions)
Seeders pour initialiser les données de référence

UI/UX

Layout responsive avec sidebar et topbar
Sélecteur d'aérodrome dynamique
Composants réutilisables (tableaux, filtres, cartes)
Design moderne et intuitif

Structure du Projet

aerogest/
├── prisma/
│   ├── schema.prisma      # Schéma complet de la base de données
│   └── seed.ts            # Données initiales (250+ lignes)
├── src/
│   ├── app/
│   │   ├── api/           # 15+ routes API (aerodromes, aeronefs, clients, etc.)
│   │   ├── auth/          # Page de connexion
│   │   ├── dashboard/     # Tableau de bord
│   │   ├── aeronefs/      # Gestion des aéronefs
│   │   ├── vols/          # Gestion des vols
│   │   ├── export/        # Module d'export
│   │   └── ... (14 pages au total)
│   ├── components/        # 15+ composants React
│   ├── lib/               # Authentification, utilitaires
│   └── types/             # Types TypeScript
├── .env.example           # Template des variables
├── Dockerfile             # Pour le déploiement
├── docker-compose.yml     # Avec PostgreSQL
├── package.json
├── README.md
└── INSTRUCTIONS.md        # Guide complet

Comment Démarrer

1. Installer les dépendances
cd /workspace/aerogest
npm install
2. Configurer la base de données
Option A: Avec Docker (recommandé)

docker-compose up -d db
npm run db:generate
npm run db:push
npm run db:seed
Option B: Avec PostgreSQL local

# Créer la base de données
createdb aerogest

# Mettre à jour .env
DATABASE_URL="postgresql://user:password@localhost:5432/aerogest?schema=public"

# Initialiser
npm run db:generate
npm run db:push
npm run db:seed
3. Configurer Office 365 (optionnel)
Remplir dans .env:

MICROSOFT_ENTRA_ID_CLIENT_ID=votre_id
MICROSOFT_ENTRA_ID_CLIENT_SECRET=votre_secret
MICROSOFT_ENTRA_ID_TENANT_ID=votre_tenant
4. Démarrer l'application
npm run dev
→  http://localhost:3000

👤 Comptes par défaut


Email

Mot de passe

Rôle

Permissions
admin@aerogest.local	admin123	ADMIN	Toutes
gestionnaire@aerogest.local	gestion123	GESTIONNAIRE	Gestion des données
comptable@aerogest.local	compta123	COMPTABLE	Facturation et compta

Statistiques du Projet

57 fichiers source (hors node_modules)
14 pages (dashboard, aeronefs, vols, export, auth, etc.)
15+ routes API (RESTful)
15+ composants React réutilisables
3 schémas PostgreSQL avec 20+ tables
Système de permissions complet

📄 install_aerogest.sh
(À exécuter en root ou avec sudo)

#!/bin/bash

# =============================================
# SCRIPT D'INSTALLATION COMPLETE POUR AEROGEST
# Ubuntu 22.04/20.04 - PostgreSQL + Node.js + AeroGest
# =============================================

set -e  # Arrête le script en cas d'erreur

# ---------------------------------------------
# 1. MISE À JOUR DU SYSTÈME
# ---------------------------------------------
echo " [1/7] Mise à jour du système..."
apt-get update -y
apt-get upgrade -y
apt-get install -y curl wget gnupg2 software-properties-common

# ---------------------------------------------
# 2. INSTALLATION DE NODE.JS 20.x (LTS)
# ---------------------------------------------
echo " [2/7] Installation de Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Vérification
node -v
npm -v

# ---------------------------------------------
# 3. INSTALLATION DE POSTGRESQL 14
# ---------------------------------------------
echo " [3/7] Installation de PostgreSQL 14..."
# Ajout du dépôt officiel PostgreSQL
sh -c 'echo "deb [arch=amd64] http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
apt-get update -y
apt-get install -y postgresql-14 postgresql-client-14 postgresql-contrib-14

# ---------------------------------------------
# 4. CONFIGURATION DE POSTGRESQL
# ---------------------------------------------
echo " [4/7] Configuration de PostgreSQL..."

# Créer l'utilisateur et la base de données AeroGest
sudo -u postgres psql -c "CREATE USER aerogest WITH PASSWORD 'AeroGest2024!';"
sudo -u postgres psql -c "CREATE DATABASE aerogest WITH OWNER aerogest;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE aerogest TO aerogest;"

# Autoriser les connexions locales (mdp)
sudo sed -i "s/^local.*all.*all.*peer/local   all             all                                     md5/" /etc/postgresql/14/main/pg_hba.conf
sudo sed -i "s/^#listen_addresses = 'localhost'/listen_addresses = '*'/" /etc/postgresql/14/main/postgresql.conf

# Redémarrer PostgreSQL
systemctl restart postgresql

# ---------------------------------------------
# 5. INSTALLATION DES DÉPENDANCES PROJET
# ---------------------------------------------
echo " [5/7] Installation des dépendances du projet..."

# Se positionner dans le répertoire du projet (à adapter)
PROJECT_DIR="/opt/aerogest"
if [ ! -d "$PROJECT_DIR" ]; then
    echo "  Répertoire $PROJECT_DIR non trouvé. Veuillez placer le projet dans ce dossier ou modifier PROJECT_DIR."
    exit 1
fi

cd "$PROJECT_DIR"

# Installer les dépendances npm
echo "Installation des packages npm..."
npm install

# ---------------------------------------------
# 6. CONFIGURATION DE L'APPLICATION
# ---------------------------------------------
echo " [6/7] Configuration de l'application..."

# Créer le fichier .env à partir de .env.example
if [ ! -f ".env" ]; then
    cp .env.example .env
fi

# Remplacer les valeurs par défaut dans .env
sed -i "s|DATABASE_URL=.*|DATABASE_URL=\"postgresql://aerogest:AeroGest2024!@localhost:5432/aerogest?schema=public\"|" .env
sed -i "s|NEXTAUTH_SECRET=.*|NEXTAUTH_SECRET=$(openssl rand -hex 32)|" .env
sed -i "s|NEXTAUTH_URL=.*|NEXTAUTH_URL=http://localhost:3000|" .env

# Microsoft Entra ID (à configurer manuellement après)
echo "   - Configurez manuellement dans .env :"
echo "   - MICROSOFT_CLIENT_ID"
echo "   - MICROSOFT_CLIENT_SECRET"
echo "   - MICROSOFT_TENANT_ID"

# ---------------------------------------------
# 7. INITIALISATION DE LA BASE DE DONNÉES
# ---------------------------------------------
echo " [7/7] Initialisation de la base de données..."

# Générer le client Prisma
npx prisma generate

# Appliquer le schéma à PostgreSQL
npx prisma db push --accept-data-loss

# Remplir la base avec les données initiales
npx prisma db seed

# ---------------------------------------------
# 8. CRÉATION D'UN SERVICE SYSTEMCTL (OPTIONNEL)
# ---------------------------------------------
echo " [8/8] Création d'un service systemd (optionnel)..."

cat > /etc/systemd/system/aerogest.service <<EOL
[Unit]
Description=AeroGest Application
After=network.target postgresql.service

[Service]
User=root
WorkingDirectory=$PROJECT_DIR
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
Environment=NODE_ENV=production
EnvironmentFile=$PROJECT_DIR/.env

[Install]
WantedBy=multi-user.target
EOL

systemctl daemon-reload
systemctl enable aerogest
# systemctl start aerogest  # Décommentez pour démarrer immédiatement

# ---------------------------------------------
# RÉSULTAT
# ---------------------------------------------
echo ""
echo "========================================="
echo "INSTALLATION TERMINÉE !"
echo " ========================================="
echo ""
echo "Base de données : PostgreSQL 14 (port 5432)"
echo "   - Utilisateur : aerogest"
echo "   - Mot de passe : AeroGest2024!"
echo "   - Base : aerogest"
echo ""
echo "Pour démarrer l'application :"
echo "   cd $PROJECT_DIR"
echo "   npm run dev          # Mode développement (port 3000)"
echo "   # OU"
echo "   systemctl start aerogest  # Mode production (service)"
echo ""
echo "Accès : http://<IP_SERVEUR>:3000"
echo ""
echo "Utilisateurs par défaut :"
echo "   - admin@aerogest.local / admin123"
echo "   - gestionnaire@aerogest.local / gestionnaire123"
echo "   - comptable@aerogest.local / comptable123"
echo ""
echo "N'OUBLIEZ PAS DE :"
echo "   1. Configurer MICROSOFT_CLIENT_ID/SECRET dans .env"
echo "   2. Ouvrir le port 3000 dans le firewall (ufw allow 3000)"
echo "   3. Sécuriser PostgreSQL pour la production"
echo ""
Instructions d'utilisation

1. Télécharger le script
wget -O install_aerogest.sh https://raw.githubusercontent.com/cedricgirardeau/AeroGest/main/install_aerogest.sh
chmod +x install_aerogest.sh
2. Placer le projet AeroGest
mkdir -p /opt/aerogest

# Copiez y les fichiers du projet (via git clone ou scp)

cd /opt/aerogest
git clone https://github.com/cedricgirardeau/AeroGest.git .
3. Exécuter le script
sudo ./install_aerogest.sh
⚙️ Configuration manuelle requise
1. Microsoft Entra ID (Office 365)
Dans .env, ajoutez :

MICROSOFT_CLIENT_ID=votre_client_id
MICROSOFT_CLIENT_SECRET=votre_client_secret
MICROSOFT_TENANT_ID=votre_tenant_id
Pour obtenir ces valeurs :  Portail Azure → Azure Active Directory → Inscription des applications

2. Firewall (UFW)

sudo ufw allow 22/tcp       # SSH
sudo ufw allow 3000/tcp     # AeroGest
sudo ufw allow 5432/tcp     # PostgreSQL (optionnel)
sudo ufw enable

4. Sécurité PostgreSQL (Production)

# Changer le mot de passe PostgreSQL
sudo -u postgres psql -c "ALTER USER aerogest WITH PASSWORD 'NOUVEAU_MOT_DE_PASSE';"

# Restreindre l'accès PostgreSQL
sudo sed -i "s/^listen_addresses = '\*/listen_addresses = 'localhost'/" /etc/postgresql/14/main/postgresql.conf
sudo systemctl restart postgresql

Mises à jour futures

cd /opt/aerogest
git pull origin main
npm install
npx prisma db push
npx prisma db seed
systemctl restart aerogest

Ce script installe tout automatiquement : Node.js, PostgreSQL, dépendances npm, et 
