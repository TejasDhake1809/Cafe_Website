import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/user.js';
import productRoutes from './routes/product.js'
import mongoose from 'mongoose';
import paymentRoutes from './routes/payment.js';
import orderRoutes from './routes/order.js';
import { redis } from './lib/redis.js';

const app = express();
dotenv.config();
//database connection 
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Database is connected'))
.catch((err) => console.log('Database not connected', err))

app.use(express.json())
app.use(express.urlencoded({extended : false}));
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));

const port = process.env.PORT || 3000;

app.use('/', userRoutes)
app.use('/api', productRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/orders', orderRoutes)

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
