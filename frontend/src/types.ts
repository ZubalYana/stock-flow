export interface Inventory{
    warehouseId: string;
    itemId?: string;
    quantity: number;
}

export interface Item{
    id: string;
    name: string;
    stock: Inventory[];
}

export interface Warehouse{
    id: string;
    name: string;
    items: Inventory[];
}