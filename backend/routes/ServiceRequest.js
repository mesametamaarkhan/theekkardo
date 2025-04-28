import express from 'express';
import authenticateToken from '../middleware/AuthenticateToken.js';
import { notifyMechanicsAboutService, notifyUsersAboutBid, notifyMechanicAboutBidAcceptance, notifyUserAboutServiceStart, notifyUserAboutServiceCompletion } from '../services/NotificationService.js';
import { ServiceRequest } from '../models/ServiceRequest.js';
import { Bid } from '../models/Bid.js';

const router = express.Router();

//creating a service request
router.post('/', authenticateToken, async (req, res) => {
    if(!req.body.serviceId || !req.body.vehicle || !req.body.location || !req.body.issueDescription || !req.body.preferredTime) {
        return res.status(400).json({ message: 'Some required fields are missing!' });
    }

    const { serviceId, vehicle, location, issueDescription, preferredTime } = req.body;
    try {
        const serviceRequest = new ServiceRequest({
            serviceId,
            userId: req.user._id,
            vehicle,
            location,
            issueDescription,
            preferredTime,
        });
        
        await serviceRequest.save();
        await notifyMechanicsAboutService(serviceRequest, req.user._id);
        res.status(200).json({ message: 'Service request created successfully', serviceRequest });
    }
    catch(error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error });
    }
});

//get all service requests
router.get('/', authenticateToken, async (req, res) => {
    try {
        const serviceRequests = await ServiceRequest.find({ status: 'pending' })
            .sort({ createdAt: -1 }); 
        res.status(200).json({ serviceRequests });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

//get all service requests by a mechanic (mechanic only route)
//LIMIT info here because it will be displayed as a list (todo)
router.get('/mechanic-requests', authenticateToken, async (req, res) =>{
    const { _id } = req.user; 
    try {
        const serviceRequests = await ServiceRequest.find({ mechanicId: _id});
        
        if(!serviceRequests) {
            return res.status(404).json({ message: 'Service requests not found' });
        }

        res.status(200).json({ serviceRequests });
    }
    catch(error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

//get all service requests by a user (user only route)
//LIMIT info here because it will be displayed as a list (todo)
router.get('/user-requests', authenticateToken, async (req, res) => {
    const { _id } = req.user;
    try {
        const serviceRequests = await ServiceRequest.find({ userId: _id});
        
        if(!serviceRequests) {
            return res.status(404).json({ message: 'Service requests not found' });
        }

        res.status(200).json({ serviceRequests });
    }
    catch(error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

//get a single service by id (complete information)
router.get('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const serviceRequest = await ServiceRequest.findById(id)
            .populate({
                path: 'userId',
                select: "fullName email phone rating verified profileImage",
            })
            .populate({
                path: 'mechanicId',
                select: "fullName email phone rating verified profileImage",
            })
            .populate('serviceId')

            if(!serviceRequest) {
                return res.status(404).json({ message: 'Service request not found' });
            }

            res.status(200).json({ serviceRequest });
    }
    catch(error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

//update status
router.put('/update-status/:id', authenticateToken, async (req, res) => {
    if(!req.body.status) {
        return res.status(400).json({ message: 'Some required fields are missing!' });
    }

    const { status } = req.body;
    const { id } = req.params;
    try {
        const updatedServiceRequest = await ServiceRequest.findByIdAndUpdate(id, { status }, { new: true });

        if(!updatedServiceRequest) {
            return res.status(404).json({ message: 'Service request not found!' });
        }

        if(status === 'completed') {
            await notifyUserAboutServiceCompletion(updatedServiceRequest);
        }
        else if(status === 'in-progress') {
            await notifyUserAboutServiceStart(updatedServiceRequest);
        }

        res.status(200).json({ message: 'Service request updated', serviceRequest: updatedServiceRequest });
    }
    catch(error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error });
    } 
});

//mechanics place-bids
router.post('/place-bid', authenticateToken, async (req, res) => {
    if(!req.body.serviceRequestId || !req.body.bidAmount || !req.body.message) {
        return res.status(400).json({ message: 'Some required fields are missing' });
    }

    const { serviceRequestId, bidAmount, message } = req.body;
    const { _id } = req.user;
    try {
        const serviceRequest = await ServiceRequest.findById(serviceRequestId);

        if(!serviceRequest) {
            return res.status(404).json({ message: 'Service request not found' });
        }

        const bid = new Bid({
            serviceRequestId,
            mechanicId: _id,
            bidAmount,
            message
        });

        await bid.save();
        await notifyUsersAboutBid(bid, _id);
        res.status(200).json({ message: 'Bid placed successfully', bid });
    }
    catch(error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

//get all bids for a particular service request
router.get('/bids/:serviceRequestId', authenticateToken, async (req, res) => {
    const { serviceRequestId } = req.params;
    try {
        const serviceRequest = await ServiceRequest.findById(serviceRequestId)
            .populate('serviceId')
            .populate({
                path: 'mechanicId',
                model: 'user',
                select: 'fullName rating profileImage verified'
            });
        if(!serviceRequest) {
            return res.status(404).json({ message: 'Service Request not found' });
        }

        const bids = await Bid.find({ serviceRequestId })
            .populate({
                path: 'mechanicId',
                model: 'user',
                select: 'fullName rating profileImage verified'
            });
        
        res.status(200).json({ bids, serviceRequest });
    }
    catch(error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error });
    }
});

//user accepts bid
router.put('/accept-bid/:bidId', authenticateToken, async (req, res) => {
    const { bidId } = req.params;
    try {
        const bid = await Bid.findById(bidId)
            .populate({
                path: 'serviceRequestId',
                model: 'servicerequest'
            });

        if(!bid) {
            return res.status(404).json({ message: 'Bid not found' });
        }

        const serviceRequest = await ServiceRequest.findById(bid.serviceRequestId);
        if(!serviceRequest) {
            return res.status(404).json({ message: 'Service request not found' });
        }

        serviceRequest.mechanicId = bid.mechanicId;
        serviceRequest.finalPrice = bid.bidAmount;
        serviceRequest.status = 'accepted';
        await serviceRequest.save();

        bid.status = 'accepted';
        await bid.save();

        await Bid.updateMany(
            { serviceRequestId: bid.serviceRequestId, _id: { $ne: bid._id } },
            { $set: { status: "rejected" } }
        );

        await notifyMechanicAboutBidAcceptance(bid, serviceRequest);
        res.status(200).json({ message: "Bid accepted successfully", bid, serviceRequest });
    }
    catch(error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

//create new emergency request
router.post('/emergency', authenticateToken, async (req, res) => {
    if (!req.body.serviceId || !req.body.vehicle || !req.body.location || !req.body.issueDescription) {
        return res.status(400).json({ message: 'Some required fields are missing!' });
    }

    const { serviceId, vehicle, location, issueDescription } = req.body;

    try {
        const emergencyRequest = new ServiceRequest({
            serviceId,
            userId: req.user._id,
            vehicle,
            location,
            issueDescription,
            preferredTime: new Date(), // immediate
            isEmergency: true,
            status: 'pending',
        });

        await emergencyRequest.save();

        res.status(200).json({ message: 'Emergency service request created successfully', emergencyRequest });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
});

//get all emergency requests
router.get('/emergency/all', authenticateToken, async (req, res) => {
    try {
        const emergencyRequests = await ServiceRequest.find({ isEmergency: true })
            .populate('serviceId')
            .populate('userId', 'fullName phone location')
            .populate('mechanicId', 'fullName phone');

        res.status(200).json({ emergencyRequests });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
});

//get emergency requests with status pending
router.get('/emergency/pending', authenticateToken, async (req, res) => {
    try {
        const emergencyRequests = await ServiceRequest.find({
            isEmergency: true,
            status: 'pending',
        })
        .populate('serviceId')
        .populate('userId', 'fullName phone location');

        res.status(200).json({ emergencyRequests });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
});

export default router;