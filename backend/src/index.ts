import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import itemRouter from './features/items/itemRoutes'
import warehouseRouter from './features/warehouses/warehouseRoutes'
import transferRouter from './features/transfer/transferRoutes'
dotenv.config();

const PORT = process.env.PORT || 3000

const app = express();
app.use(express.json());
app.use(cors());
app.use('/items', itemRouter);
app.use('/warehouses', warehouseRouter);
app.use('/transfer', transferRouter);

app.listen(PORT, ()=>{
    console.log(`Express server running on: ${PORT}`)
})