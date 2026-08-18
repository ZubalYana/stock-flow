import { useState, useEffect } from 'react';
import type { Item } from '../../types';
import { apiFetch } from '../../api/apiFetch';
import { useAuthStore } from '../../store/authStore';

export default function GoodsPage(){
    const [items, setItems] = useState<Item[]>([]);
    const token = useAuthStore((state)=>(state.token))

    async function fetchGoods(){
        const res = await apiFetch('/items', {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        const data = await res.json();
        console.log('data:', data)
        setItems(data.result)
    }

    useEffect(()=>{
        fetchGoods();
    }, [])

    return(
        <div className="w-full">
            <h3 className="text-[20px]">All goods:</h3>
        </div>
    )
}