import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

const sqlite = sqlite3.verbose();
const DB_DIR = path.join(__dirname, '..', '..', 'data');
const DB_PATH = path.join(DB_DIR, 'app.db');

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

export const db = new sqlite.Database(DB_PATH);

function runAsync(sql: string, params: any[] = []): Promise<number> {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (this: sqlite3.RunResult, err: Error | null) {
      if (err) return reject(err);
      resolve((this as any).lastID as number);
    });
  });
}

function getAsync<T = any>(sql: string, params: any[] = []): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row as T | undefined);
    });
  });
}

export async function init(): Promise<void> {
  // enable foreign keys
  await runAsync("PRAGMA foreign_keys = ON");

  // create tables if missing
  await runAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  await runAsync(`
    CREATE TABLE IF NOT EXISTS statuses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );
  `);

  await runAsync(`
    CREATE TABLE IF NOT EXISTS priorities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );
  `);

  await runAsync(`
    CREATE TABLE IF NOT EXISTS tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject TEXT NOT NULL,
      description TEXT,
      status_id INTEGER,
      priority_id INTEGER,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT,
      created_by INTEGER,
      assigned_to INTEGER,
      FOREIGN KEY(created_by) REFERENCES users(id),
      FOREIGN KEY(assigned_to) REFERENCES users(id),
      FOREIGN KEY(status_id) REFERENCES statuses(id),
      FOREIGN KEY(priority_id) REFERENCES priorities(id)
    );
  `);

  await runAsync(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticket_id INTEGER NOT NULL,
      author_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY(ticket_id) REFERENCES tickets(id),
      FOREIGN KEY(author_id) REFERENCES users(id)
    );
  `);

  // seed defaults only when users table is empty
  const row = await getAsync<{ cnt: number }>('SELECT COUNT(*) as cnt FROM users');
  const count = row ? (row.cnt as number) : 0;
  if (count === 0) {
    // insert default statuses
    const openId = await runAsync('INSERT INTO statuses (name) VALUES (?)', ['open']);
    const closedId = await runAsync('INSERT INTO statuses (name) VALUES (?)', ['closed']);

    // insert default priorities
    const lowId = await runAsync('INSERT INTO priorities (name) VALUES (?)', ['low']);
    const medId = await runAsync('INSERT INTO priorities (name) VALUES (?)', ['medium']);
    const highId = await runAsync('INSERT INTO priorities (name) VALUES (?)', ['high']);

    // insert default users (store plain password to match authService behavior)
    const adminId = await runAsync('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [
      'Admin',
      'admin@example.com',
      'password',
      'admin',
    ]);

    const agentId = await runAsync('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [
      'Agent',
      'agent@example.com',
      'password',
      'agent',
    ]);

    const customerId = await runAsync('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [
      'Customer1',
      'customer1@example.com',
      'password',
      'customer',
    ]);

    // insert sample ticket
    const ticketId = await runAsync(
      'INSERT INTO tickets (subject, description, status_id, priority_id, created_by, assigned_to) VALUES (?, ?, ?, ?, ?, ?)',
      ['Sample ticket', 'This is a sample ticket.', openId, medId, customerId, agentId]
    );

    // insert sample comment
    await runAsync('INSERT INTO comments (ticket_id, author_id, content) VALUES (?, ?, ?)', [ticketId, customerId, 'This is a sample comment.']);
  }
}
