import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import multer from 'multer';
import cloudinary from '../config/cloudinaryConfig.js';
import authenticateToken from '../middleware/AuthenticateToken.js';
import { User } from '../models/User.js';
import { Notification } from '../models/Notification.js';

dotenv.config();
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

//route for user signup
router.post('/signup', async (req, res) => {
    if (!req.body.role || !req.body.email || !req.body.password || !req.body.fullName || !req.body.phone) {
        return res.status(400).json({ message: 'Some required fields are missing!!' });
    }



    const { role, email, password, fullName, phone } = req.body;

    try {
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        let verified = false;
        if (role === "user" || role === "admin") {
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
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

//route for user login (generates auth token and stores in http-only cookie)
router.post('/login', async (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'Some required fields are missing' });
    }

    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: 'User does not exist.' });
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.passwordHash);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Incorrect Password' });
        }

        const payload = {
            _id: existingUser._id,
            email: existingUser.email,
            role: existingUser.role
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('authToken', token, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === "production" ? true : false,
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({ message: 'Login Successful', user: { id: existingUser._id, email: existingUser.email, role: existingUser.role } })
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

//route for user logout (remove authToken from cookie)
router.post('/logout', async (req, res) => {
    res.clearCookie('authToken', {
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' ? true : false,
        sameSite: 'Strict',
    });
    res.status(200).json({ message: 'User logged out successfully' });
});

//change password
router.put('/change-password', authenticateToken, async (req, res) => {
    if (!req.body.currPassword || !req.body.newPassword) {
        return res.status(400).json({ message: 'Some required fields are missing' });
    }

    const { currPassword, newPassword } = req.body;
    const { email } = req.user;
    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: 'User does not exist' });
        }

        const isPasswordValid = await bcrypt.compare(currPassword, existingUser.passwordHash);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Current password is incorrect.' })
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, salt);

        existingUser.passwordHash = passwordHash;
        await existingUser.save();

        res.status(200).json({ message: 'Password changed successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

//reset-password
router.put('/reset-password', async (req, res) => {
    if (!req.body.newPassword || !req.body.email) {
        return res.status(400).json({ message: "Some required fields are missing!" });
    }

    const { email, newPassword } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: 'User does not exist' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, salt);

        existingUser.passwordHash = passwordHash;
        existingUser.save();
        res.status(200).json({ message: 'Password has been reset successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

//get user profile
router.get('/profile', authenticateToken, async (req, res) => {
    const { email } = req.user;

    try {
        const user = await User.findOne({ email }).select('-passwordHash -createdAt -updatedAt -otp -otpExpiry');
        if (!user) {
            return res.status(404).json({ message: 'User does not exist' });
        }

        res.status(200).json({ user });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

//update user profile
router.put('/update-profile', authenticateToken, async (req, res) => {
    if (!req.body.fullName || !req.body.phone) {
        console.log(req.body);
        return res.status(400).json({ message: 'Some required fields are missing' });
    }

    const { fullName, phone } = req.body;
    const { email } = req.user;

    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: 'User does not exist' });
        }

        if (phone && phone !== existingUser.phone) {
            const phoneExists = await User.findOne({ phone });
            if (phoneExists) {
                return res.status(400).json({ message: 'Phone number already in use' });
            }
        }

        if (fullName) {
            existingUser.fullName = fullName;
        }

        if (phone) {
            existingUser.phone = phone;
        }

        await existingUser.save();
        res.status(200).json({
            message: 'Profile updated successfully', user: {
                fullName: existingUser.fullName,
                profileImage: existingUser.profileImage,
                email: existingUser.email,
                phone: existingUser.phone,
                role: existingUser.role,
                status: existingUser.status,
                rating: existingUser.rating,
                verified: existingUser.verified
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

//update user vehicles
router.put('/update-vehicles', authenticateToken, async (req, res) => {
    if (!req.body.vehicles) {
        return res.status(400).json({ message: 'Some required fields are missing!' });
    }

    const { vehicles } = req.body;
    const { email } = req.user;

    try {
        const existingUser = await User.findOneAndUpdate({ email }, { $set: { vehicles } }, { new: true }).select('-passwordHash -createdAt -updatedAt -otp -otpExpiry');
        if (!existingUser) {
            return res.status(404).json({ message: 'User does not exist!' });
        }

        res.status(200).json({ message: 'Vehicles updated', user: existingUser });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

//remove user vehicle
router.put('/remove-vehicle', authenticateToken, async (req, res) => {
    const { id } = req.body;
    const { email } = req.user;

    try {
        const existingUser = await User.findOneAndUpdate({ email }, { $pull: { vehicles: { _id: id } } }, { new: true }).select('-passwordHash -createdAt -updatedAt -otp -otpExpiry');

        if (!existingUser) {
            return res.status(404).json({ message: 'User does not exist!' });
        }

        res.status(200).json({ message: 'Vehicle removed successfully', user: existingUser });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

//add profile-picture
router.put('/update-profile-picture', authenticateToken, upload.single('profileImage'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: 'profile_pictures' },
                (error, result) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(result);
                    }
                }
            );
            stream.end(req.file.buffer);
        });

        const updatedUser = await User.findOneAndUpdate({ email: req.user.email }, { profileImage: result.secure_url }, { new: true }).select('-passwordHash -createdAt -updatedAt -otp -otpExpiry');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Profile image updated', user: updatedUser });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

//update mechanic verification status
//make this an admin only route 
router.put('/verify-mechanic/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const mechanic = await User.findByIdAndUpdate(id, { $set: { verified: true } }, { new: true }).select('-passwordHash -createdAt -updatedAt -otp -otpExpiry');
        if (!mechanic) {
            return res.status(404).json({ message: 'Mechanic does not exist' });
        }

        res.status(200).json({ message: 'Mechanic verified successfully', mechanic });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

//create fcm token
router.post("/token", authenticateToken, async (req, res) => {
    const { fcmToken } = req.body;
    const { _id } = req.user;
  
    if (!_id || !fcmToken) {
        return res.status(400).json({ message: "userId and fcmToken are required" });
    }
  
    try {
        const user = await User.findByIdAndUpdate(
            _id,
            { fcmToken },
            { new: true }
        );
    
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "FCM token updated successfully" });
    } 
    catch (err) {
        console.error("Error saving FCM token:", err);
        res.status(500).json({ message: "Server error" });
    }
});

//update notification status to read
router.put('/notification/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { _id } = req.user;

    try {
        const notification = await Notification.findOneAndUpdate({ _id: id, recipientId: _id }, { isRead: true }, { new: true });
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.status(200).json({ message: 'Notification status updated to read', notification });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

//get unread notifications
router.get('/unread-notifications', authenticateToken, async (req,res) => {
    const { _id } = req.user;
    
    try {
        const notifications = await Notification.find({ recipientId: _id, isRead: false }).sort({ createdAt: -1 });
        if (!notifications) {
            return res.status(404).json({ message: 'No unread notifications found' });
        }

        res.status(200).json({ notifications });
    }
    catch(error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

export default router;