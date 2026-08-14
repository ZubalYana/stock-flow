import { WarehouseDTO } from "./warehouseSchema";
import type { Prisma } from "../../generated/prisma/client";

export const warehouseRepository = {
    async create(client: Prisma.TransactionClient, data: WarehouseDTO){
        return await client.warehouse.create({data})
    },
    async update(client: Prisma.TransactionClient, warehouseId: string, data: WarehouseDTO){
        return await client.warehouse.update({ where: {id: warehouseId}, data})
    },
    async delete(client: Prisma.TransactionClient, warehouseId: string){
        return await client.warehouse.delete({where: { id: warehouseId }})
    },
    async getById(client: Prisma.TransactionClient, warehouseId: string){
        return await client.warehouse.findUnique({where: { id: warehouseId}})
    },
    async getAll(client: Prisma.TransactionClient){
        return await client.warehouse.findMany()
    }
}