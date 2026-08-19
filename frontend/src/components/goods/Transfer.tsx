import type { Item } from "../../types";
import { useState, useMemo } from "react";
import { X } from "lucide-react";
import {
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
} from "@mui/material";
import { apiFetch } from "../../api/apiFetch";
import { useAuthStore } from "../../store/authStore";
import { useAlertStore } from "../../store/alertStore";
import type { Warehouse } from "../../types";
import useWarehouses from "../warehouses/useWarehouses";

interface TransferItemProps {
  onClose: () => void;
  onSuccess: () => void;
  item: Item;
}

export default function Transfer({ onClose, onSuccess, item }: TransferItemProps) {
  const token = useAuthStore((state) => state.token);
  const addAlert = useAlertStore((state) => state.addAlert);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fromWarehouseId, setFromWarehouseId] = useState("");
  const [toWarehouseId, setToWarehouseId] = useState("");
  const [quantity, setQuantity] = useState<number>(0);
  const { warehouses } = useWarehouses();

  const availableAtSource = useMemo(() => {
    return item.stock.find((s) => s.warehouseId === fromWarehouseId)?.quantity ?? 0;
  }, [item.stock, fromWarehouseId]);

  const isValid =
    fromWarehouseId !== "" &&
    toWarehouseId !== "" &&
    fromWarehouseId !== toWarehouseId &&
    quantity > 0 &&
    quantity <= availableAtSource;

  async function transfer() {
    try {
      setLoading(true);
      setError("");
      const data = {
        warehouseA_id: fromWarehouseId,
        warehouseB_id: toWarehouseId,
        itemId: item.id,
        amount: quantity,
      };
      const res = await apiFetch("/transfer", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      console.log(result)
      onSuccess();
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      addAlert({ severity: "error", message });
      setError(message);
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
        Transfer {item.name}
      </h3>

      <div className="flex flex-col gap-4">
        <FormControl fullWidth size="small">
          <InputLabel id="from-warehouse-label">From warehouse</InputLabel>
          <Select
            labelId="from-warehouse-label"
            label="From warehouse"
            value={fromWarehouseId}
            onChange={(e) => setFromWarehouseId(e.target.value)}
          >
            {warehouses.map((warehouse: Warehouse) => (
              <MenuItem key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {fromWarehouseId && (
          <p className="text-xs text-slate-500">
            Available at source: {availableAtSource}
          </p>
        )}

        <FormControl fullWidth size="small">
          <InputLabel id="to-warehouse-label">To warehouse</InputLabel>
          <Select
            labelId="to-warehouse-label"
            label="To warehouse"
            value={toWarehouseId}
            onChange={(e) => setToWarehouseId(e.target.value)}
          >
            {warehouses
              .filter((w: Warehouse) => w.id !== fromWarehouseId)
              .map((warehouse: Warehouse) => (
                <MenuItem key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <TextField
          type="number"
          size="small"
          label="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />

        {error && (
          <p className="text-sm text-red-500">An error occured: {error}.</p>
        )}
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={transfer}
          variant="contained"
          disableElevation
          loading={loading}
          disabled={!isValid}
        >
          Transfer
        </Button>
      </div>
    </div>
  );
}