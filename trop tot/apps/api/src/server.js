const app = require('./app');
const config = require('./config/env');
const db = require('./config/db');

async function start() {
  try {
    await db.init();
    app.listen(config.port, () => console.log(`API listening on ${config.port}`));
  } catch (err) {
    console.error('Failed to start API:', err);
    process.exit(1);
  }
}

start();
