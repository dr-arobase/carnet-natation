const db = require('../../backend/db');

async function listNageurs() {
  return db.all('SELECT * FROM nageurs ORDER BY id DESC');
}

async function getNageur(id) {
  return db.get('SELECT * FROM nageurs WHERE id = ?', [id]);
}

async function createNageur(data) {
  const { nom, niveau, horaire, session, commentaires } = data;
  const res = await db.run('INSERT INTO nageurs (nom, niveau, horaire, session, commentaires) VALUES (?,?,?,?,?)', [nom, niveau, horaire, session, commentaires]);
  return db.get('SELECT * FROM nageurs WHERE id = ?', [res.lastID]);
}

async function updateNageur(id, data) {
  const existing = await getNageur(id);
  if (!existing) return null;
  const { nom, niveau, horaire, session, commentaires } = data;
  await db.run('UPDATE nageurs SET nom = ?, niveau = ?, horaire = ?, session = ?, commentaires = ? WHERE id = ?', [nom || existing.nom, niveau || existing.niveau, horaire || existing.horaire, session || existing.session, commentaires || existing.commentaires, id]);
  return getNageur(id);
}

async function deleteNageur(id) {
  await db.run('DELETE FROM nageurs WHERE id = ?', [id]);
  return true;
}

module.exports = {
  listNageurs,
  getNageur,
  createNageur,
  updateNageur,
  deleteNageur,
};
