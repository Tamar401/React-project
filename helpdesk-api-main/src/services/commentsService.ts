import { Comment } from '../models/comment';
import * as commentsRepo from '../repositories/commentsRepo';

export function listCommentsForTicket(ticketId: number) {
  return commentsRepo.findByTicket(ticketId);
}

export function addComment(comment: Comment) {
  return commentsRepo.create(comment);
}
