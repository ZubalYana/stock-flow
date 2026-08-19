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
    return await client.inventory.findMany({
      where: { warehouseId },
      include: { warehouse: true, item: true },
    });
  },
  async getAllByItem(client: Prisma.TransactionClient, itemId: string) {
    return await client.inventory.findMany({
      where: { itemId },
      include: { warehouse: true, item: true },
    });
  },
  async getAll(client: Prisma.TransactionClient) {
    return await client.inventory.findMany({
      include: { item: true, warehouse: true },
    });
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
    return await client.inventory.upsert({
      where: { warehouseId_itemId: { warehouseId, itemId } },
      update: { quantity: { increment: amount } },
      create: { warehouseId, itemId, quantity: amount },
    });
  },
};
