import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useAlertStore } from "../store/alertStore";
import { useWebSocketStore } from "../store/websocketStore";
import { useWebSocket } from "../hooks/useWebSocket";
import type { ReactNode } from "react";
import HeaderContainer from "../components/layout/HeaderContainer";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = useAuthStore((state) => state.token);
  const addAlert = useAlertStore((s) => s.addAlert);
  const emitInventoryUpdated = useWebSocketStore((s) => s.emitInventoryUpdated);
  const setSend = useWebSocketStore((s) => s.setSend);
  const setOnPresenceChange = useWebSocketStore((s) => s.setOnPresenceChange);

  const { send } = useWebSocket({ warehouseId: null, onInventoryUpdated: emitInventoryUpdated });

  useEffect(() => {
    setSend(send);
  }, [send]);

  useEffect(() => {
    setOnPresenceChange((joined, left) => {
      joined.forEach((op) => addAlert({ severity: "info", message: `${op.email} connected.` }));
      left.forEach(() => addAlert({ severity: "info", message: `An operator disconnected.` }));
    });
  }, []);

  if (!token) return <Navigate to="/login" replace />;
  return <div className="p-5 lg:px-8"><HeaderContainer></HeaderContainer>{children}</div>;
}