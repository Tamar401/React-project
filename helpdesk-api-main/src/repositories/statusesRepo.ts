import { db } from '../db';
import { StatusRow } from '../models/StatusRow';


export function findAll(): Promise<StatusRow[]> {
  return new Promise((resolve, reject) => {
    db.all('SELECT id, name FROM statuses ORDER BY id', [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows as StatusRow[]);
    });
  });
}

export function findById(id: number): Promise<StatusRow | undefined> {
  return new Promise((resolve, reject) => {
    db.get('SELECT id, name FROM statuses WHERE id = ?', [id], (err, row) => {
      if (err) return reject(err);
      resolve(row as StatusRow | undefined);
    });
  });
}

export function create(name: string): Promise<number> {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO statuses (name) VALUES (?)', [name], function (err) {
      if (err) return reject(err);
      resolve(this.lastID as number);
    });
  });
}
