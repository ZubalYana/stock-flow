import { itemService } from "./itemService";
import type { Request, Response } from "express";
import { ItemSchema } from "./itemSchema";
import { InventorySchema } from "../inventory/inventorySchema";
import type { InventoryDTO } from "../inventory/inventorySchema";

export async function createItem(req: Request, res: Response) {
    try {
        const itemResult = ItemSchema.safeParse({ name: req.body.itemName });
        if (!itemResult.success) {
            return res.status(400).json({ error: itemResult.error.message });
        }

        if (!Array.isArray(req.body.inventories) || req.body.inventories.length === 0) {
            return res.status(400).json({ error: 'inventories array is required' });
        }

        const inventories: InventoryDTO[] = [];
        for (const inv of req.body.inventories) {
            const inventoryResult = InventorySchema.safeParse(inv);
            if (!inventoryResult.success) {
                return res.status(400).json({ error: inventoryResult.error.message });
            }
            inventories.push(inventoryResult.data);
        }

        const result = await itemService.create(itemResult.data, inventories);
        res.status(201).json({ result });
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error while creating an item';
        res.status(500).json({ error: message });
    }
}

export async function updateItem(req: Request, res: Response) {
    try{
        const itemId = req.params.itemId as string;
        if(!itemId) return { error: 'Item id not found '}
        const data = req.body;
        const itemResult = ItemSchema.safeParse(data);
        if(!itemResult.success){
            return res.status(400).json({error: 'Wrong data format'});
        }
        const result = await itemService.update(itemId, itemResult.data)
        return res.status(200).json({result})
    }catch(err){
        const message = err instanceof Error? err.message : 'Unknown error';
        return res.status(500).json({error: message});
    }
}

export async function deleteItem(req: Request, res: Response) {
    try{
        const itemId = req.params.itemId as string;
        if(!itemId) return { error: 'Item id not found '}
        const result = await itemService.delete(itemId);
        return res.status(200).json({result});
    }catch(err){
        const message = err instanceof Error? err.message : 'Unknown error';
        return res.status(500).json({error: message})
    }
}

export async function getById(req: Request, res: Response){
    try{
        const itemId = req.params.itemId as string;
        if(!itemId) return { error: 'Item id not found'}
        const result = await itemService.getById(itemId);
        return res.status(200).json({result})
    }catch(err){
        const message = err instanceof Error? err.message : 'Unknown error';
        return res.status(500).json({error: message})
    }
}

export async function getAll(req: Request, res: Response){
    try{
        const result = await itemService.getAll();
        return res.status(200).json({result})
    }catch(err){
        const message = err instanceof Error? err.message : 'Unknown error';
        return res.status(500).json({error: message});
    }
}