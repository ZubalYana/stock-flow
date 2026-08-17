import z from "zod";

export const ClientMessageSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('AUTH'),
    token: z.string(),
  }),
  z.object({
    type: z.literal('WATCH_WAREHOUSE'),
    warehouseId: z.string(),
  }),
  z.object({
    type: z.literal('TRANSFER'),
    fromWarehouseId: z.string(),
    toWarehouseId: z.string(),
    itemId: z.string(),
    amount: z.number().positive(),
  }).refine(d => d.fromWarehouseId !== d.toWarehouseId, {
    message: 'fromWarehouseId and toWarehouseId must differ',
  }),
]);