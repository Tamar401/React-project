import { Request, Response } from 'express';
import * as usersRepo from '../repositories/usersRepo';
import { TokenPayload, UserRole } from '../models/user';
import * as authService from '../services/authService';

export async function list(req: Request, res: Response) {
  try {
    const rows = await usersRepo.findAll();
    res.json(rows);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ message });
  }
}

export async function getOne(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const row = await usersRepo.findById(id);
    if (!row) return res.status(404).json({ message: 'Not found' });
    res.json(row);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ message });
  }
}


export async function create(req: Request, res: Response) {
 
   try {
       const { name, email, password, role } = req.body;
   
       if (!name || !email || !password) return res.status(400).json({ message: 'name, email and password required' });
   
       const requester = req.user as TokenPayload | undefined;
       let finalRole: UserRole = 'customer';
   
       if (requester && requester.role === 'admin') {
         // Admin creating a user: role is required
         if (!role) return res.status(400).json({ message: 'role is required when creating a user as admin' });
         if (!['admin', 'agent', 'customer'].includes(role)) return res.status(400).json({ message: 'Invalid role' });
         finalRole = role as UserRole;
       } else {
         // Public registration or non-admin: always create a customer (ignore provided role)
         finalRole = 'customer';
       }
   
       const id = await authService.register(name, email, password, finalRole);
       res.status(201).json({ id });
     } catch (err: unknown) {
       if (typeof err === 'object' && err !== null) {
         const code = (err as { code?: string }).code;
         if (code === 'SQLITE_CONSTRAINT' || code === 'SQLITE_CONSTRAINT_UNIQUE') return res.status(409).json({ message: 'Email already taken' });
       }
       if (typeof err === 'object' && err !== null && (('code' in err) || ('errno' in err))) return res.status(500).json({ message: 'Database error' });
       const message = err instanceof Error ? err.message : 'Server error';
       res.status(500).json({ message });
     
  }
}
