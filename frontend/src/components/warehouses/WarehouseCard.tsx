import type { Warehouse } from "../../types";

interface WarehouseCardProps {
    warehouse: Warehouse;
}

export default function WarehouseCard({ warehouse }: WarehouseCardProps) {
    console.log('warehouse:', warehouse)
    return (
        <div className="w-full sm:w-80 bg-white shadow-sm rounded-xl p-4 hover:shadow-md transition-shadow">
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