# API Documentation - SM Platform Backend

## Base URL
- Local: `http://localhost:4000`
- Production: `/api`

## Authentication

### POST /api/auth/register
Créer un compte utilisateur.

**Body:**
```json
{
  "email": "user@example.com",
  "username": "user123",
  "password": "SecurePass123",
  "displayName": "User Name"
}
```

### POST /api/auth/login
Connexion. Retourne `requires2FA: true` si 2FA activée.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

### POST /api/auth/2fa/verify
Valider le code 2FA après login.

**Body:**
```json
{
  "tempToken": "...",
  "code": "123456"
}
```

### POST /api/auth/refresh
Rafraîchir les tokens.

**Body:**
```json
{
  "refreshToken": "..."
}
```

### POST /api/auth/logout
Déconnexion (authentifié).

### POST /api/auth/logout-all
Déconnexion de toutes les sessions (authentifié).

### POST /api/auth/2fa/setup
Activer 2FA — retourne QR code.

### POST /api/auth/2fa/confirm
Confirmer l'activation 2FA avec un code.

### POST /api/auth/2fa/disable
Désactiver 2FA (nécessite mot de passe).

## User

Toutes les routes nécessitent le header `Authorization: Bearer <token>`.

### GET /api/users/profile
Profil complet de l'utilisateur connecté.

### PATCH /api/users/profile
Mettre à jour le profil.

### POST /api/users/change-password
Changer le mot de passe.

### GET /api/users/sessions
Liste des sessions actives.

### DELETE /api/users/sessions/:sessionId
Révoquer une session.

### GET /api/users/activity
Historique d'activité.

### GET /api/users/notifications
Notifications.

### PATCH /api/users/notifications/:id/read
Marquer comme lue.

## Admin

Toutes les routes nécessitent le rôle `ADMIN` ou `SUPER_ADMIN`.

### GET /api/admin/dashboard
Statistiques du tableau de bord.

### GET /api/admin/users
Liste paginée des utilisateurs.
**Query:** `page`, `limit`, `search`, `role`, `sortBy`, `sortOrder`

### POST /api/admin/users
Créer un utilisateur.

### PATCH /api/admin/users/:id
Modifier un utilisateur.

### DELETE /api/admin/users/:id
Supprimer un utilisateur.

### POST /api/admin/users/:id/reset-password
Réinitialiser le mot de passe.

### GET /api/admin/activity-logs
Logs d'activité paginés.

### GET /api/admin/health
État du système (latence DB, mémoire, uptime).

## Public

Sans authentification.

### GET /api/public/reviews
Liste des avis.

### POST /api/public/reviews
Ajouter un avis.

### POST /api/public/tickets
Créer un ticket de contact.

### GET /api/public/stats
Statistiques publiques (membres, avis, tickets, serveurs).
