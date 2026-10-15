const express = require('express');
const db = require('../backend/db');

const router = express.Router();

// List
router.get('/', async (req, res) => {
  try {
    const rows = await db.all('SELECT * FROM nageurs ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search
router.get('/search', async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return res.json([]);
    const rows = await db.all('SELECT * FROM nageurs WHERE nom LIKE ? ORDER BY id DESC', [`%${q}%`]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'id invalide' });
    const row = await db.get('SELECT * FROM nageurs WHERE id = ?', [id]);
    if (!row) return res.status(404).json({ error: 'nageur non trouvé' });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create
router.post('/', async (req, res) => {
  const { nom, niveau, horaire, session, commentaires } = req.body;
  if (!nom) return res.status(400).json({ error: 'nom requis' });
  try {
    const result = await db.run(
      'INSERT INTO nageurs (nom, niveau, horaire, session, commentaires) VALUES (?,?,?,?,?)',
      [nom, niveau || null, horaire || null, session || null, commentaires || null]
    );
    const newRow = await db.get('SELECT * FROM nageurs WHERE id = ?', [result.lastID]);
    res.status(201).json(newRow);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'id invalide' });
    const { nom, niveau, horaire, session, commentaires } = req.body;
    const existing = await db.get('SELECT * FROM nageurs WHERE id = ?', [id]);
    if (!existing) return res.status(404).json({ error: 'nageur non trouvé' });

    await db.run(
      'UPDATE nageurs SET nom = ?, niveau = ?, horaire = ?, session = ?, commentaires = ? WHERE id = ?',
      [nom || existing.nom, niveau || existing.niveau, horaire || existing.horaire, session || existing.session, commentaires || existing.commentaires, id]
    );

    const updated = await db.get('SELECT * FROM nageurs WHERE id = ?', [id]);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'id invalide' });
    const existing = await db.get('SELECT * FROM nageurs WHERE id = ?', [id]);
    if (!existing) return res.status(404).json({ error: 'nageur non trouvé' });
    await db.run('DELETE FROM nageurs WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
