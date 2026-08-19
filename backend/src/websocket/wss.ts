import { WebSocketServer } from "ws";
import type { WebSocket } from "ws";
import type { Server } from "http";
import { ClientMessageSchema } from "./schemas";
import { transferService } from "../features/transfer/transferService";
import jwt from "jsonwebtoken";

type OperatorInfo = { id: string; email: string };

const warehouseWatcher = new Map<string, Map<WebSocket, OperatorInfo>>();

function broadcastPresence(warehouseId: string) {
  const watchers = warehouseWatcher.get(warehouseId);
  if (!watchers) return;

  const operators = Array.from(watchers.values());

  const payload = JSON.stringify({
    type: "PRESENCE",
    warehouseId,
    count: operators.length,
    operators,
  });

  for (const s of watchers.keys()) s.send(payload);
}

export function broadcastInventoryUpdate(result: any) {
  if (!result || result.error) return;
  const fromWatchers = warehouseWatcher.get(result.from) ?? new Map();
  const toWatchers = warehouseWatcher.get(result.to) ?? new Map();

  const update = JSON.stringify({ type: "INVENTORY_UPDATED", result });

  for (const s of fromWatchers.keys()) s.send(update);
  for (const s of toWatchers.keys()) s.send(update);
}

export function attachWebSocket(server: Server) {
  const wss = new WebSocketServer({ server });
  wss.on("connection", (socket: WebSocket) => {
    console.log("Connection established");

    let user: OperatorInfo | null = null;

    socket.on("message", async (raw) => {
      let parsed;
      try {
        parsed = JSON.parse(raw.toString());
      } catch {
        socket.send(JSON.stringify({ type: "ERROR", message: "Invalid JSON" }));
        return;
      }

      const result = ClientMessageSchema.safeParse(parsed);
      if (!result.success) {
        socket.send(
          JSON.stringify({ type: "ERROR", message: "Invalid message shape" })
        );
        return;
      }

      const msg = result.data;

      if (msg.type === "AUTH") {
        try {
          const payload = jwt.verify(
            msg.token,
            process.env.JWT_SECRET!
          ) as OperatorInfo;
          user = payload;
          socket.send(JSON.stringify({ type: "AUTH_OK" }));
        } catch {
          socket.send(
            JSON.stringify({ type: "ERROR", message: "Invalid token" })
          );
          socket.close();
        }
        return;
      }

      if (!user) {
        socket.send(
          JSON.stringify({ type: "ERROR", message: "Not authenticated" })
        );
        return;
      }

      switch (msg.type) {
        case "WATCH_WAREHOUSE":
          if (!warehouseWatcher.has(msg.warehouseId)) {
            warehouseWatcher.set(msg.warehouseId, new Map());
          }
          warehouseWatcher.get(msg.warehouseId)!.set(socket, user);
          broadcastPresence(msg.warehouseId);
          break;

        case "TRANSFER": {
          try {
            const result = await transferService.transfer({
              warehouseA_id: msg.fromWarehouseId,
              warehouseB_id: msg.toWarehouseId,
              itemId: msg.itemId,
              amount: msg.amount,
            });
            broadcastInventoryUpdate(result);
          } catch (err) {
            socket.send(
              JSON.stringify({ type: "ERROR", message: (err as Error).message })
            );
          }
        }
      }
    });

    socket.on("close", () => {
      for (const [warehouseId, watchers] of warehouseWatcher.entries()) {
        if (watchers.delete(socket)) {
          broadcastPresence(warehouseId);
        }
      }
      console.log("Connection ended");
    });
  });
  return wss;
}
