import type { User } from "../types";
export const isAdmin = (user?: User): boolean => {
  return user?.role === 'admin';
};
export const isAgent = (user?: User): boolean => {
  return user?.role === 'agent';
};
export const isCustomer = (user?: User): boolean => {
  return user?.role === 'customer';
};
export const canEdit = (user?: User): boolean => {
  return isAdmin(user) || isAgent(user);
};
export const hasRole = (user?: User, roles?: string[]): boolean => {
  if (!user || !roles) return false;
  return roles.includes(user.role);
};
export const getRoleColor = (role: string): string => {
  const roleColors: { [key: string]: string } = {
    admin: 'error',
    agent: 'info',
    customer: 'default'
  };
  return roleColors[role] || 'default';
};
