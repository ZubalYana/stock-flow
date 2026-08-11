import z from "zod";

export const InventorySchema = z.object({
    itemId: z.string().min(1),
    warehouseId: z.string().min(1),
    quantity: z.number().int().min(0)
})

export type InventoryDTO = z.infer<typeof InventorySchema>