import { log } from 'console';
import { db } from '../db';
import { User } from '../models/user';



export function createUser(name: string, email: string, password: string, role: string): Promise<number> {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, password, role], function (err) {
      if (err) return reject(err);
      resolve(this.lastID as number);
    });
  });
}

export function findByEmail(email: string, password: string): Promise<User> {
  log('usersRepo - findByEmail called with:', email, password);
  return new Promise((resolve, reject) => {
    db.get('SELECT id, name, email, role, created_at, is_active FROM users WHERE email = ? and password= ?', [email, password], (err, row) => {
      if (err) return reject(err);
    
      resolve(row as User);
    });
  });
}

export function findById(id: number): Promise<User> {
  return new Promise((resolve, reject) => {
    db.get('SELECT id, name, email, role, created_at, is_active FROM users WHERE id = ?', [id], (err, row) => {
      if (err) return reject(err);
      resolve(row as User);
    });
  });
}

export function findAll(): Promise<User[]> {
  return new Promise((resolve, reject) => {
    db.all('SELECT id, name, email, role, created_at, is_active FROM users ORDER BY id', [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows as User[]);
    });
  });
}
