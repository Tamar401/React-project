import { db } from '../db';
import { Comment, CommentResponce } from '../models/comment';



export function findByTicket(ticketId: number): Promise<CommentResponce[]> {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT c.*, u.name AS author_name, u.email AS author_email
      FROM comments c
      LEFT JOIN users u ON c.author_id = u.id
      WHERE c.ticket_id = ?
      ORDER BY c.created_at ASC
    `, [ticketId], (err, rows) => {
      if (err) return reject(err);
      resolve(rows as CommentResponce[]);
    });
  });
}

export function create(comment: Comment): Promise<number> {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO comments (ticket_id, author_id, content) VALUES (?, ?, ?)',
      [comment.ticket_id, comment.author_id, comment.content], function (err) {
        if (err) return reject(err);
        resolve(this.lastID as number);
      });
  });
}
