import type { ItemDTO } from "./itemSchema";
import type { InventoryDTO } from "../inventory/inventorySchema";
import { prisma } from "../../config/prisma";
import { itemRepository } from "./itemRepository";
import { inventoryRepository } from "../inventory/inventoryRepository";

export const itemService = {
    async create(itemData: ItemDTO, inventories: InventoryDTO[]) {
        if (!itemData || !inventories?.length) return { error: 'Data not provided' };

        return await prisma.$transaction(async (tx) => {
            const item = await itemRepository.create(tx, { name: itemData.name });

            const createdInventories = [];
            for (const inv of inventories) {
                const inventory = await inventoryRepository.create(tx, item.id, { warehouseId: inv.warehouseId, quantity: inv.quantity });
                createdInventories.push(inventory);
            }

            return { item, inventories: createdInventories };
        });
    },
    async update(itemId: string, data: ItemDTO) {
        if (!itemId || !data) return { error: 'Lacking credentials' };
        return await itemRepository.update(prisma, itemId, data);
    },
    async delete(itemId: string){
        if(!itemId) return { error: 'Item id not found'};
        return await itemRepository.delete(prisma, itemId)
    },
    async getById(itemId: string){
        if(!itemId) return { error: 'Item id not found'};
        return await itemRepository.getById(prisma, itemId)
    },
    async getAll(){
        return await itemRepository.getAll(prisma);
    }
};