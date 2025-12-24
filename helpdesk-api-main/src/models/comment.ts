export interface Comment {
  id?: number;
  ticket_id: number;
  author_id: number;
  content: string;
  created_at?: string;
}

export interface CommentResponce extends Comment {
  author_email?: string;
  author_name?: string;
}



export type CreateCommentDTO = Omit<Comment, 'id' | 'created_at'>;
