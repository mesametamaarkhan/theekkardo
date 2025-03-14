import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { UserRoutes, OTPRoutes } from './routes/index.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

app.use('/user', UserRoutes);
app.use('/otp', OTPRoutes);


app.get('/', (req, res) => {
    console.log('Welcome to our homepage');
    return res.status(200).json({ message: "Welcome to TheekKarDo!"});
});

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB Connected');
        app.listen(process.env.PORT, () => {
            console.log(`App is listening to port ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.log(error.message);
    });