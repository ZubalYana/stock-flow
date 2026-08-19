interface EditWarehouseProps {
  onClose: () => void;
  onSuccess: () => void;
  warehouseId: string;
  warehouseOldName: string;
}
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Input, Button } from "@mui/material";
import { apiFetch } from "../../api/apiFetch";
import { useAuthStore } from "../../store/authStore";
import { useAlertStore } from "../../store/alertStore";

export default function EditWarehouse({ onClose, onSuccess, warehouseId, warehouseOldName }: EditWarehouseProps) {
  const token = useAuthStore((state) => state.token);
  const addAlert = useAlertStore((state) => state.addAlert);
  const [warehouseName, setWarehouseName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setWarehouseName(warehouseOldName)
  }, [])

  async function edit() {
    try {
      setLoading(true)
      const res = await apiFetch(`/warehouses/${warehouseId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: warehouseName })
      })
      const data = res.json();
      console.log(data)
      onSuccess()
      setWarehouseName('')
      setError('')
      onClose()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message)
      addAlert({ severity: 'error', message: message })
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="w-[90vw] max-w-md bg-white rounded-2xl shadow-xl p-6 relative"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors"
      >
        <X size={20} />
      </button>

      <h3 className="text-lg font-semibold text-slate-800 mb-5">
        Editing {warehouseOldName}
      </h3>

      <div className="flex flex-col gap-4">
        <Input
          type="text"
          placeholder="Warehouse name"
          value={warehouseName}
          onChange={(e) => setWarehouseName(e.target.value)}
          fullWidth
          size="small"
        />

        {error && (
          <p className="text-sm text-red-500">An error occured: {error}.</p>
        )}

      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={edit} variant="contained" disableElevation loading={loading}>
          Confirm changes
        </Button>
      </div>
    </div>
  );
}
