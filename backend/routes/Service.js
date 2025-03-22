import express from 'express';
import dotenv from 'dotenv';
import multer from 'multer';
import cloudinary from '../config/cloudinaryConfig.js';
//other import go here
import authenticateToken from '../middleware/AuthenticateToken.js';
import { Service } from '../models/Service.js';

dotenv.config();
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

//admin only route
//posting services
router.post('/', authenticateToken, upload.single("image"), async (req, res) => {
    if (!req.body.name || !req.body.description || !req.body.basePrice || !req.file) {
        return res.status(400).json({ message: 'Some required fields are missing' });
    }

    const { name, description, basePrice } = req.body;

    try {
        const uploadToCloudinary = (fileBuffer) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'services' },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result.secure_url);
                    }
                );
                stream.end(fileBuffer);
            });
        };

        let imageUrl = await uploadToCloudinary(req.file.buffer);

        const newService = new Service({ name, description, basePrice, image: imageUrl });

        console.log(newService);
        await newService.save();

        res.status(200).json({ message: 'Service created successfully', service: newService });
    } catch (error) {
        console.error("❌ Server error:", error);
        res.status(500).json({ message: 'Server error', error });
    }
});


//get all services
router.get('/', async (req, res) => {
    try {
        const services = await Service.find();
        res.status(200).json({ services });
    }
    catch(error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

//get service by id
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if(!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.status(200).json({ service });
    }
    catch(error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

//update a service (no image update)
//make this admin only route
router.put('/:id', authenticateToken, async (req, res) => {
    if(!req.body.name || !req.body.description || !req.body.basePrice) {
        return res.status(400).json({ message: 'Some required fields are missing!' });
    }

    const { name, description, basePrice } = req.body; 
    const { id } = req.params;
    try {
        const updatedService = await Service.findByIdAndUpdate(id, { name, description, basePrice }, { new: true });
        if(!updatedService) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.status(200).json({ message: 'Service updated successfully', service: updatedService });
    }
    catch(error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

//delete a service
//make this admin only route
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const service = await Service.findByIdAndDelete(id);

        if(!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.status(200).json({ message: 'Service deleted successfully', service });
    }
    catch(error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

//upload image to service
//make this admin only route
router.put('/upload-image/:id', authenticateToken, upload.single('image'), async (req, res) => {
    const { id } = req.params;
    try {
        let imageUrl = null;
        if(req.file) {
            const result = await cloudinary.uploader.upload_stream(
                { folder: 'services' },
                (error, result) => {
                    if(error) {
                        return res.status(500).json({ message: 'Image upload failed', error });
                    }
                    imageUrl = result.secure_url;
                }
            ).end(req.file.buffer);
        }

        const service = await Service.findByIdAndUpdate(id, { image: imageUrl }, { new: true });
        if(!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        res.status(200).json({ message: 'Service image uploaded successfully', service });
    }
    catch(error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

export default router;