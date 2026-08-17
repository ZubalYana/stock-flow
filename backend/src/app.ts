import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import itemRouter from './features/items/itemRoutes'
import warehouseRouter from './features/warehouses/warehouseRoutes'
import transferRouter from './features/transfer/transferRoutes'
import authRouter from './features/auth/authRoutes';

export const app = express();
app.use(express.json());
app.use(cors());
app.use('/items', itemRouter);
app.use('/warehouses', warehouseRouter);
app.use('/transfer', transferRouter);
app.use('/auth', authRouter);