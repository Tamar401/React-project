import { Request, Response } from 'express';
import * as commentsService from '../services/commentsService';
import * as ticketsService from '../services/ticketsService';
import { findById as findUserById } from '../repositories/usersRepo';
import { Ticket } from '../models/ticket';
import { TokenPayload } from '../models/user';
import { log } from 'console';
import { CommentResponce } from '../models/comment';

export async function listByTicket(req: Request, res: Response<CommentResponce[] | { message: string }>) {
  try {
    const ticketId = Number(req.params.ticketId);
    const comments = await commentsService.listCommentsForTicket(ticketId);
 
    res.json(comments);
  } catch (err: unknown) {
    if (typeof err === 'object' && err !== null && (('code' in err) || ('errno' in err))) return res.status(500).json({ message: 'Database error' });
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ message });
  }
}

const canAccess = (cur: TokenPayload, t: Ticket) => {
  if (cur.role === 'admin') return true;
  if (cur.role === 'agent') return t.assigned_to === cur.id;
  return t.created_by === cur.id;
};

export async function create(req: Request, res: Response) {
  try {
    const ticketId = Number(req.params.ticketId);
    const author_id = req.user?.id as number | undefined;
    if (!author_id)
      return res.status(401)
        .json({ message: 'Unauthorized' });
    const { content } = req.body;
    if (!content || !content.trim())
      return res.status(400)
        .json({ message: 'Content required' });

    const ticket = await ticketsService.getTicket(ticketId);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    const current = req.user as TokenPayload | undefined;
    if (!current) return res.status(401).json({ message: 'Unauthorized' });

    if (!canAccess(current, ticket)) return res.status(403).json({ message: 'Forbidden' });

    const id = await commentsService.addComment({ ticket_id: ticketId, author_id, content });
    const author = await findUserById(author_id);
    // return the created comment with author name/email
    res.status(201).json({ id, ticket_id: ticketId, author_id, content, author_name: author ? author.name : null, author_email: author ? author.email : null });
  } catch (err: unknown) {
    log(err);
    if (typeof err === 'object' && err !== null && (('code' in err) || ('errno' in err))) return res.status(500).json({ message: 'Database error' });
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ message });
  }
}
