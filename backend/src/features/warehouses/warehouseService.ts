import { warehouseRepository } from "./warehouseRepository";
import { WarehouseSchema } from "./warehouseSchema";
import type { WarehouseDTO } from "./warehouseSchema";
import z from "zod";
import { prisma } from "../../config/prisma";

export const warehouseService = {
    async create(data: WarehouseDTO){
        const parsed = WarehouseSchema.safeParse(data);
        if(!parsed.success) return { error: z.treeifyError(parsed.error) }
        if(!data) return { error: 'Error creating warehouse, name not found'}
        return await warehouseRepository.create(prisma, data)
    },
    async update(warehouseId: string, data: WarehouseDTO){
        const parsed = WarehouseSchema.safeParse(data);
        if(!parsed.success) return { error: z.treeifyError(parsed.error)}
        if(!warehouseId) return { error: 'Warehouse not found'}
        return await warehouseRepository.update(prisma, warehouseId, parsed.data)
    },
    async delete(warehouseId: string){
        if(!warehouseId) return { error: 'Warehouse not found'}
        return await warehouseRepository.delete(prisma, warehouseId)
    },
    async getById(warehouseId: string){
        if(!warehouseId) return { error: 'Warehouse not found'}
        return await warehouseRepository.getById(prisma, warehouseId)
    },
    async getAll(){
        return await warehouseRepository.getAll(prisma)
    }
}