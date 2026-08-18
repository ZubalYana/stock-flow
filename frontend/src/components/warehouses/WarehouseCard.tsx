import type { Warehouse } from "../../types";

interface WarehouseCardProps{
    warehouse: Warehouse;
}

export default function WarehouseCard({warehouse}: WarehouseCardProps){
    return(
        <div className="w-80 max-h-55 rounded-md bg-white shadow-sm p-4">
            <h3>{warehouse.name}</h3>
            {warehouse.items?.map((item)=>(
                <div>{item.itemId}</div>
            ))}
        </div>
    )
}