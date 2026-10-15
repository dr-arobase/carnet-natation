// app.js — configuration Express et montage des routes
const express = require('express');
const path = require('path');
const session = require('express-session');


const app = express();

// Middlewares
app.use(express.json());
app.use((requete, reponse, next) => {
   console.log(new Date().toISOString(), requete.method, requete.url);
   next();
});

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret-instagram-123',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  })
);


// Servir d'abord les pages statiques (html) puis les ressources générales
app.use(express.static(path.join(__dirname, '../frontend/html')));
app.use(express.static(path.join(__dirname, '../frontend')));

// Page d'accueil -> login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/html/login.html'));
});

const UserRoutes = require('./api/gestionUser.js');
// Routes API (montées après le middleware static)
app.use('/', UserRoutes);

// Admin routes
const adminRoutes = require('./api/admin');
app.use('/api/admin', adminRoutes);

// Nageurs routes
const nageurRoutes = require('./api/gestionNageur.js');
// Expose legacy root endpoints (compatibility): e.g. POST /addNageurs -> handled by gestionNageur
app.use('/', nageurRoutes);

/* Clients routes
const clientsRoutes = require('./api/clients');
app.use('/api/clients', clientsRoutes);
*/


// (les fichiers statiques sont servis ci‑dessus)
// 404
app.use((requete, reponse) => {
  console.warn(new Date().toISOString(), '404 Non trouvé →', requete.method, requete.originalUrl);
  reponse.status(404).send('404 - Page non trouvée');
});

module.exports = app;
