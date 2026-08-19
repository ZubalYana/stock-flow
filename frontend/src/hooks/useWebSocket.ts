import { useEffect, useRef, useState, useCallback } from "react";
import { useAuthStore } from "../store/authStore";

type Operator = { id: string; email: string };
type Status = "connecting" | "open" | "closed";

interface UseWebSocketOptions {
  warehouseId: string | null;
  onInventoryUpdated?: (result: unknown) => void;
}

export function useWebSocket({ warehouseId, onInventoryUpdated }: UseWebSocketOptions) {
  const token = useAuthStore((state) => state.token);
  const [status, setStatus] = useState<Status>("connecting");
  const [operators, setOperators] = useState<Operator[]>([]);
  const socketRef = useRef<WebSocket | null>(null);

  const onInventoryUpdatedRef = useRef(onInventoryUpdated);
  onInventoryUpdatedRef.current = onInventoryUpdated;

  const send = useCallback((data: object) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(data));
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    const socket = new WebSocket(import.meta.env.VITE_WS_URL);
    socketRef.current = socket;
    setStatus("connecting");

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "AUTH", token }));
    };

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      switch (msg.type) {
        case "AUTH_OK":
          setStatus("open");
          if (warehouseId) {
            socket.send(JSON.stringify({ type: "WATCH_WAREHOUSE", warehouseId }));
          }
          break;
        case "PRESENCE":
          setOperators(msg.operators);
          break;
        case "INVENTORY_UPDATED":
          onInventoryUpdatedRef.current?.(msg.result);
          break;
        case "ERROR":
          console.error("WS error:", msg.message);
          break;
      }
    };

    socket.onclose = () => setStatus("closed");

    return () => {
      socket.close();
    };
  }, [token, warehouseId]);

  return { status, operators, send };
}