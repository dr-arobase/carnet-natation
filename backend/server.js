// server.js — point d'entrée: prépare la base puis démarre le serveur

const app = require('./app');
const { createTable } = require('./db');

const numeroPort = process.env.PORT || 3000;

(async () => {
  try {
    console.log('Vérification de la base de données...');
    await createTable();
    console.log('Base de données prête!');
  } catch (erreur) {
    console.error('Erreur lors de la création des tables:', erreur);
    console.log('Continuation du démarrage malgré l\'erreur...');
  }

  app.listen(numeroPort, () => {
    console.log('Serveur démarré avec succès!');
    console.log(`Le serveur écoute sur le port ${numeroPort}`);
    console.log(`URL locale: http://localhost:${numeroPort}`);
  });
})();
