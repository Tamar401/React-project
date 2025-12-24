import { Request, Response, NextFunction } from 'express';
import * as prioritiesService from '../services/prioritiesService';

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const items = await prioritiesService.listPriorities();
    res.json(items);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const { name } = req.body as { name: string };
    if (!name) return res.status(400).json({ message: 'name is required' });
    const id = await prioritiesService.createPriority(name);
    res.status(201).json({ id, name });
  } catch (err) {
    next(err);
  }
}
