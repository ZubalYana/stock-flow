import type { Item } from "../../types";

interface ItemProps {
    item: Item;
}

export default function ItemCard({ item }: ItemProps) {
    return (
        <div className="w-full sm:w-72 bg-white shadow-sm rounded-xl p-4 hover:shadow-md transition-shadow">
            <h2 className="font-medium text-slate-800 mb-2 truncate">{item.name}</h2>
            <div className="flex flex-col gap-1">
                {item.stock?.length ? (
                    item.stock.map((inventory) => (
                        <div
                            key={inventory.warehouseId}
                            className="flex items-center justify-between text-sm text-slate-500"
                        >
                            <span className="truncate">{inventory.warehouse?.name ?? 'Unknown warehouse'}</span>
                            <span className="font-medium text-slate-700 tabular-nums">{inventory.quantity}</span>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-slate-400 italic">No stock recorded</p>
                )}
            </div>
        </div>
    );
}