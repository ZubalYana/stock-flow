import { Router } from "express";
import { createWarehouse, updateWarehouse, deleteWarehouse, getById, getAll } from "./warehouseController";
const router = Router()

router.post('/', createWarehouse);
router.patch('/:id', updateWarehouse);
router.delete('/:id', deleteWarehouse);
router.get('/:id', getById);
router.get('/', getAll);

export default router;