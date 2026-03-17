# Résumé de session MyCareCoach — v8 (17 mars 2026)

## Corrections de bugs (Fix)

- **Routes backend client** : filtrage par `user_id` au lieu de l'email — plus robuste et sécurisé
- **INSERT métriques** : suppression du champ `coach_id` des insertions (champ inexistant en DB)
- **Trust proxy** : activation dans Express pour corriger les erreurs `express-rate-limit` derrière le proxy VPS
- **ClientPortal** : remplacé par une redirection vers `/client` (page inutile supprimée)
- **Couleurs emerald** : remplacées par la couleur officielle `#00C896` (vert MyCareCoach)
- **Couleurs orange** : suppression des occurrences `#FF8C42` non conformes à la charte

## Nouvelles fonctionnalités (Feat)

- **2 PWA distinctes** : manifest Coach (vert #00C896) et manifest Client (violet #7C3AED)
- **Bannières installation PWA** : affichées sur les pages login coach et client
- **Mode sombre interface client** : thème sombre complet pour l'espace mobile client
- **Swipe tactile sidebar** : navigation fluide par glissement sur mobile
- **Page login client** : redesign en violet, conforme à la charte client

## Nettoyage (Clean)

- **5 fichiers orphelins supprimés** (~103 kB) :
  - `ClientProfile.tsx` → remplacé par `ClientProfilPage.tsx`
  - `ClientProgrammeMobile.tsx` → remplacé par `ClientProgramme.tsx`
  - `ClientProgresMobile.tsx` → remplacé par `ClientMetriquesPage.tsx`
  - `ClientSeancesMobile.tsx` → remplacé par `ClientSeances.tsx`
  - `ClientToday.tsx` → remplacé par `ClientAccueil.tsx`
- **Headers sécurité Nginx** ajoutés (X-Frame-Options, CSP, HSTS…)
- **manifest-coach.json** : `theme_color` corrigé

## Documentation (Doc)

- **README.md** mis à jour
- **RESUME_SESSION_MYCARECOACH_v8.md** présent (ce fichier)

## Statistiques

- 56 fichiers modifiés
- +6 416 lignes ajoutées / -2 977 lignes supprimées
- Architecture app client entièrement refactorée (5 nouveaux composants)
