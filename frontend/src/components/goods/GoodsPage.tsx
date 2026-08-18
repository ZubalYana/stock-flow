import { useState, useEffect } from 'react';
import type { Item } from '../../types';
import { apiFetch } from '../../api/apiFetch';
import { useAuthStore } from '../../store/authStore';
import { useAlertStore } from '../../store/alertStore';
import CreateItem from './CreateItem';
import { Button } from '@mui/material';

export default function GoodsPage(){
    const [items, setItems] = useState<Item[]>([]);
    const [creationMode, setCreationMode] = useState<boolean>(false);
    const token = useAuthStore((state)=>(state.token))
    const addAlert = useAlertStore((state)=>(state.addAlert))

    async function fetchGoods(){
        try{
        const res = await apiFetch('/items', {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        const data = await res.json();
        console.log('data:', data)
        setItems(data.result)
    }catch(err){
        console.error(err)
        addAlert({severity: 'error', message: err.message})
    }
    }

    useEffect(()=>{
        fetchGoods();
    }, [])

    return(
        <div className="w-full">
            <div className='flex items-center gap-x-8'>
            <h3 className="text-[20px]">Goods list</h3>
            <Button onClick={()=>setCreationMode(true)}>Add new</Button>
            </div>

            {creationMode && (
                <div 
                className='fixed inset-0 bg-slate-800/40 flex items-center justify-center'
                onClick={()=>setCreationMode(false)}
                >
                <CreateItem 
                onClose={()=>setCreationMode(false)} 
                onSuccess={()=>addAlert({severity: 'success', message: 'Item added to stock.'})}
                />
                </div>
            )}
        </div>
    )
}