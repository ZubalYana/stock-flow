interface CreateItemProps{
    onClose: ()=>void;
    onSuccess: ()=>void;
}
import { useState } from "react";
import { X } from "lucide-react";
import { Input, Button } from "@mui/material";
import { apiFetch } from "../../api/apiFetch";
import { useAuthStore } from "../../store/authStore";
import { useAlertStore } from "../../store/alertStore";
import useWarehouses from "../../hooks/useWarehouses";
import type { Inventory } from "../../types";

export default function CreateItem({onClose, onSuccess}: CreateItemProps){
    const token = useAuthStore((state)=>(state.token))
    const addAlert = useAlertStore((state)=>(state.addAlert))
    const { warehouses, loading, error } = useWarehouses();
    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const [itemName, setItemName] = useState('')

    function handleQuantityChange(warehouseId: string, value: string) {
    const num = value === '' ? 0 : Number(value);
    setQuantities((prev) => ({ ...prev, [warehouseId]: num }));
}

    async function create() {
    if (!itemName.trim()) {
        addAlert({ severity: 'error', message: 'Item name is required.' });
        return;
    }

    const inventories: Inventory[] = warehouses
        .map((w) => ({ warehouseId: w.id, quantity: quantities[w.id] ?? 0 }))
        .filter((inv) => inv.quantity > 0);

    if (inventories.length === 0) {
        addAlert({ severity: 'error', message: 'Add quantity to at least one warehouse.' });
        return;
    }

    try {
        const res = await apiFetch('/items', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ itemName, inventories }),
        });

        const data = await res.json();
        console.log(data)
        onSuccess();
        setItemName('');
        setQuantities({});
        onClose();
    } catch (err) {
        addAlert({ severity: 'error', message: 'Error creating the item.' });
    }
}

    return (
    <div
        className="w-[90vw] max-w-md bg-white rounded-2xl shadow-xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
    >
        <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors"
        >
            <X size={20} />
        </button>

        <h3 className="text-lg font-semibold text-slate-800 mb-5">Create a new item</h3>

        <div className="flex flex-col gap-4">
            <Input
                type="text"
                placeholder="Item name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                fullWidth
                size="small"
            />

            {loading && <p className="text-sm text-slate-400">Loading warehouses...</p>}
            {error && <p className="text-sm text-red-500">Failed to load warehouses.</p>}

            {warehouses.length > 0 && (
                <div className="flex flex-col gap-3 max-h-56 overflow-y-auto pr-1">
                    {warehouses.map((warehouse) => (
                        <div key={warehouse.id} className="flex items-center justify-between gap-3">
                            <span className="text-sm text-slate-600 truncate">{warehouse.name}</span>
<Input
    type="number"
    size="small"
    className="w-24"
    placeholder="0"
    value={quantities[warehouse.id] ?? ''}
    inputProps={{ min: 0 }} 
    onKeyDown={(e) => {
        if (e.key === '-' || e.key === 'e') {
            e.preventDefault();
        }
    }}
    onChange={(e) => handleQuantityChange(warehouse.id, e.target.value)}
/>
                        </div>
                    ))}
                </div>
            )}
        </div>

        <div className="flex justify-end gap-2 mt-6">
            <Button onClick={onClose} color="inherit">
                Cancel
            </Button>
            <Button onClick={create} variant="contained" disableElevation>
                Create
            </Button>
        </div>
    </div>
);
}