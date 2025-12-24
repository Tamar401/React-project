import jwt from 'jsonwebtoken';
import * as usersRepo from '../repositories/usersRepo';
import { User, UserRole } from '../models/user';
import { log } from 'console';

export interface JwtPayloadEx {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

export async function register(name: string, email: string, password: string, role: UserRole): Promise<number> {
  // store plain password per learning requirement (note: insecure in real apps)
  return usersRepo.createUser(name, email, password, role);
}



export async function login(email: string, password: string): Promise<{ token: string; user: User }> {
 log('authService - login called with:', email, password);
  const user = await usersRepo.findByEmail(email,password);
  log('authService - login found user:', user);
  if (!user) throw new Error('Invalid credentials');
  // compare plain text per requirement
  const payload: JwtPayloadEx = { id: user.id as number, name: user.name, email: user.email, role: user.role };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
}

export function verifyToken(token: string): JwtPayloadEx {
  const decoded = jwt.verify(token, JWT_SECRET);
  // jwt.verify can return string or object; normalize to our payload type
  if (typeof decoded === 'string') throw new Error('Invalid token payload');
  return decoded as JwtPayloadEx;
}
