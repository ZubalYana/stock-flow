import z from "zod";

export const WarehouseSchema = z.object({
    name: z.string().min(1)
})

export type WarehouseDTO = z.infer<typeof WarehouseSchema>