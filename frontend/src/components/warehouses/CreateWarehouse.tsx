interface CreateWarehouseProps {
  onClose: () => void;
  onSuccess: () => void;
}
import { useState } from "react";
import { X } from "lucide-react";
import { Input, Button } from "@mui/material";
import { apiFetch } from "../../api/apiFetch";
import { useAuthStore } from "../../store/authStore";
import { useAlertStore } from "../../store/alertStore";

export default function CreateWarehouse({ onClose, onSuccess }: CreateWarehouseProps) {
  const token = useAuthStore((state) => state.token);
  const addAlert = useAlertStore((state) => state.addAlert);
  const [warehouseName, setWarehouseName] = useState("");
  const [loading, setLoading] = useState(false);

  async function create() {
    if (!warehouseName.trim()) {
      addAlert({ severity: "error", message: "Warehouse name is required." });
      return;
    }

    try {
      setLoading(true);
      const res = await apiFetch("/warehouses", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: warehouseName }),
      });

      const data = await res.json();
      console.log(data);
      onSuccess();
      setWarehouseName("");
      onClose();
    } catch (err) {
      console.log(err);
      addAlert({ severity: "error", message: "Error creating warehouse." });
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
        Create a new warehouse
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
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={create} variant="contained" disableElevation loading={loading}>
          Create
        </Button>
      </div>
    </div>
  );
}