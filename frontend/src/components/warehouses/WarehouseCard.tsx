import type { Warehouse } from "../../types";
import { Trash2, Pencil } from "lucide-react";

interface WarehouseCardProps {
    warehouse: Warehouse;
    onDelete: (warehouseId: string, warehouseName: string) => void;
    onEdit: (warehouseId: string, warehouseName: string) => void;
}

export default function WarehouseCard({ warehouse, onDelete, onEdit }: WarehouseCardProps) {
    console.log('warehouse:', warehouse)
    return (
        <div className="w-full sm:w-80 bg-white shadow-sm rounded-xl p-4 hover:shadow-md transition-shadow relative">
            <div className="absolute top-4 right-4 flex gap-x-2 items-center">
                <Pencil
                    size={18}
                    className="text-slate-600 cursor-pointer "
                    onClick={() => onEdit(warehouse.id, warehouse.name)}
                />
                <Trash2
                    size={18}
                    className="text-red-800 cursor-pointer "
                    onClick={() => onDelete(warehouse.id, warehouse.name)}
                />
            </div>
            <h3 className="font-medium text-slate-800 mb-2 truncate">{warehouse.name}</h3>
            <div className="flex flex-col gap-1 max-h-40 overflow-y-auto pr-1">
                {warehouse.items?.length ? (
                    warehouse.items.map((inventory) => (
                        <div
                            key={inventory.itemId ?? inventory.item?.id}
                            className="flex items-center justify-between text-sm text-slate-500"
                        >
                            <span className="truncate">{inventory.item?.name ?? inventory.itemId}</span>
                            <span className="font-medium text-slate-700 tabular-nums">{inventory.quantity}</span>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-slate-400 italic">No items stocked</p>
                )}
            </div>
        </div>
    );
}
