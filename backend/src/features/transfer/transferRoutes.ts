import { transfer } from "./transferController";
import { Router } from "express";
import authMiddleware from "../../middleware/authMiddleware";
const router = Router()

router.post('/', authMiddleware, transfer);

export default router;