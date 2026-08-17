import { transferService } from "./transferService";
import type { Request, Response } from "express";

export const transfer = async (req: Request, res: Response) => {
  try {
    const { warehouseA_id, warehouseB_id, itemId, amount } = req.body;
    if (!warehouseA_id || !warehouseB_id || !itemId || !amount) {
      return res.status(400).json({ message: "Lacking required credentials" });
    }
    const data = {
        warehouseA_id,
        warehouseB_id, 
        itemId, 
        amount
    }
    const result = await transferService.transfer(data);
    if('error' in result){
        return res.status(400).json(result)
    }
    res.status(200).json(result);
  } catch (err) {
    const message = err instanceof Error? err.message : 'Unknown error'
    res.status(500).json({message: message});
  }
};
