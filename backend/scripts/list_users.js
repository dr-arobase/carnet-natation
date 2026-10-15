const { db } = require('../db');

(async () => {
  try {
    const users = await db('User').select('id', 'username', 'role', 'created_at');
    console.log(JSON.stringify(users, null, 2));
  } catch (err) {
    console.error('Erreur:', err.message || err);
  } finally {
    process.exit();
  }
})();
