# CoachOS 🏋️

Application de gestion pour coachs sportifs — planification de séances, suivi clients, programmes d'entraînement et paiements.

## Tech Stack

| Couche | Technologies |
|--------|-------------|
| **Frontend** | React 19, TypeScript, Vite 6, Tailwind CSS v4, React Router v7 |
| **Backend** | Node.js, Express, tRPC v11 |
| **Database** | Supabase (PostgreSQL) avec Row Level Security |
| **State** | TanStack React Query |
| **Déploiement** | Vercel (frontend), VPS + PM2 (backend), GitHub Actions CI/CD |

## Structure du projet

```
CoachOs/
├── client/          # Frontend React
│   ├── src/
│   │   ├── pages/   # Dashboard, Clients, Séances, Programmes, Paiements
│   │   ├── lib/     # Supabase client
│   │   └── App.tsx  # Layout + routing
│   └── ...
├── server/          # Backend Express + tRPC
│   └── src/
│       └── index.ts # API server
├── shared/          # Types TypeScript partagés
│   └── types.ts
├── supabase/        # Schéma SQL de la base de données
│   └── schema.sql
└── deploy.sh        # Script de déploiement
```

## Démarrage rapide

### Prérequis

- Node.js ≥ 20
- pnpm ≥ 8

### Installation

```bash
# Installer les dépendances
cd client && pnpm install
cd ../server && pnpm install
```

### Variables d'environnement

**client/.env**
```
VITE_SUPABASE_URL=<url-supabase>
VITE_SUPABASE_ANON_KEY=<clé-anon-supabase>
VITE_API_URL=http://localhost:3000
```

**server/.env**
```
PORT=3000
SUPABASE_URL=<url-supabase>
SUPABASE_KEY=<clé-service-supabase>
```

### Lancement

```bash
# Depuis la racine du projet
pnpm dev
```

Ou séparément :

```bash
# Frontend (port 5173)
cd client && pnpm dev

# Backend (port 3000)
cd server && pnpm dev
```

### Build

```bash
pnpm build
```

## Base de données

Le schéma SQL se trouve dans `supabase/schema.sql`. Il crée les tables :

- **clients** — informations des clients du coach
- **programmes** — programmes d'entraînement
- **exercices** — exercices liés aux programmes
- **seances** — séances planifiées / réalisées
- **paiements** — suivi des paiements

Toutes les tables utilisent Row Level Security pour isoler les données par utilisateur.

## Déploiement

```bash
# Déploiement complet
./deploy.sh production

# Frontend seul (Vercel)
./deploy.sh production frontend

# Backend seul (VPS)
./deploy.sh production backend
```

Voir [WORKFLOWS.md](WORKFLOWS.md) pour le détail de la CI/CD.
