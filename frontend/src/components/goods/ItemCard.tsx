import type { Item } from "../../types";
import { Trash2, Pencil, ArrowLeftRight } from "lucide-react";

interface ItemProps {
  item: Item;
  onDelete: (itemId: string, itemName: string) => void;
  onEdit: (itemId: string, itemName: string) => void;
  onTransfer: (item: Item) => void;
}

export default function ItemCard({ item, onDelete, onEdit, onTransfer }: ItemProps) {
  return (
    <div className="w-full sm:w-72 bg-white shadow-sm rounded-xl p-4 hover:shadow-md transition-shadow relative">
      <div className="absolute top-4 right-4 flex gap-x-2 items-center">
        <ArrowLeftRight
        size={18}
        className="text-slate-800 cursor-pointer "
          onClick={() => onTransfer(item)}
        />
        <Pencil
          size={18}
          className="text-slate-600 cursor-pointer "
          onClick={() => onEdit(item.id, item.name)}
        />
        <Trash2
          size={18}
          className="text-red-800 cursor-pointer "
          onClick={() => onDelete(item.id, item.name)}
        />
      </div>
      <h2 className="font-medium text-slate-800 mb-2 truncate">{item.name}</h2>
      <div className="flex flex-col gap-1">
        {item.stock?.length ? (
          item.stock.map((inventory) => (
            <div
              key={inventory.warehouseId}
              className="flex items-center justify-between text-sm text-slate-500"
            >
              <span className="truncate">
                {inventory.warehouse?.name ?? "Unknown warehouse"}
              </span>
              <span className="font-medium text-slate-700 tabular-nums">
                {inventory.quantity}
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-400 italic">No stock recorded</p>
        )}
      </div>
    </div>
  );
}
