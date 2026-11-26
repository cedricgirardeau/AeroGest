Projet de logiciel de gestion de mouvement aéronautique AeroGest

🎯 Fonctionnalités Implémentées
✅ Architecture Technique
Next.js 14 avec App Router et Server Components
TypeScript pour la typage fort
Tailwind CSS pour le styling moderne
Prisma ORM pour PostgreSQL
NextAuth.js pour l'authentification
React Query pour la gestion des états
xlsx et json2csv pour l'export de données
✅ Authentification
Authentification locale (email/mot de passe) avec bcrypt
Authentification Office 365 (Microsoft Entra ID) configurable
Sélection d'aérodrome de rattachement par utilisateur
Gestion des rôles et permissions (Admin, Gestionnaire, Comptable, Utilisateur)
✅ Modules Principaux
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
✅ Base de Données
Schéma complet avec 3 schémas PostgreSQL :
aer : Exploitation (pays, aérodromes, aéronefs, exploitants, dossiers de vol, mouvements)
fac : Facturation (clients, plan comptable, rubriques, factures, règlements)
sec : Sécurité (utilisateurs, rôles, permissions)
Seeders pour initialiser les données de référence
✅ UI/UX
Layout responsive avec sidebar et topbar
Sélecteur d'aérodrome dynamique
Composants réutilisables (tableaux, filtres, cartes)
Design moderne et intuitif
📁 Structure du Projet
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
🚀 Comment Démarrer
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
📊 Statistiques du Projet
57 fichiers source (hors node_modules)
14 pages (dashboard, aeronefs, vols, export, auth, etc.)
15+ routes API (RESTful)
15+ composants React réutilisables
3 schémas PostgreSQL avec 20+ tables
Système de permissions complet
