export interface User {
  id: number;
  email: string;
  role: 'admin' | 'agent' | 'customer';
  name: string;
}

export interface Ticket {
  id: number;
  subject: string;
  description: string;
  status_id: number;
  status_name: string;
  priority_id: number;
  priority_name: string;
  created_by: number;
  created_by_name?: string;
  assigned_to?: number | null;
  assigned_to_name?: string | null;
  created_at: string;
}

export interface Comment {
  id: number;
  author_name: string;
  content: string;
  created_at: string;
}

export interface Status {
  id: number;
  name: string;
}

export interface Priority {
  id: number;
  name: string;
}