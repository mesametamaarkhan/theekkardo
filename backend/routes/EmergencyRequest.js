import express from 'express';
import dotenv from 'dotenv';
//other import go here
import authenticateToken from '../middleware/AuthenticateToken.js';
import { EmergencyRequest } from '../models/EmergencyRequest.js';

const router = express.Router();

//create an emergency request
router.post('/', authenticateToken, async (req, res) => {
    if(!req.body.userId || !req.body.location || !req.body.issueDescription || !req.body.priority) {
        return res.status(400).json({ message: 'Some required fields are missing!!' });
    }

    const { userId, location, issueDescription, priority } = req.body;
    try {
        const eRequest = new EmergencyRequest({
            userId, 
            location,
            issueDescription,
            priority
        });

        await eRequest.save();
        res.status(200).json({ message: 'Emergency Request created successfully', eRequest });
    } 
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

//get all emergency requests
router.get('/', authenticateToken, async (req, res) => {
    try {
        const eRequests = await EmergencyRequest.find();
        res.status(200).json({ eRequests });
    } 
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }

});

//get emergency request by id
router.get('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const eRequest = await EmergencyRequest.findById(id);
        if(!eRequest) {
            return res.status(404).json({ message: 'Emergency Request does not exist!!' });
        }   

        res.status(200).json({ eRequest });
    } 
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

//get emergency requests by status
router.get('/status/:status', authenticateToken, async (req, res) => {
    const { status } = req.params;

    try {
        const eRequests = await EmergencyRequest.find({ status });
        if(!eRequests) {
            return res.status(404).json({ message: `No ${status} requests found!` });
        }    

        res.status(200).json({ eRequests });
    } 
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

//update status of an emergency request
router.put('/update-status/:id', authenticateToken, async (req, res) => {
    if(!req.body.status) {
        res.status(400).json({ message: 'Some required fields are missing!!' });
    }

    const { status } = req.body;
    const { id } = req.params;
    
    try {
        const eRequest = await EmergencyRequest.findByIdAndUpdate(id, { status }, { new: true });
        if(!eRequest) {
            return res.status(404).json({ message: 'Request not found!!' });
        }    

        res.status(200).json({ message: 'Request status updated successfully', eRequest });
    } 
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

//assign-mechanic to emergency request
router.put('/assign-mechanic/:id', authenticateToken, async (req, res) => {
    if(!req.body.mechanicId) {
        return res.status(400).json({ message: 'Some required fields are missing!!' });
    }

    const { mechanicId } = req.body;
    const { id } = req.params;

    try {
        const eRequest = await EmergencyRequest.findByIdAndUpdate(id, { mechanicId }, { new: true });
        if (!eRequest) {
            return res.status(404).json({ message: "Request not found" });
        }

        res.status(200).json({ message: "Mechanic assigned", eRequest });
    } 
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

export default router;