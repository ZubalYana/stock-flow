import type { InventoryDTO } from "./inventorySchema";
import type { Prisma } from "../../generated/prisma/client";

export const inventoryRepository = {
  async create(
    client: Prisma.TransactionClient,
    itemId: string,
    data: InventoryDTO
  ) {
    return await client.inventory.create({
      data: { itemId, warehouseId: data.warehouseId, quantity: data.quantity },
    });
  },
  async update(
    client: Prisma.TransactionClient,
    itemId: string,
    warehouseId: string,
    data: InventoryDTO
  ) {
    return await client.inventory.update({
      where: { warehouseId_itemId: { warehouseId, itemId } },
      data: { quantity: data.quantity },
    });
  },
  async delete(
    client: Prisma.TransactionClient,
    itemId: string,
    warehouseId: string
  ) {
    return await client.inventory.delete({
      where: { warehouseId_itemId: { warehouseId, itemId } },
    });
  },
  async getAllByWarehouse(
    client: Prisma.TransactionClient,
    warehouseId: string
  ) {
    return await client.inventory.findMany({ where: { warehouseId } });
  },
  async getAllByItem(client: Prisma.TransactionClient, itemId: string) {
    return await client.inventory.findMany({ where: { itemId } });
  },
  async getAll(client: Prisma.TransactionClient) {
    return await client.inventory.findMany();
  },
  async decrementIfSufficient(
    client: Prisma.TransactionClient,
    itemId: string,
    warehouseId: string,
    amount: number
  ) {
    return await client.inventory.updateMany({
      where: {
        warehouseId,
        itemId,
        quantity: { gte: amount },
      },
      data: {
        quantity: { decrement: amount },
      },
    });
  },
  async incrementQuantity(
    client: Prisma.TransactionClient,
    itemId: string,
    warehouseId: string,
    amount: number
  ) {
    return await client.inventory.updateMany({
      where: {
        warehouseId,
        itemId,
      },
      data: {
        quantity: { increment: amount },
      },
    });
  },
};
