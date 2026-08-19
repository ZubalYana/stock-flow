# Stock-flow

A real-time warehouse inventory management system built for a technical internship assignment. Multiple operators can view stock levels and transfer items between warehouses concurrently, with all changes synced live across connected clients via WebSocket.

## Core requirements addressed

- Multiple warehouses, each holding a list of items with current quantities
- Operators can transfer an item from one warehouse to another
- All inventory changes propagate to every connected client in real time, no page reload
- Concurrent transfers of the same item are handled safely — quantities never go negative, even under simultaneous conflicting requests
- Live presence: the UI shows which operators are currently connected, and surfaces connect/disconnect events as they happen

## Tech stack

**Backend**
- Node.js + Express + TypeScript
- PostgreSQL (Docker), via Prisma 7 with the `PrismaPg` driver adapter
- `ws` for the WebSocket layer (no Socket.io — a single `http.createServer` instance is shared between the REST API and the WebSocket upgrade handler)
- Zod for request/message validation, including a `discriminatedUnion` schema for typed WebSocket message handling
- Architecture: Repository → Service → Controller → Route, with transfer logic wrapped in a single Prisma `$transaction`

**Frontend**
- React + Vite + TypeScript
- Zustand for shared state (auth, alerts, and a dedicated WebSocket store)
- MUI components + Tailwind CSS for layout
- React Router

## Real-time architecture

A single WebSocket connection is opened once per session (inside the app's protected-route wrapper) and shared across the whole app via a Zustand store — components subscribe to state rather than opening their own connections.

**Client → server message types:**
- `AUTH` — authenticates the socket with a JWT, required before any other message is accepted
- `WATCH_WAREHOUSE` — registers the socket as a watcher of a given warehouse, so it receives that warehouse's presence and inventory events
- `TRANSFER` — requests an item transfer between two warehouses

**Server → client message types:**
- `AUTH_OK` / `ERROR`
- `PRESENCE` — the current list of operators watching a warehouse, sent whenever someone joins or leaves
- `INVENTORY_UPDATED` — broadcast to the watchers of both affected warehouses after a successful transfer

Transfers can be submitted either over the WebSocket (`TRANSFER` message) or via a REST endpoint (`POST /transfer`); both paths funnel through the same service and the same broadcast function, so real-time sync is consistent regardless of which path a client uses.

## Concurrency handling

The critical requirement — two operators transferring from the same warehouse at the same time without the quantity going negative — is enforced at the database level, not in application code:

- **Decrementing the source warehouse** uses a single atomic `updateMany` call with a `quantity >= amount` guard baked into the `WHERE` clause. The check-and-write happen as one SQL operation, so a second concurrent request that would overdraw the stock simply matches zero rows and is rejected — there is no window between "check" and "write" for a race to slip through.
- **Incrementing the destination warehouse** uses an `upsert`, so a warehouse receiving its first unit of an item creates the inventory record rather than failing.
- Both operations run inside a single Prisma `$transaction`, so a failed increment (or any error) rolls back the decrement as well.

This was verified manually: two browser tabs, same item, overlapping transfer requests where the combined amount exceeds available stock — the correct request succeeds, the other is rejected with an "insufficient stock" error, and quantities never dip below zero.

## Presence

Presence is tracked per warehouse on the backend (`Map<warehouseId, Map<socket, operatorInfo>>`), updated on `WATCH_WAREHOUSE` and on socket disconnect. The frontend surfaces this as an operator count and an expandable list of connected emails in the header, plus toast alerts when an operator connects or disconnects.

**Known scope decision:** presence is deduplicated by user identity, not by socket/tab — multiple tabs open under the same account count as one connected operator, consistent with the assignment's framing of "which operators are connected" rather than "how many browser tabs are open."

## Getting started

```bash
# backend
cd backend
npm install
docker compose up -d      # starts PostgreSQL
npx prisma migrate deploy # or `prisma migrate dev` in development
npm run dev

# frontend
cd frontend
npm install
npm run dev
```
