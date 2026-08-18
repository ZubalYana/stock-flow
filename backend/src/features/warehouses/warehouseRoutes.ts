import { Router } from "express";
import { createWarehouse, updateWarehouse, deleteWarehouse, getById, getAll } from "./warehouseController";
import authMiddleware from "../../middleware/authMiddleware";
const router = Router()

router.post('/', authMiddleware, createWarehouse);
router.patch('/:id', authMiddleware, updateWarehouse);
router.delete('/:id', authMiddleware, deleteWarehouse);
router.get('/:id', authMiddleware, getById);
router.get('/', authMiddleware, getAll);

export default router;