import mongoose from 'mongoose';

const trackingSchema = new mongoose.Schema(
    {
        serviceRequestId: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceRequest", required: true },
        mechanicId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        locations: [
            {
                timestamp: { type: Date, default: Date.now },
                lat: { type: Number, required: true },
                lng: { type: Number, required: true },
            },
        ],
        completed: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const Tracking = mongoose.model('tracking', trackingSchema);