import { useState, useEffect } from 'react';
import type { Item } from '../../types';
import { apiFetch } from '../../api/apiFetch';

export default function GoodsPage(){
    const [items, setItems] = useState<Item[]>([]);

    useEffect(()=>{
        const res = apiFetch('/')
    })
    return(
        <div className="w-full">
            <h3 className="text-[20px]">All goods:</h3>
        </div>
    )
}