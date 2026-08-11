/*
  Warnings:

  - You are about to drop the `WarehouseItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "WarehouseItem" DROP CONSTRAINT "WarehouseItem_itemId_fkey";

-- DropForeignKey
ALTER TABLE "WarehouseItem" DROP CONSTRAINT "WarehouseItem_warehouseId_fkey";

-- DropTable
DROP TABLE "WarehouseItem";

-- CreateTable
CREATE TABLE "Inventory" (
    "warehouseId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("warehouseId","itemId")
);

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
