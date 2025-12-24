import * as statusesRepo from '../repositories/statusesRepo';

export type Status = { id: number; name: string };

export async function listStatuses(): Promise<Status[]> {
  return await statusesRepo.findAll();
}

export async function getStatus(id: number): Promise<Status | undefined> {
  return await statusesRepo.findById(id);
}

export async function createStatus(name: string): Promise<number> {
  return await statusesRepo.create(name);
}
