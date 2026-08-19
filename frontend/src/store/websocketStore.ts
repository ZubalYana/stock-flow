import { create } from "zustand";

type Operator = { id: string; email: string };
type InventoryListener = (result: any) => void;

interface WebSocketState {
  status: "connecting" | "open" | "closed";
  operators: Operator[];
  listeners: Set<InventoryListener>;
  send: (data: object) => void;
  setStatus: (status: WebSocketState["status"]) => void;
  setOperators: (operators: Operator[]) => void;
  setSend: (fn: (data: object) => void) => void;
  subscribe: (fn: InventoryListener) => () => void;
  emitInventoryUpdated: (result: any) => void;
}

export const useWebSocketStore = create<WebSocketState>((set, get) => ({
  status: "connecting",
  operators: [],
  listeners: new Set(),
  send: () => {},
  setStatus: (status) => set({ status }),
  setOperators: (operators) => set({ operators }),
  setSend: (fn) => set({ send: fn }),
  subscribe: (fn) => { get().listeners.add(fn); return () => get().listeners.delete(fn); },
  emitInventoryUpdated: (result) => { get().listeners.forEach((fn) => fn(result)); },
}));