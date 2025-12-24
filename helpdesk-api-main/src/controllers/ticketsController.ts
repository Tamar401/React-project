import { Request, Response } from 'express';
import * as ticketsService from '../services/ticketsService';
import * as commentsService from '../services/commentsService';
import { Ticket, CreateTicketDTO, TicketResponse } from '../models/ticket';
import { TokenPayload } from '../models/user';

export async function list(req: Request<{}, TicketResponse[] | { message: string }, any>, res: Response<TicketResponse[] | { message: string }>) {
    try {
        const current = req.user as TokenPayload | undefined;
        if (!current) return res.status(401).json({ message: 'Unauthorized' });
        const role = current.role as string;
        let tickets = await ticketsService.listTickets();
        if (role === 'agent') {
            tickets = tickets.filter((t: Ticket) => t.assigned_to === current.id);
        } else if (role === 'customer') {
            tickets = tickets.filter((t: Ticket) => t.created_by === current.id);
        }
        // admin gets all — `ticketsRepo` already returns creator/assignee names/emails via JOIN
        const enriched = tickets.map((t: Ticket) => ({
            ...t,
            created_by_name: (t as any).created_by_name ?? null,
            created_by_email: (t as any).created_by_email ?? null,
            assigned_to_name: (t as any).assigned_to_name ?? null,
            assigned_to_email: (t as any).assigned_to_email ?? null,
        } as TicketResponse));
        res.json(enriched);
    } catch (err: unknown) {
        if (typeof err === 'object' && err !== null && (('code' in err) || ('errno' in err))) return res.status(500).json({ message: 'Database error' });
        const message = err instanceof Error ? err.message : 'Server error';
        res.status(500).json({ message });
    }
}

export async function getOne(req: Request<{ id: string }, TicketResponse | { message: string }, any>, res: Response<TicketResponse | { message: string }>) {
    try {
        const id = Number(req.params.id);
        const ticket = await ticketsService.getTicket(id);
        if (!ticket) return res.status(404).json({ message: 'Not found' });
        const current = req.user as TokenPayload | undefined;
        if (!current) return res.status(401).json({ message: 'Unauthorized' });
        const canAccess = (cur: TokenPayload, t: Ticket) => {
            if (cur.role === 'admin') return true;
            if (cur.role === 'agent') return t.assigned_to === cur.id;
            return t.created_by === cur.id;
        };
        if (!canAccess(current, ticket)) return res.status(403).json({ message: 'Forbidden' });
        const comments = await commentsService.listCommentsForTicket(ticket.id as number);
        // load usersRepo once and enrich comment authors
      
       

        res.json({
            ...ticket,
          
            comments: comments,
        } as TicketResponse);
    } catch (err: unknown) {
        if (typeof err === 'object' && err !== null && (('code' in err) || ('errno' in err))) return res.status(500).json({ message: 'Database error' });
        const message = err instanceof Error ? err.message : 'Server error';
        res.status(500).json({ message });
    }
}

export async function create(req: Request<{}, TicketResponse | { message: string }, CreateTicketDTO>, res: Response<TicketResponse | { message: string }>) {
    try {
        const { subject, description, priority_id } = req.body;
        const created_by = req.user?.id as number | undefined;
        if (!created_by) return res.status(401).json({ message: 'Unauthorized' });
        if (!subject || !description) return res.status(400).json({ message: 'subject and description required' });
        const pr = priority_id || 1;
        const dto: CreateTicketDTO = { subject, description, status_id: 1, priority_id: pr, created_by, assigned_to: null };
        const ticketId = await ticketsService.createTicket(dto);
        const created = await ticketsService.getTicket(ticketId);
        res.status(201).json(created);
    } catch (err: unknown) {
        if (typeof err === 'object' && err !== null && (('code' in err) || ('errno' in err))) return res.status(500).json({ message: 'Database error' });
        const message = err instanceof Error ? err.message : 'Server error';
        res.status(400).json({ message });
    }
}

export async function update(req: Request<{ id: string }, TicketResponse | { message: string }, Partial<Ticket>>, res: Response<TicketResponse | { message: string }>) {
    try {
        const id = Number(req.params.id);
        const changes = req.body as Partial<Ticket>;
        const ticket = await ticketsService.getTicket(id);
        if (!ticket) return res.status(404).json({ message: 'Not found' });
        const current = req.user as TokenPayload | undefined;
        if (!current) return res.status(401).json({ message: 'Unauthorized' });
        if (current.role !== 'admin' && current.role !== 'agent') return res.status(403).json({ message: 'Forbidden' });
        if (changes.assigned_to !== undefined) {
            if (current.role !== 'admin') return res.status(403).json({ message: 'Only admin can assign tickets' });
            const usersRepo = await import('../repositories/usersRepo');
            const user = await usersRepo.findById(Number(changes.assigned_to));
            if (!user || user.role !== 'agent') return res.status(400).json({ message: 'assigned_to must be an existing agent' });
        }
        const updated = await ticketsService.updateTicket(id, changes);
        if (updated === 0) return res.status(404).json({ message: 'Not found or no changes' });
        const newTicket = await ticketsService.getTicket(id);
        res.json(newTicket);
    } catch (err: unknown) {
        if (typeof err === 'object' && err !== null && (('code' in err) || ('errno' in err))) return res.status(500).json({ message: 'Database error' });
        const message = err instanceof Error ? err.message : 'Server error';
        res.status(400).json({ message });
    }
}

export async function remove(req: Request<{ id: string }, { deleted: number } | { message: string }, any>, res: Response<{ deleted: number } | { message: string }>) {
    try {
        const id = Number(req.params.id);
        const deleted = await ticketsService.deleteTicket(id);
        if (deleted === 0) return res.status(404).json({ message: 'Not found' });
        res.json({ deleted });
    } catch (err: unknown) {
        if (typeof err === 'object' && err !== null && (('code' in err) || ('errno' in err))) return res.status(500).json({ message: 'Database error' });
        const message = err instanceof Error ? err.message : 'Server error';
        res.status(500).json({ message });
    }
}
