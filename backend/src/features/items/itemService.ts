import type { ItemDTO } from "./itemSchema";
import type { InventoryDTO } from "../inventory/inventorySchema";
import { prisma } from "../../config/prisma";

export const itemService = {
    async create(itemData: ItemDTO, inventories: InventoryDTO[]) {
        if (!itemData || !inventories?.length) return { error: 'Data not provided' };

        return await prisma.$transaction(async (tx) => {
            const item = await tx.item.create({ data: { name: itemData.name } });

            const createdInventories = [];
            for (const inv of inventories) {
                const inventory = await tx.inventory.create({
                    data: { itemId: item.id, warehouseId: inv.warehouseId!, quantity: inv.quantity }
                });
                createdInventories.push(inventory);
            }

            return { item, inventories: createdInventories };
        });
    },
    async update(data: ItemDTO) {}
};