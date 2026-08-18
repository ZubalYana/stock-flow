interface CreateWarehouseProps{
    onClose: ()=>void;
    onSuccess: ()=>void;
}
import { useState } from "react";
import { X } from "lucide-react";
import { Input, Button } from "@mui/material";
import { apiFetch } from "../../api/apiFetch";
import { useAuthStore } from "../../store/authStore";
import { useAlertStore } from "../../store/alertStore";

export default function CreateWarehouse({onClose, onSuccess}: CreateWarehouseProps){
    const token = useAuthStore((state)=>(state.token))
    const addAlert = useAlertStore((state)=>(state.addAlert))
    const [warehouseName, setWarehouseName] = useState('')

    async function create(){
        try{
            const res = await apiFetch('/warehouses', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({name: warehouseName})
            })

            const data = await res.json()
            console.log(data);
            onSuccess();
            setWarehouseName('')
            onClose();
        }catch(err){
            console.log(err)
            addAlert({severity: 'error', message: 'Error creating warehouse.'})
        }
    }

    return(
        <div 
        className="w-50 lg:w-80 bg-[#f0f4f8] rounded-md shadow-md p-4 relative"
        onClick={(e)=>e.stopPropagation()}
        >
            <X className="absolute top-4 right-4 cursor-pointer" onClick={()=>onClose()}/>
            <h3>Create a new warehouse</h3>
            <Input type="text" className="w-full" placeholder="Item name" value={warehouseName} onChange={(e)=>setWarehouseName(e.target.value)}/>
            <Button onClick={()=>create()}>Create</Button>
        </div>
    )
}