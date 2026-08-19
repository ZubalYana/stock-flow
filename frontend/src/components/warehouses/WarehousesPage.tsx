import { useState, useEffect } from 'react';
import { useAlertStore } from '../../store/alertStore';
import CreateWarehouse from './CreateWarehouse';
import { Button } from '@mui/material';
import WarehouseCard from './WarehouseCard';
import useWarehouses from './useWarehouses';

export default function WarehousesPage() {
    const [creationMode, setCreationMode] = useState<boolean>(false);
    const addAlert = useAlertStore((state) => state.addAlert);
    const { warehouses, loading, error } = useWarehouses();

    useEffect(() => {
        if (error) addAlert({ severity: 'error', message: error });
    }, [error, addAlert]);

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
                        <WarehouseCard warehouse={warehouse} key={warehouse.id} />
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
                            // refetch();
                            addAlert({ severity: 'success', message: 'Warehouse created.' });
                        }}
                    />
                </div>
            )}
        </div>
    );
}