const knex = require('knex');
const path = require('path');

// Chemin du fichier SQLite (configurable)
const db = knex({
   client: 'sqlite3',
   connection: {
      filename: "./basededonnees.sqlite3",
   },
   useNullAsDefault: true,
});

// Création des tables (User, Post, Likes, Comments) si absentes
async function creerLesTablesSiNecessaire() {
   const tableUserExiste = await db.schema.hasTable('User');
   
   if (!tableUserExiste) {
      await db.schema.createTable('User', (table) => {
         table.string('id').primary();
         table.string('username').notNullable();
         table.string('password').notNullable();
         table.string('role').notNullable().defaultTo('user');
         table.timestamp('created_at').defaultTo(db.fn.now());
      });
      console.log("Table 'User' créée");
   }
  
  // S'assurer qu'il y a au moins un administrateur (seed)
  try {
    const adminExists = await db('User').where({ role: 'admin' }).first();
    if (!adminExists) {
      const bcrypt = require('bcryptjs');
      const crypto = require('crypto');
      const password = process.env.ADMIN_PASSWORD || 'admin123';
      const hashed = await bcrypt.hash(password, 10);

      const adminUser = { 
        id: crypto.randomUUID(),
         username: process.env.ADMIN_USER || 'admin', 
         password: hashed, 
         role: 'admin'
         };
      await db('User').insert(adminUser);
      console.log('Admin seed créé (username:', adminUser.username, ')');
    }
  } catch (err) {
    console.warn('Erreur lors du seed admin:', err.message || err);
  }


   const tableNageursExiste = await db.schema.hasTable('nageurs');
   
   if (!tableNageursExiste) {
    await db.schema.createTable('nageurs', (table) => {
      table.string('id').primary();
      table.string('nom').notNullable();
      table.string('prenom').notNullable();
      table.string('niveau').notNullable();
      table.string('horaire').notNullable();
      table.string('notes');
      table.timestamp('created_at').defaultTo(db.fn.now());
    });
      console.log("Table 'nageurs' créée");
   }

   /*const tableLikesExiste = await db.schema.hasTable('Likes');
   
   if (!tableLikesExiste) {
      await db.schema.createTable('Likes', (table) => {
         table.string('id').primary();
         table.string('post_id').notNullable();
         table.string('username').notNullable();
         table.timestamp('created_at').defaultTo(db.fn.now());
         table.unique(['post_id', 'username']);
      });
      console.log("Table 'Likes' créée");
   }*/

   /*/const tableCommentsExiste = await db.schema.hasTable('Comments');
   
   if (!tableCommentsExiste) {
      await db.schema.createTable('Comments', (table) => {
         table.string('id').primary();
         table.string('post_id').notNullable();
         table.string('username').notNullable();
         table.string('content').notNullable();
         table.timestamp('created_at').defaultTo(db.fn.now());
      });
      console.log("Table 'Comments' créée");
   }*/
}

module.exports = { 
   db,
   createTable: creerLesTablesSiNecessaire
};























































/*const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'database.sqlite');

const dbExists = fs.existsSync(DB_PATH);

// Open DB with create/readwrite flags
const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) console.error('Erreur ouverture DB:', err);
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
  // Ensure schema exists
  await run(`CREATE TABLE IF NOT EXISTS nageurs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    niveau TEXT,
    horaire TEXT,
    session TEXT,
    commentaires TEXT,
    created_at DATETIME DEFAULT (datetime('now'))
  )`);

  // Seed a sample row only if DB file did not exist before
  if (!dbExists) {
    await run(`INSERT INTO nageurs (nom, niveau, horaire, session, commentaires) VALUES (?,?,?,?,?)`, [
      'Exemple Test', 'Nageur 1', 'Lundi 14h', 'Session Hiver', 'enregistré automatiquement'
    ]);
  }
}

function close() {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

module.exports = {
  db,
  run,
  all,
  get,
  init,
  close,
  DB_PATH,
};
*/