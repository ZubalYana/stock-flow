import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useWebSocketStore } from "../store/websocketStore";
import { useWebSocket } from "../hooks/useWebSocket";
import type { ReactNode } from "react";
import HeaderContainer from "../components/layout/HeaderContainer";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = useAuthStore((state) => state.token);
  const emitInventoryUpdated = useWebSocketStore((s) => s.emitInventoryUpdated);
  const setSend = useWebSocketStore((s) => s.setSend);

  const { send } = useWebSocket({ warehouseId: null, onInventoryUpdated: emitInventoryUpdated });

  useEffect(() => {
    setSend(send);
  }, [send]);

  if (!token) return <Navigate to="/login" replace />;
  return <div className="p-5 lg:px-8"><HeaderContainer></HeaderContainer>{children}</div>;
}