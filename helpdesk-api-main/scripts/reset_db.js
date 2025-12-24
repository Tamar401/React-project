const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DB_PATH = path.join(__dirname, '..', 'data', 'app.db');

try {
  if (fs.existsSync(DB_PATH)) {
    console.log('Removing DB file:', DB_PATH);
    fs.unlinkSync(DB_PATH);
  } else {
    console.log('DB file does not exist, nothing to remove.');
  }

  console.log('Building TypeScript...');
  execSync('npm run build', { stdio: 'inherit' });

  const dbModulePath = path.join(__dirname, '..', 'dist', 'db.js');
  if (!fs.existsSync(dbModulePath)) {
    console.error('Compiled db module not found at', dbModulePath);
    process.exit(1);
  }

  console.log('Initializing DB (calling dist/db.init())...');
  const db = require(dbModulePath);
  if (typeof db.init === 'function') {
    db.init();
    console.log('DB init() called. Database should be recreated and seeded.');
  } else {
    console.error('dist/db does not export init()');
    process.exit(1);
  }

  console.log('Done. You can now start the server with: npm run start');
} catch (err) {
  console.error('Reset failed:', err);
  process.exit(1);
}
