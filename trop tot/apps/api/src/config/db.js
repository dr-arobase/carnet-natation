

































/*const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const config = require('./env');

const DB_PATH = path.resolve(config.dbPath);
const dbExists = fs.existsSync(DB_PATH);
const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) console.error('DB open error', err);
});

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve(this);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

async function init() {
  await run(`CREATE TABLE IF NOT EXISTS nageurs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    niveau TEXT,
    horaire TEXT,
    session TEXT,
    commentaires TEXT,
    created_at DATETIME DEFAULT (datetime('now'))
  )`);

  if (!dbExists) {
    await run(`INSERT INTO nageurs (nom, niveau, horaire, session, commentaires) VALUES (?,?,?,?,?)`, ['Seed', 'Nageur 1', 'Lundi', 'Session', 'seeded']);
  }
}

function close(){
  return new Promise((resolve,reject)=> db.close(err=> err? reject(err): resolve()));
}

module.exports = { db, run, all, get, init, close, DB_PATH };
*/