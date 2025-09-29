require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('../config/database.cjs');

async function run() {
  try {
    const migrationsDir = path.join(__dirname, '../migrations');
    const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

    for (const file of files) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      console.log(`[migrate] running ${file} ...`);
      await pool.query(sql);
    }
    console.log('[migrate] done');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
