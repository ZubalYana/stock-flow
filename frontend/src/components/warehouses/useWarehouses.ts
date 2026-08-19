import { useState, useEffect } from 'react';
import { apiFetch } from "../../api/apiFetch";
import { useAuthStore } from "../../store/authStore";
import type { Warehouse } from '../../types';

export default function useWarehouses() {
    const token = useAuthStore((state) => state.token);
    
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchWarehouses() {
            setLoading(true);
            try {
                const res = await apiFetch('/warehouses', {
                    method: 'GET',
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                const data = await res.json();
                setWarehouses(data);
                console.log('warehouses data:', data)
                setError(null);
            } catch (err: any) {
                console.error(err);
                setError(err.message || 'Error fetching warehouses');
            } finally {
                setLoading(false);
            }
        }

        if (token) {
            fetchWarehouses();
        }
    }, [token]); 

    return { warehouses, loading, error };
}