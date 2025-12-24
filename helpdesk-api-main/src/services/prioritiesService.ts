import * as prioritiesRepo from '../repositories/prioritiesRepo';

export type Priority = { id: number; name: string };

export async function listPriorities(): Promise<Priority[]> {
  return await prioritiesRepo.findAll();
}

export async function getPriority(id: number): Promise<Priority | undefined> {
  return await prioritiesRepo.findById(id);
}

export async function createPriority(name: string): Promise<number> {
  return await prioritiesRepo.create(name);
}
