import { prisma } from "../../config/prisma"
import type { ItemDTO } from "./itemSchema"
import type { Prisma } from "../../generated/prisma/client" 
export const itemRepository = {
    async create(client: Prisma.TransactionClient, data: ItemDTO){
        return await client.item.create({data: {name: data.name}})
    },
    async update(id: string, data: ItemDTO){
        return await prisma.item.update({where: {id}, data: {name: data.name}})
    },
    async delete(id: string){
        return await prisma.item.delete({where: {id}})
    },
    async getById(id: string){
        return await prisma.item.findUnique({where: {id}})
    },
    async getAll(){
        return await prisma.item.findMany()
    },
}