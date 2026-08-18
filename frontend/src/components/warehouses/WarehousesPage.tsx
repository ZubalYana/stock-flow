import { useState, useEffect } from 'react';
import type { Warehouse } from '../../types';
import { apiFetch } from '../../api/apiFetch';
import { useAuthStore } from '../../store/authStore';
import { useAlertStore } from '../../store/alertStore';
import CreateWarehouse from './CreateWarehouse';
import { Button } from '@mui/material';

export default function WarehousesPage(){
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [creationMode, setCreationMode] = useState<boolean>(false);
    const token = useAuthStore((state)=>(state.token))
    const addAlert = useAlertStore((state)=>(state.addAlert))

    async function fetchWarehouses(){
        const res = await apiFetch('/warehouses', {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        const data = await res.json();
        console.log('data:', data)
        setWarehouses(data.result)
    }

    useEffect(()=>{
        fetchWarehouses();
    }, [])

    return(
        <div className="w-full">
            <div className='flex items-center gap-x-8'>
            <h3 className="text-[20px]">Warehouses list</h3>
            <Button onClick={()=>setCreationMode(true)}>Add new</Button>
            </div>

            {creationMode && (
                <div 
                className='fixed inset-0 bg-slate-800/40 flex items-center justify-center'
                onClick={()=>setCreationMode(false)}
                >
                <CreateWarehouse 
                onClose={()=>setCreationMode(false)} 
                onSuccess={()=>addAlert({severity: 'success', message: 'Warehouse created.'})}
                />
                </div>
            )}
        </div>
    )
}