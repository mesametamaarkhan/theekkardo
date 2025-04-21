import mongoose from 'mongoose';

const serviceRequestSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
        mechanicId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "service", required: true },
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
        finalPrice: { type: Number },
        isEmergency: { type: Boolean, default: false },
        priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    },
    { timestamps: true }
);

export const ServiceRequest = mongoose.model('servicerequest', serviceRequestSchema);