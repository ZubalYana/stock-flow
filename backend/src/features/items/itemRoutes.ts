import { createItem } from "./itemController";
import {Router} from 'express';
const router = Router()

router.post('/', createItem)

export default router;