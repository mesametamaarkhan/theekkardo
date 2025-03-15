import mongoose from 'mongoose';

const serviceRequestSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        mechanicId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
        vehicle: {
            make: String,
            model: String,
            year: Number,
            plateNumber: String,
        },
        location: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true },
        },
        issueDescription: { type: String, required: true },
        preferredTime: { type: Date, required: true },
        status: {
            type: String,
            enum: ["pending", "accepted", "in-progress", "completed", "canceled"],
            default: "pending",
        },
        estimatedPrice: { type: Number, required: true },
        finalPrice: { type: Number },
    },
    { timestamps: true }
);

export const ServiceRequest = mongoose.model('servicerequest', serviceRequestSchema);