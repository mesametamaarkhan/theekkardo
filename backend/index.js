import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { AdminRoutes, UserRoutes, OTPRoutes, ServiceRoutes, EmergencyRequestRoutes, PaymentRoutes, ReviewRoutes, ServiceRequestRoutes, TrackingRoutes } from './routes/index.js';

dotenv.config();
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',  // <-- allow deployed frontend
    credentials: true                         // <-- allow cookies
}));

app.use('/admin', AdminRoutes);
app.use('/user', UserRoutes);
app.use('/otp', OTPRoutes);
app.use('/service', ServiceRoutes);
app.use('/emergency', EmergencyRequestRoutes);
app.use('/payment', PaymentRoutes);
app.use('/review', ReviewRoutes);
app.use('/service-request', ServiceRequestRoutes);
app.use('./tracking', TrackingRoutes);


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