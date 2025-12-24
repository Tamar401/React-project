import { db } from '../db';
import { PriorityRow } from '../models/PriorityRow';


export function findAll(): Promise<PriorityRow[]> {
  return new Promise((resolve, reject) => {
    db.all('SELECT id, name FROM priorities ORDER BY id', [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows as PriorityRow[]);
    });
  });
}

export function findById(id: number): Promise<PriorityRow | undefined> {
  return new Promise((resolve, reject) => {
    db.get('SELECT id, name FROM priorities WHERE id = ?', [id], (err, row) => {
      if (err) return reject(err);
      resolve(row as PriorityRow | undefined);
    });
  });
}

export function create(name: string): Promise<number> {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO priorities (name) VALUES (?)', [name], function (err) {
      if (err) return reject(err);
      resolve(this.lastID as number);
    });
  });
}
