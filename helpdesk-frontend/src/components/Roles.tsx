import type { FC, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface RolesProps {
  children: ReactNode;
  roles: string[];
}

const Roles: FC<RolesProps> = ({ children, roles }) => {
  const { state } = useAuth();
  if (!state.isAuthenticated) return <Navigate to="/login" />;
  if (state.user && !roles.includes(state.user.role)) return <Navigate to="/dashboard" />;
  return <>{children}</>;
};

export default Roles;