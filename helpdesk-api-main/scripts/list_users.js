const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const DB_PATH = path.join(__dirname, '..', 'data', 'app.db');

const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('Failed to open DB:', err);
    process.exit(1);
  }
});

db.all('SELECT id, name, email, role, created_at, is_active FROM users ORDER BY id', [], (err, rows) => {
  if (err) {
    console.error('Query error:', err);
    process.exit(1);
  }
  console.log('Users in database:');
  if (!rows || rows.length === 0) {
    console.log('(no users found)');
  } else {
    rows.forEach(r => console.log(r));
  }
  db.close();
});
