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
        
        const verified = false;
        if(role === "user" || role === "admin" ) {
            verified = true;
        }

        const newUser = new User({
            role,
            fullName,
            email,
            passwordHash,
            phone,
            verified
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

//get user profile
router.get('/profile', authenticateToken, async (req, res) => {
    const { email } = req.user;

    try {
        const user = await User.findOne({ email }).select('-passwordHash -createdAt -updatedAt -otp -otpExpiry');
        if(!user) {
            return res.status(404).json({ message: 'User does not exist' });
        }

        res.status(200).json({ user });
    }   
    catch(error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

//update user profile
router.put('/update-profile', authenticateToken, async (req, res) => {
    if(!req.body.fullName || !req.body.phone) {
        return res.status(400).json({ message: 'Some required fields are missing' });
    }

    const { fullName, phone } = req.body;
    const { email } = req.user;
    
    try {
        const existingUser = await User.findOne({ email });
        if(!existingUser) {
            return res.status(404).json({ message: 'User does not exist' });
        }

        if(phone && phone !== existingUser.phone) {
            const phoneExists = await User.findOne({ phone });
            if(phoneExists) {
                return res.status(400).json({ message: 'Phone number already in use' });
            }
        }

        if(fullName) {
            existingUser.fullName = fullName;
        }

        if(phone) {
            existingUser.phone = phone;
        }

        await existingUser.save();
        res.status(200).json({ message: 'Profile updated successfully', user: {
            fullName: existingUser.fullName,
            profileImage: existingUser.profileImage,
            email: existingUser.email,
            phone: existingUser.phone,
            role: existingUser.role,
            status: existingUser.status,
            rating: existingUser.rating,
            verified: existingUser.verified
        }});
    }
    catch(error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

//update user vehicles
router.put('/update-vehicles', authenticateToken, async (req, res) => {
    if(!req.body.vehicles) {
        return res.status(400).json({ message: 'Some required fields are missing!' });
    }

    const { vehicles } = req.body;
    const { email } = req.user;

    try {
        const existingUser = await User.findOneAndUpdate({ email }, { $set: { vehicles } }, { new: true }).select('-passwordHash -createdAt -updatedAt -otp -otpExpiry');
        if(!existingUser) {
            return res.status(404).json({ message: 'User does not exist!' });
        }

        res.status(200).json({ message: 'Vehicles updated', user: existingUser });
    }
    catch(error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

//add profile-picture
router.put('/update-profile-picture', authenticateToken,  async (req, res) => {
    if(!req.body.profileImage) {
        return res.status(400).json({ message: 'Some required fields are missing!' });
    }

    const { profileImage } = req.body;
    const { email } = req.user;

    try {
        const existingUser = await User.findOneAndUpdate({ email }, { $set: { profileImage } }, { new: true }).select('-passwordHash -createdAt -updatedAt -otp -otpExpiry');
        if(!existingUser) {
            return res.status(404).json({ message: 'User does not exist!' });
        }

        res.status(200).json({ message: 'Profile Picture updated', user: existingUser });
    }
    catch(error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

//TODO: update user-rating
router.put('/update-rating/:mechanicId', authenticateToken, async (req, res) => {
    //get all ratings for a specific mechanic from review model
    //calculate avg rating
    //update mechanic being reviewed
});

//update mechanic verification status
//make this an admin only route 
router.put('/verify-mechanic/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const mechanic = await User.findByIdAndUpdate(id, { $set: { verified: true }}, { new: true }).select('-passwordHash -createdAt -updatedAt -otp -otpExpiry');
        if(!mechanic) {
            return res.status(404).json({ message: 'Mechanic does not exist' });
        }

        res.status(200).json({ message: 'Mechanic verified successfully', mechanic });
    }   
    catch(error) {
        res.status(500).json({ message: 'Server error', error });
    }
});


export default router;