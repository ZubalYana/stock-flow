import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3000

const app = express();
app.use(express.json());
app.use(cors());

app.listen(PORT, ()=>{
    console.log(`Express server running on: ${PORT}`)
})