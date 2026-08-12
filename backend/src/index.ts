import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import itemRouter from './features/items/itemRoutes'
dotenv.config();

const PORT = process.env.PORT || 3000

const app = express();
app.use(express.json());
app.use(cors());
app.use('/items', itemRouter)

app.listen(PORT, ()=>{
    console.log(`Express server running on: ${PORT}`)
})