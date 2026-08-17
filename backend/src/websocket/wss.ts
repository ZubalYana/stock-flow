import { WebSocketServer } from "ws";
import type { WebSocket } from "ws";
import type { Server } from "http";
import { ClientMessageSchema } from "./schemas";
import { transferService } from "../features/transfer/transferService";
import jwt from 'jsonwebtoken';

const warehouseWatcher = new Map<string, Set<WebSocket>>();

export function attachWebSocket(server: Server) {
  const wss = new WebSocketServer({ server });
  wss.on("connection", (socket: WebSocket) => {
    console.log("Connection established");

    let user: { id: string, email: string } | null = null;

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

       if (msg.type === 'AUTH') {
      try {
        const payload = jwt.verify(msg.token, process.env.JWT_SECRET!) as { id: string; email: string };
        user = payload;
        socket.send(JSON.stringify({ type: 'AUTH_OK' }));
      } catch {
        socket.send(JSON.stringify({ type: 'ERROR', message: 'Invalid token' }));
        socket.close();
      }
      return;
    }

    if (!user) {
      socket.send(JSON.stringify({ type: 'ERROR', message: 'Not authenticated' }));
      return;
    }

      switch (msg.type) {
        case "WATCH_WAREHOUSE":
          if (!warehouseWatcher.has(msg.warehouseId)) {
            warehouseWatcher.set(msg.warehouseId, new Set());
          }
          warehouseWatcher.get(msg.warehouseId)!.add(socket);
          break;

        case "TRANSFER": {
          try {
            const result = await transferService.transfer({
              warehouseA_id: msg.fromWarehouseId,
              warehouseB_id: msg.toWarehouseId,
              itemId: msg.itemId,
              amount: msg.amount,
            });
            const fromWatchers =
              warehouseWatcher.get(msg.fromWarehouseId) ?? new Set();
            const toWatchers =
              warehouseWatcher.get(msg.toWarehouseId) ?? new Set();

            const update = JSON.stringify({
              type: "INVENTORY_UPDATED",
              result,
            });

            for (const s of fromWatchers) s.send(update);
            for (const s of toWatchers) s.send(update);
          } catch (err) {
            socket.send(
              JSON.stringify({ type: "ERROR", message: (err as Error).message })
            );
          }
        }
      }
    });
    socket.on("close", () => {
        for ( const watchers of warehouseWatcher.values()){
            watchers.delete(socket)
        }
        console.log("Connection ended")
    });
  });
  return wss;
}
