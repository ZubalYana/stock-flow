import { Register, Login, FindByEmail } from "./authController.js";
import { Router } from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
const router = Router();

router.post('/register', async (req, res)=>{
    const result = await Register(req.body);
    if('error' in result){
        res.status(400).json(result);
        return;
    }
    res.status(201).json(result);
})

router.post('/login', async (req,res)=>{
    const result = await Login(req.body);
    if('error' in result){
        res.status(400).json(result);
        return
    }
    res.status(200).json(result);
})

router.get('/user', authMiddleware, async (req,res)=>{
    const email = req.user?.email;
    if(!email){
        res.status(401).json({message: 'Unauthorized'})
        return
    }
    const result = await FindByEmail(email);

    if('error' in result){
        res.status(400).json(result)
        return
    }
    res.status(200).json(result)
})

export default router;