const express = require('express');
const router = express.Router();
const { db } = require('../db');

const { authenticateJWT, authorizeRole } = require('../middleware/auth');

// Toutes les routes admin sont protégées
router.use(authenticateJWT, authorizeRole('admin'));

// Lister les utilisateurs (sans mot de passe)
router.get('/users', async (req, res) => {
  try {
    const users = await db('User').select('id', 'username', 'role', 'created_at').orderBy('created_at', 'desc');
    res.json(users);
  } catch (err) {
    console.error('Erreur GET /api/admin/users', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/*// Mettre à jour un utilisateur (role, username)
router.put('/users/:id', async (req, res) => {
  try {
    const { username, role } = req.body;
    const updates = {};
    if (username) updates.username = username;
    if (role) updates.role = role;
    await db('User').where({ id: req.params.id }).update(updates);
    res.json({ success: true });
  } catch (err) {
    console.error('Erreur PUT /api/admin/users/:id', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});*/

/*/ Supprimer un utilisateur — interdit si la cible est un admin
router.delete('/users/:id', async (req, res) => {
  try {
    const target = await db('User').where({ id: req.params.id }).first();
    if (!target) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    if (target.role === 'admin') return res.status(403).json({ error: 'Impossible de supprimer un administrateur' });
    await db('User').where({ id: req.params.id }).del();
    res.json({ success: true });
  } catch (err) {
    console.error('Erreur DELETE /api/admin/users/:id', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});*/

module.exports = router;
