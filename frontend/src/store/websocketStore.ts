import { create } from "zustand";

type Operator = { id: string; email: string };
type InventoryListener = (result: any) => void;

interface WebSocketState {
  status: "connecting" | "open" | "closed";
  operators: Operator[];
  seenOperatorIds: Set<string>;
  listeners: Set<InventoryListener>;
  send: (data: object) => void;
  onPresenceChange: ((joined: Operator[], left: string[]) => void) | null;
  setStatus: (status: WebSocketState["status"]) => void;
  setOperators: (operators: Operator[]) => void;
  setSend: (fn: (data: object) => void) => void;
  setOnPresenceChange: (fn: WebSocketState["onPresenceChange"]) => void;
  subscribe: (fn: InventoryListener) => () => void;
  emitInventoryUpdated: (result: any) => void;
}

export const useWebSocketStore = create<WebSocketState>((set, get) => ({
  status: "connecting",
  operators: [],
  seenOperatorIds: new Set(),
  listeners: new Set(),
  send: () => {},
  onPresenceChange: null,
  setStatus: (status) => set({ status }),
  setOperators: (newOperators) => {
    const seen = get().seenOperatorIds;
    const newIds = new Set(newOperators.map((o) => o.id));

    const joined = newOperators.filter((o) => !seen.has(o.id));
    const left = Array.from(seen).filter((id) => !newIds.has(id));

    if (joined.length || left.length) {
      get().onPresenceChange?.(joined, left);
    }

    joined.forEach((o) => seen.add(o.id));
    left.forEach((id) => seen.delete(id));

    set({ operators: newOperators });
  },
  setSend: (fn) => set({ send: fn }),
  setOnPresenceChange: (fn) => set({ onPresenceChange: fn }),
  subscribe: (fn) => {
    get().listeners.add(fn);
    return () => get().listeners.delete(fn);
  },
  emitInventoryUpdated: (result) => {
    get().listeners.forEach((fn) => fn(result));
  },
}));