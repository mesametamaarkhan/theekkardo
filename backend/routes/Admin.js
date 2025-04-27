import express from 'express';
import authenticateToken from '../middleware/AuthenticateToken.js';
import { User } from '../models/User.js';
import { ServiceRequest } from '../models/ServiceRequest.js';

const router = express.Router();

//get all users
router.get('/users', authenticateToken, async (req, res) => {
    try {
        const users = await User.find().select('-passwordHash -profileImage -otp -otpExpiry -fcmToken -vehicles');
        if (!users) {
            return res.status(404).json({ message: "No users found" });
        }

        res.status(200).json({ users});
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

//get count of service requests
router.get('/service-requests', authenticateToken, async (req, res) => {
    try {
        const totalRequests = await ServiceRequest.countDocuments();
        const pendingRequests = await ServiceRequest.countDocuments({ status: 'pending' });
        const completedRequests = await ServiceRequest.countDocuments({ status: 'completed' });
        const cancelledRequests = await ServiceRequest.countDocuments({ status: 'cancelled' });
        const inProgressRequests = await ServiceRequest.countDocuments({ status: 'in-progress' });
        const serviceRequests = {
            total: totalRequests,
            pending: pendingRequests,
            completed: completedRequests,
            cancelled: cancelledRequests,
            inProgress: inProgressRequests
        };
        res.status(200).json({ serviceRequests });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});


export default router;