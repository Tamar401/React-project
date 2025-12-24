import { Request, Response } from 'express';
import * as authService from '../services/authService';
import { TokenPayload } from '../models/user';
import { log } from 'console';



export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email and password required' });
    try {
      const { token, user } = await authService.login(email, password);
      return res.json({ token, user });
    } catch (_e: unknown) {
      log(_e);
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (_err: unknown) {
    res.status(500).json({ message: 'Server error' });
  }
}

export async function me(req: Request, res: Response) {
  try {
    const user = req.user as TokenPayload | undefined;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    // fetch fresh user data from DB
    const dbUser = await (await import('../repositories/usersRepo')).findById(user.id);
    if (!dbUser) return res.status(404).json({ message: 'Not found' });
    res.json({ id: dbUser.id, name: dbUser.name, email: dbUser.email, role: dbUser.role });
  } catch (err: unknown) {
    if (typeof err === 'object' && err !== null && (('code' in err) || ('errno' in err))) return res.status(500).json({ message: 'Database error' });
    res.status(500).json({ message: 'Server error' });
  }
}
