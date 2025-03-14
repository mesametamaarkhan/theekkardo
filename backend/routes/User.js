import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import authenticateToken from '../middleware/AuthenticateToken.js';

dotenv.config();
const router = express.Router();

//route for user signup
router.post('/signup', async (req, res) => {
    if(!req.body.role || !req.body.email || !req.body.password || !req.body.fullName || !req.body.phone) {
        return res.status(400).json({ message: 'Some required fields are missing!!' });
    }

    const { role, email, password, fullName, phone } = req.body;

    try {
        const existingEmail = await User.findOne({ email });
        if(existingEmail) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            role,
            fullName,
            email,
            passwordHash,
            phone
        });

        await newUser.save();
        res.status(200).json({ message: 'User registration successful' });
    }
    catch(error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

//route for user login (generates auth token and stores in http-only cookie)
router.post('/login', async (req, res) => {
    if(!req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'Some required fields are missing' });
    }

    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if(!existingUser) {
            return res.status(404).json({ message: 'User doesnot exist.' });
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.passwordHash);
        if(!isPasswordValid) {
            return res.status(400).json({ message: 'Incorrect Password' });
        }

        const payload = {
            _id: existingUser._id,
            email: existingUser.email,
            role: existingUser.role
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        res.status(200).json({ message: 'Login Successful', user: { id: existingUser._id, email: existingUser.email, role: existingUser.role } })
    }
    catch(error) {
        res.status(500).json({ message: 'Server error', error });
    } 
});

//route for user logout (remove authToken from cookie)
router.post('/logout', async (req, res) => {
    res.clearCookie('authToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict'
    });
    res.status(200).json({ message: 'User logged out successfully' });
});

//change password
router.put('/change-password', authenticateToken, async (req, res) => {
    if(!req.body.currPassword || !req.body.newPassword) {
        return res.status(400).json({ message: 'Some required fields are missing' });
    }

    const { currPassword, newPassword } = req.body;
    const { email } = req.user;
    try {
        const existingUser = await User.findOne({ email });
        if(!existingUser) {
            return res.status(404).json({ message: 'User does not exist' });
        }

        const isPasswordValid = await bcrypt.compare(currPassword, existingUser.passwordHash);
        if(!isPasswordValid) {
            return res.status(400).json({ message: 'Current password is incorrect.'})
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, salt);

        existingUser.passwordHash = passwordHash;
        await existingUser.save();

        res.status(200).json({ message: 'Password changed successfully' });
    }
    catch(error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

//reset-password
router.put('/reset-password', authenticateToken, async (req, res) => {
    if(!req.body.newPassword) {
        return res.status(400).json({ message: "Some required fields are missing!" });
    }

    const { newPassword } = req.body;
    const { email } = req.user;

    try {
        const existingUser = await User.findOne({ email });
        if(!existingUser) {
            return res.status(404).json({ message: 'User does not exist' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, salt);

        existingUser.passwordHash = passwordHash;
        existingUser.save();
        res.status(200).json({ message: 'Password has been reset successfully' });
    }
    catch(error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

//update user profile
//add profile-picture
router.put('/update-profile-picture', authenticateToken,  async (req, res) => {

});

//update user-rating
router.put('/update-rating', authenticateToken, async (req, res) => {

});

//update user-location
router.put('/update-location', authenticateToken, async (req, res) => {

});

export default router;