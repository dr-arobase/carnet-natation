# Carnet de Natation — Projet organisé

Structure proposée :

- frontend/public/ — fichiers HTML, assets (CSS/JS/images)
  - assets/css/style.css
  - assets/js/nageurs.js
  - index.html, natation.html, admin.html, etc.
- backend/ — serveur minimal (Express) pour servir le frontend et fournir APIs
  - server.js

Démarrage local :

1. Installer dépendances :

```bash
npm install
```

2. Lancer le serveur :

```bash
## Carnet de Natation — Projet organisé

Arborescence créée sous `apps/` pour `api`, `worker` et `web`.

Démarrage rapide (API):

```bash
# Carnet de Natation — Projet organisé

Ce dépôt contient une application simple de gestion des cours de natation.

Structure principale :

- `frontend/public/` — fichiers HTML et assets (CSS/JS/images)
  - `assets/css/style.css`
  - `assets/js/nageurs.js`
  - pages : `index.html`, `natation.html`, `admin.html`, etc.
- `backend/` — serveur Express qui sert le front et expose des APIs
  - `server.js`, `app.js`, `db.js`, routes sous `backend/api/`

Démarrage local (backend) :

1. Se placer dans le dossier `backend` et installer les dépendances :

```bash
cd backend
npm install
```

2. Lancer le serveur :

```bash
npm start
# ou
node server.js
```

L'API et le front sont servis sur `http://localhost:3000` par défaut.

Pour le développement de l'API (si vous utilisez le dossier `apps/api`), procédez de la même façon dans ce dossier :

```bash
cd apps/api/src
npm install
node server.js
```

Voir `docker-compose.yml` pour une configuration conteneurisée.

TODO : corriger les vulnérabilités npm signalées, ajouter tests et CI.
