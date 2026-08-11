import z from 'zod';

export const ItemSchema = z.object({
    name: z.string().min(1).max(300)
})

export type ItemDTO = z.infer<typeof ItemSchema>