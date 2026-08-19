import { useState, useEffect } from 'react';
import { useAlertStore } from '../../store/alertStore';
import { useAuthStore } from '../../store/authStore';
import { apiFetch } from '../../api/apiFetch';
import CreateWarehouse from './CreateWarehouse';
import EditWarehouse from './EditWarehouse';
import { Button } from '@mui/material';
import WarehouseCard from './WarehouseCard';
import useWarehouses from './useWarehouses';

export default function WarehousesPage() {
    const [creationMode, setCreationMode] = useState<boolean>(false);
    const [editingMode, setEditingMode] = useState<boolean>(false);
    const [editingWarehouse, setEditingWarehouse] = useState<{
        warehouseId: string;
        warehouseName: string;
    }>({ warehouseId: "", warehouseName: "" });
    const addAlert = useAlertStore((state) => state.addAlert);
    const token = useAuthStore((state) => state.token);
    const { warehouses, loading, error, refetch } = useWarehouses();

    useEffect(() => {
        if (error) addAlert({ severity: 'error', message: error });
    }, [error, addAlert]);

    async function onDelete(warehouseId: string, warehouseName: string) {
        try {
            const res = await apiFetch(`/warehouses/${warehouseId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            console.log(data);
            addAlert({
                severity: 'success',
                message: `${warehouseName} deleted succesfully`,
            });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            addAlert({ severity: 'error', message: message });
        }
    }

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-slate-800">Warehouses list</h3>
                <Button variant="contained" disableElevation onClick={() => setCreationMode(true)}>
                    Add new
                </Button>
            </div>

            {loading ? (
                <p className="text-sm text-slate-400">Loading warehouses...</p>
            ) : warehouses.length === 0 ? (
                <p className="text-sm text-slate-400">No warehouses yet — add your first one.</p>
            ) : (
                <div className="flex flex-wrap gap-4">
                    {warehouses.map((warehouse) => (
                        <WarehouseCard
                            warehouse={warehouse}
                            key={warehouse.id}
                            onDelete={(warehouseId, warehouseName) => {
                                onDelete(warehouseId, warehouseName)
                                refetch();
                            }}
                            onEdit={(warehouseId, warehouseName) => {
                                setEditingWarehouse({ warehouseId, warehouseName });
                                setEditingMode(true);
                            }}
                        />
                    ))}
                </div>
            )}

            {creationMode && (
                <div
                    className="fixed inset-0 bg-slate-800/40 flex items-center justify-center z-50"
                    onClick={() => setCreationMode(false)}
                >
                    <CreateWarehouse
                        onClose={() => setCreationMode(false)}
                        onSuccess={() => {
                            refetch();
                            addAlert({ severity: 'success', message: 'Warehouse created.' });
                        }}
                    />
                </div>
            )}

            {editingMode && (
                <div
                    className="fixed inset-0 bg-slate-800/40 flex items-center justify-center z-50"
                    onClick={() => setEditingMode(false)}
                >
                    <EditWarehouse
                        onClose={() => setEditingMode(false)}
                        onSuccess={() => {
                            refetch();
                            addAlert({ severity: 'success', message: 'Warehouse name edited.' });
                            setEditingWarehouse({ warehouseId: '', warehouseName: '' })
                        }}
                        warehouseId={editingWarehouse.warehouseId}
                        warehouseOldName={editingWarehouse.warehouseName}
                    />
                </div>
            )}
        </div>
    );
}
