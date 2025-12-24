import { db } from '../db';
import { Ticket } from '../models/ticket';



export function findAll(): Promise<Ticket[]> {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT t.*, s.name AS status_name, p.name AS priority_name,
             uc.name AS created_by_name, uc.email AS created_by_email,
             ua.name AS assigned_to_name, ua.email AS assigned_to_email
      FROM tickets t
      LEFT JOIN statuses s ON t.status_id = s.id
      LEFT JOIN priorities p ON t.priority_id = p.id
      LEFT JOIN users uc ON t.created_by = uc.id
      LEFT JOIN users ua ON t.assigned_to = ua.id
      ORDER BY t.created_at DESC
    `, [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows as Ticket[]);
    });
  });
}

export function findById(id: number): Promise<Ticket | undefined> {
  return new Promise((resolve, reject) => {
    db.get(`
      SELECT t.*, s.name AS status_name, p.name AS priority_name,
             uc.name AS created_by_name, uc.email AS created_by_email,
             ua.name AS assigned_to_name, ua.email AS assigned_to_email
      FROM tickets t
      LEFT JOIN statuses s ON t.status_id = s.id
      LEFT JOIN priorities p ON t.priority_id = p.id
      LEFT JOIN users uc ON t.created_by = uc.id
      LEFT JOIN users ua ON t.assigned_to = ua.id
      WHERE t.id = ?
    `, [id], (err, row) => {
      if (err) return reject(err);
      resolve(row as Ticket | undefined);
    });
  });
}

export function create(ticket: Ticket): Promise<number> {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO tickets (subject, description, status_id, priority_id, created_by, assigned_to) VALUES (?, ?, ?, ?, ?, ?)',
      [
        ticket.subject,
        ticket.description,
        ticket.status_id ?? null,
        ticket.priority_id ?? null,
        ticket.created_by,
        ticket.assigned_to ?? null,
      ],
      function (err) {
        if (err) return reject(err);
        resolve((this as any).lastID as number);
      }
    );
  });
}

export function update(id: number, changes: Partial<Ticket>): Promise<number> {
  const fields: string[] = [];
  const values: Array<string | number | null | undefined> = [];
  if (changes.subject !== undefined) { fields.push('subject = ?'); values.push(changes.subject); }
  if (changes.description !== undefined) { fields.push('description = ?'); values.push(changes.description); }
  if (changes.status_id !== undefined) { fields.push('status_id = ?'); values.push(changes.status_id); }
  if (changes.priority_id !== undefined) { fields.push('priority_id = ?'); values.push(changes.priority_id); }
  if (changes.assigned_to !== undefined) { fields.push('assigned_to = ?'); values.push(changes.assigned_to); }
  if (fields.length === 0) return Promise.resolve(0);
  values.push(id);
  const sql = `UPDATE tickets SET ${fields.join(', ')}, updated_at = datetime('now') WHERE id = ?`;
  return new Promise((resolve, reject) => {
    db.run(sql, values, function (err) {
      if (err) return reject(err);
      resolve(this.changes as number);
    });
  });
}

export function remove(id: number): Promise<number> {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM tickets WHERE id = ?', [id], function (err) {
      if (err) return reject(err);
      resolve(this.changes as number);
    });
  });
}
