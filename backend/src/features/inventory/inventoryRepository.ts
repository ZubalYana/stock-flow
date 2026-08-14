import type { InventoryDTO } from "./inventorySchema";
import { prisma } from "../../config/prisma";
import type { Prisma } from "../../generated/prisma/client" 


export const inventoryRepository = {
    async create(client: Prisma.TransactionClient, itemId: string, data: InventoryDTO){
        return await client.inventory.create({data: {itemId, warehouseId: data.warehouseId, quantity: data.quantity}})
    },
    async update(itemId: string, warehouseId: string, data: InventoryDTO){
        return await prisma.inventory.update({where: {warehouseId_itemId: {warehouseId, itemId}}, data: {quantity: data.quantity}})
    },
    async delete(itemId: string, warehouseId: string){
        return await prisma.inventory.delete({where: {warehouseId_itemId: {warehouseId, itemId}}})
    },
    async getAllByWarehouse(warehouseId: string){
        return await prisma.inventory.findMany({where: {warehouseId}})
    },
    async getAllByItem(itemId: string){
        return await prisma.inventory.findMany({where: {itemId}})
    },
    async getAll(){
        return await prisma.inventory.findMany()
    }
}