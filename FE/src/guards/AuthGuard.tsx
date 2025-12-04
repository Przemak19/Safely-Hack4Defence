import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import GlobalSpinner from "../shared/components/GlobalSpinner";
import { useAuth } from "../context/AuthContext";
import { type UserRole } from "../types/auth";

interface AuthGuardProps {
  children: ReactNode;
  mustBeLoggedIn?: boolean;
  allowedRoles?: UserRole[];
}

const AuthGuard = ({
                     children,
                     mustBeLoggedIn = true,
                     allowedRoles = []
                   }: AuthGuardProps) => {
  const { user, role, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <GlobalSpinner/>;
  }

  if (mustBeLoggedIn && !user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (!mustBeLoggedIn && user) {
    return <Navigate to="/event-list" replace />;
  }

  if (mustBeLoggedIn && allowedRoles.length > 0 && role) {
    if (!allowedRoles.includes(role)) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default AuthGuard;