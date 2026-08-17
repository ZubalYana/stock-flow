import { transfer } from "./transferController";
import { Router } from "express";
const router = Router()

router.post('/', transfer);

export default router;