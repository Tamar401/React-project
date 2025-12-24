import { createContext, useReducer, useContext, type ReactNode } from 'react';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
type AuthAction = 
  | { type: 'LOGIN'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' };
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      return { ...state, user: action.payload.user, token: action.payload.token, isAuthenticated: true };
    case 'LOGOUT':
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return { user: null, token: null, isAuthenticated: false };
    default:
      return state;
  }
};
const AuthContext = createContext<{ state: AuthState; dispatch: React.Dispatch<AuthAction> } | undefined>(undefined);
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: (() => {
      try {
        const userData = localStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;
      } catch (error) {
        console.error('Failed to parse user data from localStorage:', error);
        localStorage.removeItem('user');
        return null;
      }
    })(),
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
  });
  return <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};