const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const DB_PATH = path.join(__dirname, '..', 'data', 'app.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Failed to open DB:', err);
    process.exit(1);
  }
});

function runSql(sql, params=[]) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

(async () => {
  try {
    const fk = await runSql("PRAGMA foreign_keys;");
    console.log('PRAGMA foreign_keys ->', fk);

    const info = await runSql("PRAGMA table_info('tickets');");
    console.log("PRAGMA table_info('tickets'):");
    console.table(info);

    const fkList = await runSql("PRAGMA foreign_key_list('tickets');");
    console.log("PRAGMA foreign_key_list('tickets'):");
    console.table(fkList);

    console.log('\nAttempting a test INSERT inside a transaction (will rollback)');
    await new Promise((res, rej) => db.exec('BEGIN TRANSACTION', (e) => e ? rej(e) : res()));
    await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO tickets (subject, description, status_id, priority_Id, created_by, assigned_to) VALUES (?, ?, ?, ?, ?, ?)',
        ['Test insert', 'Testing FK', 1, 2, 3, null],
        function(err) {
          if (err) return reject(err);
          resolve(this.lastID);
        }
      );
    }).then(id => console.log('Inserted id:', id)).catch(err => { throw err; });
    await new Promise((res, rej) => db.exec('ROLLBACK', (e) => e ? rej(e) : res()));
    console.log('Transaction rolled back (insert succeeded)');
  } catch (err) {
    console.error('Error during check:', err);
    try { await new Promise((res, rej) => db.exec('ROLLBACK', (e) => e ? rej(e) : res())); } catch (_) {}
  } finally {
    db.close();
  }
})();
