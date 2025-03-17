import express from 'express';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { User } from '../models/User.js';
import authenticateToken from '../middleware/AuthenticateToken.js';

dotenv.config();
const router = express.Router();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

//generate otp
router.post('/generate', async (req, res) => {
    if(!req.body.email) {
        return res.status(400).json({ message: 'Email required' });
    }

    const { email } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if(!existingUser) {
            return res.status(404).json({ message: 'User does not exist' });
        }

        const otp = generateOTP();
        const expiryTime = Date.now() + 5 * 60 * 1000;

        await User.findOneAndUpdate(
            { email },
            { otp, otpExpiry: expiryTime },
            { new: true }
        );

        if(email) {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Your OTP Code',
                text: `Your OTP Code is: ${otp}. It expires in 5 minutes`
            });
        }

        res.status(200).json({ message: 'OTP sent successfully', otp }); //remove otp object for production
    }
    catch(error) {
        return res.status(500).json({ message: 'Server error', error });
    }
});

//verify otp
router.post('/verify', async (req, res) => {
    if(!req.body.otp || !req.body.email) {
        return res.status(400).json({ message: 'OTP is required!' });
    }

    const { otp, email } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if(!existingUser || !existingUser.otp || !existingUser.otpExpiry) {
            return res.status(400).json({ message: 'Invalid OTP request' });
        }

        if(Date.now() > existingUser.otpExpiry) {
            return res.status(400).json({ message: 'OTP has expired' });
        }

        if(existingUser.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        existingUser.otp = null;
        existingUser.otpExpiry = null;
        await existingUser.save();

        res.status(200).json({ message: 'OTP verified successfully' });
    }
    catch(error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

export default router;