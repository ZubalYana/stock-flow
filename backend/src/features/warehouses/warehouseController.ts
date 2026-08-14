import { warehouseService } from "./warehouseService";
import type { Request, Response } from "express";

export async function createWarehouse(req: Request, res: Response){
    try{
    const result = await warehouseService.create({name: req.body.name})
    if('error' in result) return res.status(400).json(result);
    res.status(201).json(result)
    }catch(err){
        const message = err instanceof Error? err.message : 'Unknown error';
        return res.status(500).json({error: message})
    }
}

export async function updateWarehouse(req: Request, res: Response){
    try{
    const warehouseId = req.params.id as string;
    const result = await warehouseService.update(warehouseId, {name: req.body.name});
    if('error' in result) return res.status(400).json(result);
    res.status(200).json(result);
        }catch(err){
        const message = err instanceof Error? err.message : 'Unknown error';
        return res.status(500).json({error: message})
    }
}

export async function deleteWarehouse(req: Request, res: Response){
    try{
    const warehouseId = req.params.id as string;
    const result = await warehouseService.delete(warehouseId);
    if('error' in result) return res.status(400).json(result);
    res.status(200).json(result)
        }catch(err){
        const message = err instanceof Error? err.message : 'Unknown error';
        return res.status(500).json({error: message})
    }
}

export async function getById(req: Request, res: Response){
    try{
    const warehouseId = req.params.id as string;
    const result = await warehouseService.getById(warehouseId);
    if (result === null) return res.status(404).json({ error: 'Warehouse not found' });
    if('error' in result) return res.status(400).json(result);
    res.status(200).json(result)
    }catch(err){
        const message = err instanceof Error? err.message : 'Unknown error';
        return res.status(500).json({error: message})
    }
}

export async function getAll(req: Request, res: Response){
    try{
    const result = await warehouseService.getAll();
    if('error' in result) return res.status(400).json(result);
    res.status(200).json(result);
        }catch(err){
        const message = err instanceof Error? err.message : 'Unknown error';
        return res.status(500).json({error: message})
    }
}