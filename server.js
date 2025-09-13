import express from 'express';
import dotenv from 'dotenv';
import Routes from './routers/index.js';
import cors from 'cors';


const app = express();
dotenv.config();
app.use(cors());//cho phép tất cả các nguồn truy cập vào API từ phía client
app.use(express.json());

Routes(app);//dường dẫn all router

const PORT = process.env.port || 3000;

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
})