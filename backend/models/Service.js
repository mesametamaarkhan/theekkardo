import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        basePrice: { type: Number, required: true },
        image: { type: String },
    },
    { timestamps: true }
);

export const Service = mongoose.model('service', serviceSchema);