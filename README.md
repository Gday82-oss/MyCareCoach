# MyCareCoach

**SaaS de gestion pour coachs santé & sport**

MyCareCoach est une application web complète permettant aux coachs de gérer leurs clients, planifier des séances, suivre les progrès et gérer la facturation — le tout depuis une interface moderne et intuitive.

Site en production : **[mycarecoach.app](https://mycarecoach.app)**

---

## Fonctionnalités

**Interface Coach (accès `/app/*`)**
- Dashboard avec statistiques temps réel (revenus, clients actifs, séances)
- Gestion des clients (création, invitation par email, suivi)
- Planification des séances
- Création de programmes d'entraînement
- Facturation et paiements
- Métriques et attestations

**Interface Client mobile (accès `/client/*`)**
- Connexion sécurisée par lien d'invitation
- Consultation du programme du jour
- Suivi des séances passées
- Visualisation des progrès

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| **Frontend** | React 19 + TypeScript + Vite |
| **UI / Style** | Tailwind CSS + Framer Motion + Recharts |
| **Routing** | React Router v7 |
| **Backend / BDD** | Supabase (PostgreSQL + Auth + Storage) |
| **API serveur** | Node.js + Express (dossier `backend/`) |
| **Hébergement** | VPS (Nginx) → mycarecoach.app |

---

## Architecture du projet

```
MyCareCoach/
├── client/                   # Application React (frontend)
│   ├── src/
│   │   ├── App.tsx           # Routing principal (public / coach / client)
│   │   ├── CoachApp.tsx      # Layout coach (sidebar, header, avatar)
│   │   ├── ClientApp.tsx     # Layout app mobile client
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Clients.tsx
│   │   │   ├── Seances.tsx
│   │   │   ├── Programmes.tsx
│   │   │   ├── Paiements.tsx
│   │   │   ├── Settings.tsx
│   │   │   └── client-mobile/    # Pages interface client
│   │   │       ├── ClientToday.tsx
│   │   │       ├── ClientSeancesMobile.tsx
│   │   │       ├── ClientProgrammeMobile.tsx
│   │   │       └── ClientProgresMobile.tsx
│   │   ├── components/       # Composants réutilisables
│   │   ├── hooks/            # Custom hooks React
│   │   ├── lib/              # Client Supabase
│   │   └── contexts/         # Contextes React (auth, thème…)
│   ├── public/
│   └── vite.config.ts
├── backend/                  # Serveur Node.js + Express
│   └── scripts/              # Scripts utilitaires
├── server/                   # Ancienne couche serveur (tRPC)
├── shared/                   # Types TypeScript partagés
├── docs/                     # Documentation interne
├── nginx.conf                # Configuration Nginx (VPS)
├── deploy-prod.sh            # Script de déploiement principal
├── backup-db.sh              # Backup base de données
└── supabase_schema.sql       # Schéma SQL complet
```

---

## Installation locale

### Prérequis

- Node.js ≥ 20
- npm ≥ 9
- Un projet [Supabase](https://supabase.com) configuré

### 1. Cloner le dépôt

```bash
git clone https://github.com/Gday82-oss/MyCareCoach.git
cd MyCareCoach
```

### 2. Installer les dépendances frontend

```bash
cd client
npm install
```

### 3. Configurer les variables d'environnement

Créer un fichier `client/.env` :

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=votre_clé_anon_supabase
VITE_API_URL=http://localhost:3001
```

> Ne jamais committer ce fichier — il est dans le `.gitignore`

### 4. Lancer en développement

```bash
cd client
npm run dev
```

L'application est disponible sur `http://localhost:5173`

---

## Déploiement en production

Le déploiement se fait via le script `deploy-prod.sh` depuis la machine locale :

```bash
# Frontend uniquement
VPS_HOST=76.13.61.89 ./deploy-prod.sh frontend

# Backend uniquement
VPS_HOST=76.13.61.89 ./deploy-prod.sh backend

# Tout déployer
VPS_HOST=76.13.61.89 ./deploy-prod.sh all
```

Le script :
1. Vérifie les prérequis (Node.js, PM2)
2. Build l'application (`npm run build`)
3. Transfère les fichiers sur le VPS via `scp`
4. Configure Nginx pour servir l'application
5. (Re)démarre le serveur API avec PM2

### Variables d'environnement nécessaires sur le VPS

```env
# Sur le VPS, dans /opt/mycarecoach/.env
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=votre_clé_service_role
PORT=3001
```

---

## Base de données

Le schéma complet est dans `supabase_schema.sql`.

Tables principales :
- `coachs` — profils des coachs (email, nom, prénom, téléphone, siret, adresse)
- `clients` — clients rattachés à un coach
- `seances` — séances planifiées / passées
- `factures` — facturation

La sécurité des données est gérée par les **Row Level Security (RLS)** policies de Supabase — chaque coach ne voit que ses propres données.

---

## Contribution

Les Pull Requests sont bienvenues. Merci de :
1. Créer une branche à partir de `main`
2. Nommer clairement vos commits (ex: `feat: ajout export PDF`, `fix: correction bug login`)
3. Tester avant de soumettre la PR

---

## Licence

Ce projet est sous licence propriétaire. Tous droits réservés © 2025 MyCareCoach.
