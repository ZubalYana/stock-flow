import { useState, useEffect } from 'react';
import type { Item } from '../../types';
import { apiFetch } from '../../api/apiFetch';
import { useAuthStore } from '../../store/authStore';
import { useAlertStore } from '../../store/alertStore';
import CreateItem from './CreateItem';
import { Button } from '@mui/material';
import ItemCard from './ItemCard';

export default function GoodsPage() {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [creationMode, setCreationMode] = useState<boolean>(false);
    const token = useAuthStore((state) => state.token);
    const addAlert = useAlertStore((state) => state.addAlert);

    async function fetchGoods() {
        try {
            setLoading(true);
            const res = await apiFetch('/items', {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setItems(data.result);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to load items.';
            addAlert({ severity: 'error', message });
        } finally {
            setLoading(false);
        }
    }

    async function onDelete(itemId: string, itemName: string){
        try{
            const res = await apiFetch(`/items/${itemId}`, {
                method: 'DELETE', 
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            const data = await res.json();
            console.log(data)
            addAlert({severity: 'success', message: `${itemName} deleted succesfully`})
        }catch(err){
            const message = err instanceof Error? err.message : 'Unknown error';
            addAlert({severity: 'error', message: message})
        }
    }

    useEffect(() => {
        fetchGoods();
    }, []);

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-slate-800">Goods list</h3>
                <Button variant="contained" disableElevation onClick={() => setCreationMode(true)}>
                    Add new
                </Button>
            </div>

            {loading ? (
                <p className="text-sm text-slate-400">Loading items...</p>
            ) : items.length === 0 ? (
                <p className="text-sm text-slate-400">No items yet — add your first one.</p>
            ) : (
                <div className="flex flex-wrap gap-4">
                    {items.map((item) => (
                        <ItemCard key={item.id} item={item} onDelete={(itemId, itemName)=>onDelete(itemId, itemName)} />
                    ))}
                </div>
            )}

            {creationMode && (
                <div
                    className="fixed inset-0 bg-slate-800/40 flex items-center justify-center z-50"
                    onClick={() => setCreationMode(false)}
                >
                    <CreateItem
                        onClose={() => setCreationMode(false)}
                        onSuccess={() => {
                            fetchGoods();
                            addAlert({ severity: 'success', message: 'Item added to stock.' });
                        }}
                    />
                </div>
            )}
        </div>
    );
}