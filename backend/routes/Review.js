import express from 'express';
//other import go here
import authenticateToken from '../middleware/AuthenticateToken.js';
import { Review } from '../models/Review.js';

const router = express.Router();

//submit a review
router.post('/', authenticateToken, async (req, res) => {
    if(!req.body.serviceRequestId || !req.body.mechanicId || !req.body.rating || !req.body.review) {
        return res.status(400).json({ message: 'Some required fields are missing' });
    }

    const { serviceRequestId, mechanicId, rating, review } = req.body;
    const { _id } = req.user; 
    try {
        const newReview = new Review({
            serviceRequestId,
            userId: _id,
            mechanicId,
            rating,
            review
        });

        await newReview.save();
        res.status(200).json({ message: 'Review added successfully', newReview });
    }
    catch(error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

//get all reviews for a specific mechanic
router.get('/mechanic/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const reviews = await Review.find({ mechanicId: id })
            .populate({
                path: 'userId',
                model: 'user',
                select: 'fullName'
            });
        
        if(!reviews.length) {
            return res.status(404).json({ message: 'No reviews found' });
        }

        res.status(200).json({ reviews });
    }
    catch(error) {
        res.status(500).json({ message: 'Server error', error }); 
    }
});

//get all reviews made by a user
router.get('/user/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const reviews = await Review.find({ userId: id })
            .populate({
                path: 'mechanicId',
                model: 'user',
                select: 'fullName'
            });

        if(!reviews.length) {
            return res.status(404).json({ message: 'No reviews found' });
        }

        res.status(200).json({ reviews });
    } 
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

//get a review by its id
router.get('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const review = await Review.findById(id)
            .populate({
                path: 'userId',
                model: 'user',
                select: 'fullName'
            })
            .populate({
                path: 'mechanicId',
                model: 'user',
                select: 'fullName'
            });

        if(!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        res.status(200).json({ review });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

//delete a review
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const review = await Review.findById(id);
        if(!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        if(review.userId.toString() !== req.user._id) {
            return res.status(403).json({ message: 'Unauthorized to delete this review' });
        }

        await Review.findByIdAndDelete(id);
        res.status(200).json({ message: 'Review deleted successfully' });
    }
    catch(error) {
        res.status(500).json({ message: "Server error", error });
    }
});

export default router;