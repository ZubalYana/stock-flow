import type { ItemDTO } from "./itemSchema";
import type { Prisma } from "../../generated/prisma/client";
export const itemRepository = {
  async create(client: Prisma.TransactionClient, data: ItemDTO) {
    return await client.item.create({ data: { name: data.name } });
  },
  async update(client: Prisma.TransactionClient, id: string, data: ItemDTO) {
    return await client.item.update({
      where: { id },
      data: { name: data.name },
    });
  },
  async delete(client: Prisma.TransactionClient, id: string) {
    return await client.item.delete({ where: { id } });
  },
  async getById(client: Prisma.TransactionClient, id: string) {
    return await client.item.findUnique({
      where: { id },
      include: {
        stock: {
          include: { warehouse: true },
        },
      },
    });
  },
  async getAll(client: Prisma.TransactionClient) {
    return await client.item.findMany({
      include: {
        stock: {
          include: { warehouse: true },
        },
      },
    });
  },
};
