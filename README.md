# SM Platform - Refonte Complète

Plateforme moderne du réseau SM — application full-stack professionnelle.

## Stack technique

- **Frontend** : React 19 + Vite + TypeScript + Tailwind CSS + shadcn/ui
- **Backend** : Node.js + Express + TypeScript + Prisma ORM
- **Base de données** : PostgreSQL 16
- **Cache** : Redis 7
- **Temps réel** : Socket.io
- **Conteneurisation** : Docker + Docker Compose

## Architecture

```
SM_SITE/
├── docker-compose.yml
├── backend/          API RESTful sécurisée
├── frontend/         Application React moderne
└── README.md
```

## Démarrage rapide

### Prérequis
- Docker Desktop
- Node.js 20+ (pour le développement local)

### Production (Docker)

```bash
# Lancer l'ensemble de la stack
docker-compose up --build -d

# Accéder à l'application
# Frontend : http://localhost
# Backend API : http://localhost:4000
```

### Développement local

```bash
# 1. Démarrer la base de données et Redis
docker-compose up -d db redis

# 2. Backend
cd backend
npm install
npx prisma migrate dev
npm run dev

# 3. Frontend (nouveau terminal)
cd frontend
npm install
npm run dev
```

## Fonctionnalités

- Interface publique premium (landing page)
- Authentification sécurisée (JWT + Refresh Tokens)
- Double authentification (2FA TOTP)
- Espace utilisateur connecté (profil, paramètres, activité)
- Espace administrateur professionnel (stats, monitoring, gestion utilisateurs)
- Système RBAC complet (5 rôles, permissions configurables)
- Notifications en temps réel (WebSocket)
- Recherche avancée, filtres, tri
- Upload sécurisé de fichiers
- Design system complet (boutons, formulaires, cartes, modales, notifications)
- Thème clair/sombre
- Responsive design
- SEO optimisé
- Accessibilité WCAG

## Documentation

- `backend/docs/API.md` — Documentation de l'API REST
- `backend/docs/SECURITY.md` — Guide sécurité
- `frontend/docs/COMPONENTS.md` — Design system

## Sécurité

- Protection injection SQL (Prisma ORM)
- Protection XSS (helmet, validation strictes)
- Protection CSRF
- Rate limiting (Redis)
- Protection brute force
- JWT sécurisés avec rotation
- Audit des actions (historisation)

## Licence

© 2026 Réseau SM — Tous droits réservés.
