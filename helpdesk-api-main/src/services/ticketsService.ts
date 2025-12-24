import { Ticket, CreateTicketDTO } from '../models/ticket';
import * as ticketsRepo from '../repositories/ticketsRepo';
import * as usersRepo from '../repositories/usersRepo';

export function listTickets() {
  return ticketsRepo.findAll();
}

export function getTicket(id: number) {
  return ticketsRepo.findById(id);
}

export async function createTicket(ticket: CreateTicketDTO) {
  // Basic validation: ensure status/priority
  
  // Validate referenced users to avoid foreign key constraint errors
  if (!ticket.created_by) throw new Error('created_by is required');
  const creator = await usersRepo.findById(ticket.created_by);
  if (!creator) throw new Error('created_by user not found');
  if (ticket.assigned_to !== undefined && ticket.assigned_to !== null) {
    const assignee = await usersRepo.findById(ticket.assigned_to);
    if (!assignee) throw new Error('assigned_to must be an existing user');
    if (assignee.role !== 'agent') throw new Error('assigned_to must be an existing agent');
  }
  return ticketsRepo.create(ticket);
}

export function updateTicket(id: number, changes: Partial<Ticket>) {
  return ticketsRepo.update(id, changes);
}

export function deleteTicket(id: number) {
  return ticketsRepo.remove(id);
}
