import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import type { ReactNode } from "react";
import HeaderContainer from "../components/layout/HeaderContainer";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = useAuthStore((state) => state.token);

  if (!token) return <Navigate to="/login" replace />;
  return <div className="p-5 lg:px-8"><HeaderContainer></HeaderContainer>{children}</div>;
}