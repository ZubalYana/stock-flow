import { transferSchema } from "./transferSchema";
import type { transferDTO } from "./transferSchema";
import { inventoryRepository } from "../inventory/inventoryRepository";
import { prisma } from "../../config/prisma";
import z from "zod";

export const transferService = {
    async transfer(data: transferDTO){
        const parsed = transferSchema.safeParse(data);
        if (!parsed.success) return { error: z.treeifyError(parsed.error) };

        return await prisma.$transaction(async (tx) => {
            const decrementResult = await inventoryRepository.decrementIfSufficient(
                tx, parsed.data.itemId, parsed.data.warehouseA_id, parsed.data.amount
            );

            if (decrementResult.count === 0) {
                throw new Error('Insufficient stock in source warehouse');
            }

            const incrementResult = await inventoryRepository.incrementQuantity(
                tx, parsed.data.itemId, parsed.data.warehouseB_id, parsed.data.amount
            );

            if (incrementResult.count === 0) {
                throw new Error('Destination warehouse inventory record not found');
            }

            return { success: true, itemId: parsed.data.itemId, from: parsed.data.warehouseA_id, to: parsed.data.warehouseB_id, amount: parsed.data.amount };
        });
    }
}