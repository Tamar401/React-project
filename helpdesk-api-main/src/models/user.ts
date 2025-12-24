export type UserRole = 'admin' | 'agent' | 'customer';

export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string; 
  role: UserRole;
  created_at?: string; // ISO datetime string
  is_active?: 0 | 1;
}



export interface TokenPayload {
  id: number; // user id
  username?: string;
  name?: string;
  email?: string;
  role?: UserRole;
  iat?: number;
  exp?: number;
}
