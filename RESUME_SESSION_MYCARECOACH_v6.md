---

# 📋 Prompt Instructeur — MyCareCoach (v6)
> À coller en début de nouvelle conversation Claude.ai
> pour reprendre exactement où on en est.
> Dernière mise à jour : 16 mars 2026

---

## 📌 Projet & Contexte

Projet : MyCareCoach — SaaS de gestion pour coachs
santé-sport et leurs clients
Domaine : mycarecoach.app
Repo GitHub : Gday82-oss/MyCareCoach

Type de produit :
- Web App Coach (/app/*) : Interface desktop-first, responsive
- PWA Client (/client/*) : Mobile installable, offline, push
- PWA Coach (/app/*) : Mobile installable, offline, push

Stack technique :
- Frontend : React 19 + TypeScript + Tailwind CSS + Vite
- Backend : Node.js + Express (PM2 : mycarecoach-api, id: 2)
- BDD : PostgreSQL via Supabase (ref : uztndpibiwgzcovrfrtk)
- Hébergement : VPS Hostinger — IP : 76.13.61.89
- Fichiers frontend : /var/www/mycarecoach/dist
- Backend : /opt/mycarecoach/backend
- Variables d'env : /opt/mycarecoach/.env
- Déploiement : exclusivement via ./deploy-prod.sh
- Service email : Resend (domaine mycarecoach.app vérifié)

Qui je suis : Guillaume Dayan (Gday) — autodidacte, débutant.
- Email coach : dayanguillaume82@gmail.com
- Toujours expliquer en français simple, sans jargon

Outils de travail :
- Claude.ai = coordinateur, stratégie, prompts
- Claude Code = développement backend + frontend + déploiement

---

## ✅ Ce qui est TERMINÉ et FONCTIONNEL

### Infrastructure
- VPS Hostinger (Nginx + PM2)
- Déploiement via ./deploy-prod.sh
- Backup BDD automatique à 3h
- Monitoring UptimeRobot
- ANTHROPIC_API_KEY + RESEND_API_KEY dans /opt/mycarecoach/.env
- Google Search Console validé
- Favicon cœur vert déployé

### Email (Resend)
- Domaine mycarecoach.app vérifié (Ireland eu-west-1)
- SMTP Supabase configuré (smtp.resend.com / port 465)
- Email confirmation inscription coach fonctionnel
- Email confirmation séance (coach + client)
- Cron job rappels 24h avant séance (8h00 chaque matin)

### Authentification
- Auth Coach (/login) — email/mot de passe
- Auth Client (/client/login) — email + Google OAuth
- Inscription nouveaux coachs — flux complet fonctionnel
- Bouton déconnexion interface client
- CONFLIT DE SESSION RÉSOLU :
  - Coach : storageKey mycarecoach-coach-session
  - Client : storageKey mycarecoach-client-session
  - Les deux coexistent dans le même navigateur

### Interface Coach (/app/*)
- Dashboard avec stats (clients, séances, revenus)
- Page Clients (liste, ajout, invitation)
- Page Séances / Agenda (données réelles)
- Page Programmes :
  - Création + assignation à un client
  - Bouton Activer (brouillon → actif)
  - Bouton Supprimer avec confirmation
  - Aperçu sans markdown brut (stripMarkdown)
  - Rendu markdown dans modal "Voir le détail"
- Page Métriques :
  - 7 métriques sport-santé uniquement
  - Poids, Taille, Tour de taille, Tour de hanches,
    Énergie (1-10), Sommeil (1-10), Notes
  - IMC calculé automatiquement en temps réel
  - Taille pré-remplie depuis clients.taille
  - Taille mise à jour dans clients à l'enregistrement
  - FC et tension supprimés
- Page Attestations (PDF mutuelle normes françaises)
- Page Facturation :
  - Numérotation FAC-YYYY-NNN
  - PDF normes françaises (TVA 293B, SIRET)
  - Bouton "Marquer comme payée"
- Page Rappels Email
- Page Paramètres (profil, photo, notifications, sécurité)
- Chatbot IA Coach :
  - Spécialiste santé-sport + données OMS
  - 100 messages/mois (table chat_usage)
  - Compteur dans le header
  - Sélecteur client optionnel
  - Bouton flottant "Assistant IA"
- Mode sombre
- Swipe tactile sidebar mobile (fermeture/ouverture)
- PWA Coach installable (manifest, SW, icônes)

### Interface Client (/client/*) — PWA
- Auth email + Google OAuth
- Interface mobile-first, bottom navigation 5 onglets
- Onglet Aujourd'hui : séances du jour (table seances_coach)
- Onglet Séances : données réelles, filtre semaine, badges
- Onglet Programme :
  - Affiche le programme assigné par le coach
  - Route backend GET /api/client/programme (supabaseAdmin)
  - Onglet Aujourd'hui : contenu texte du programme
  - Onglet Ma semaine : titre + contenu + durée
  - Badge statut masqué côté client
- Onglet Progrès (Métriques client) :
  - Formulaire : Poids, Taille, IMC auto, Tour de taille,
    Tour de hanches, Énergie, Sommeil, Notes
  - Taille pré-remplie depuis profil, sauvegardée via PATCH
  - IMC calculé en temps réel avec badge coloré
  - Historique 10 entrées avec variations colorées (+/- kg)
  - Graphique courbe poids (si >= 2 entrées)
  - Routes : GET + POST /api/client/metriques
- Onglet Profil :
  - Données réelles Supabase (nom, email, date naissance)
  - Objectifs (type string[] géré correctement)
  - Avatar initiales vert
  - Toggle Notifications (localStorage)
  - Bloc Confidentialité inline (lien vers /confidentialite)
  - Bloc Aide & Support inline (mailto)
  - Bouton Se déconnecter (supabaseClient isolé)
- PWA installable, offline, notifications push

### Landing Page (mycarecoach.app)
- Header : liens scroll + Espace Coach + Espace Client
- Section Fonctionnalités : 7 cards dont Assistant IA
  (card IA centrée, badge vert Pro & Business)
- Section Tarifs : 3 plans Gratuit/Pro 19€/Business 49€
  avec fonctionnalités IA intégrées
- Modal démo animée 5 slides
- Footer simplifié :
  - Contact : Nous contacter + contact@mycarecoach.app
  - Légal : CGU, Confidentialité, Mentions légales, Cookies
- SEO + Open Graph + Google Search Console

### Pages légales (toutes créées et déployées)
- /cgu — 12 articles aux normes françaises
- /confidentialite — 11 articles RGPD
- /mentions-legales — 7 articles
- /cookies — 7 articles (gestion traceurs CNIL)

### Base de données Supabase
Tables : coachs, clients, seances_coach, programmes,
metriques, exercices, attestations, chat_usage, factures

Colonnes importantes :
- metriques : poids, taille, tour_de_taille,
  tour_de_hanches, energie, sommeil, note,
  client_id, coach_id, date
- clients : prenom, nom, email, telephone,
  date_naissance, objectifs (text[]), coach_id,
  user_id, taille
- programmes : titre, contenu, client_id, coach_id,
  statut (brouillon/actif/termine), duree_semaines,
  date_debut, date_fin
- seances_coach : fait (boolean), type, duree,
  ressenti_client — PAS de colonne statut

Trigger actif : on_auth_user_created → auto-création profil coach

Routes backend importantes :
- GET /api/client/programme
- GET /api/client/profil
- PATCH /api/client/profil (mise à jour taille)
- GET + POST /api/client/metriques
- POST /api/invite-client

---

## 🔴 BUGS CONNUS / À SURVEILLER

1. Crédits Anthropic — recharger sur console.anthropic.com
2. Copyright footer landing page : affiche 2025 → corriger en 2026
3. Bouton Activer programmes — vérifier si bien visible

---

## 🔜 PROCHAINES ÉTAPES (dans l'ordre)

### 🔴 PRIORITÉ 1
1. Générateur de programmes IA :
   - Page /app/programmes/assistant
   - Formulaire coach → API Claude → JSON structuré
   - Sauvegarde dans table programmes

### 🟠 PRIORITÉ 2
2. Notifications push client (rappels séances mobile)
3. Envoi attestations par email (coach → client)

### 🔵 PRIORITÉ 3
4. Stripe — abonnements Gratuit/Pro/Business
5. Témoignages landing page (après retours testeurs)

### 🟣 PRIORITÉ 4
6. Séparation sous-domaines
   coach.mycarecoach.app / app.mycarecoach.app
7. Publication Play Store via Capacitor
8. Nettoyage repo GitHub

---

## 💾 Commandes utiles

# Connexion VPS
ssh root@76.13.61.89

# Déployer tout
./deploy-prod.sh

# Déployer frontend seulement
VPS_HOST=76.13.61.89 ./deploy-prod.sh frontend

# Déployer backend seulement
VPS_HOST=76.13.61.89 ./deploy-prod.sh backend

# Logs backend temps réel
pm2 logs mycarecoach-api --lines 50

# Redémarrer backend
pm2 restart mycarecoach-api --update-env

# Statut
pm2 status

# Vérifier les clés
cat /opt/mycarecoach/.env | grep -E "ANTHROPIC|RESEND"

---

## 🎨 Design & Couleurs

Coach /app/* → #1A2B4A — Desktop-first
Client /client/* → #00C896 + #FF8C42 — Mobile PWA
Bouton Coach → linear-gradient(135deg, #1A2B4A, #2a4070)
Bouton Client → linear-gradient(135deg, #00C896, #00a87e)
Bouton S'inscrire → linear-gradient(135deg, #00E5FF, #00C896)

---

## 🔑 Services externes

Supabase — BDD + Auth ✅
Resend — Emails transactionnels ✅
Anthropic — Chatbot IA (crédits à recharger)
UptimeRobot — Monitoring ✅
Google Search Console — SEO ✅

SMTP : smtp.resend.com / port 465
Sender : noreply@mycarecoach.app

---

## 👥 Comptes de test

Coach : dayanguillaume82@gmail.com
Client : gday82@hotmail.fr / Test123!@#

---

## 🔑 Règles importantes

- Clés secrètes UNIQUEMENT dans /opt/mycarecoach/.env
- Déploiement UNIQUEMENT via ./deploy-prod.sh
- Frontend servi depuis /var/www/mycarecoach/dist
- Table séances : seances_coach avec fait (boolean)
- Table clients : clients (pas clients_coach)
- Table programmes : programmes (pas programmes_coach)
- objectifs dans clients est de type text[] (tableau)
- GitHub = sauvegarde uniquement
- supabaseAdmin pour contourner RLS côté backend
- storageKey séparés coach/client (conflit résolu)

💡 Colle ce fichier en début de nouvelle conversation
pour reprendre exactement où on en est !
