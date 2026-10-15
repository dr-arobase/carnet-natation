const db = require('../config/db');

async function findAll(){
  return db.all('SELECT * FROM nageurs ORDER BY id DESC');
}

async function findById(id){
  return db.get('SELECT * FROM nageurs WHERE id = ?', [id]);
}

async function searchByName(q){
  return db.all('SELECT * FROM nageurs WHERE nom LIKE ? ORDER BY id DESC', [`%${q}%`]);
}

async function create(data){
  const { nom, niveau, horaire, session, commentaires } = data;
  const r = await db.run('INSERT INTO nageurs (nom, niveau, horaire, session, commentaires) VALUES (?,?,?,?,?)', [nom, niveau, horaire, session, commentaires]);
  return findById(r.lastID);
}

async function update(id, data){
  const existing = await findById(id);
  if(!existing) return null;
  const { nom, niveau, horaire, session, commentaires } = data;
  await db.run('UPDATE nageurs SET nom = ?, niveau = ?, horaire = ?, session = ?, commentaires = ? WHERE id = ?', [nom || existing.nom, niveau || existing.niveau, horaire || existing.horaire, session || existing.session, commentaires || existing.commentaires, id]);
  return findById(id);
}

async function remove(id){
  await db.run('DELETE FROM nageurs WHERE id = ?', [id]);
}

module.exports = { findAll, findById, searchByName, create, update, remove };
