import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/user.js';
import productRoutes from './routes/product.js'
import mongoose from 'mongoose';
import paymentRoutes from './routes/payment.js';


const app = express();
dotenv.config();
//database connection 
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Database is connected'))
.catch((err) => console.log('Database not connected', err))

app.use(express.json())
app.use(express.urlencoded({extended : false}));
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

const port = 3000;

app.use('/', userRoutes)
app.use('/api', productRoutes)
app.use('/api/payment', paymentRoutes)

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
