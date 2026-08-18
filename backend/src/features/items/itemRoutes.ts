import { createItem, updateItem, deleteItem, getById, getAll } from "./itemController";
import {Router} from 'express';
import authMiddleware from "../../middleware/authMiddleware";
const router = Router()

router.post('/', authMiddleware, createItem)
router.get('/:itemId', authMiddleware, getById)
router.get('/', authMiddleware, getAll)
router.patch('/:itemId', authMiddleware, updateItem)
router.delete('/:itemId', authMiddleware, deleteItem)


export default router;