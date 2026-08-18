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
        if (error) {
            addAlert({ severity: 'error', message: error });
        }
    }, [error, addAlert]);

    if (loading) return <div>Warehouses loading...</div>;

    return (
        <div className="w-full">
            <div className='flex items-center gap-x-8'>
                <h3 className="text-[20px]">Warehouses list</h3>
                <Button onClick={() => setCreationMode(true)}>Add new</Button>
            </div>

            <div className='w-full flex flex-wrap gap-x-6 gap-y-4 mt-2'>
                {warehouses.map((warehouse) => (
                    <WarehouseCard warehouse={warehouse} key={warehouse.id} />
                ))}
            </div>

            {creationMode && (
                <div 
                    className='fixed inset-0 bg-slate-800/40 flex items-center justify-center'
                    onClick={() => setCreationMode(false)}
                >
                        <CreateWarehouse 
                            onClose={() => setCreationMode(false)} 
                            onSuccess={() => addAlert({ severity: 'success', message: 'Warehouse created.' })}
                        />
                </div>
            )}
        </div>
    );
}