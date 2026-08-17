import z from "zod";

export const transferSchema = z.object({
    warehouseA_id: z.string().min(1),
    warehouseB_id: z.string().min(1),
    itemId: z.string().min(1),
    amount: z.number().int().min(1)
})

export type transferDTO = z.infer<typeof transferSchema>