import { createItem, updateItem, deleteItem, getById, getAll } from "./itemController";
import {Router} from 'express';
const router = Router()

router.post('/', createItem)
router.get('/:itemId', getById)
router.get('/', getAll)
router.patch('/:itemId', updateItem)
router.delete('/:itemId', deleteItem)


export default router;