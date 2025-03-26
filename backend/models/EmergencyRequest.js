import mongoose from 'mongoose';

const emergencyRequestSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        location: {
          lat: { type: Number, required: true },
          lng: { type: Number, required: true },
        },
        issueDescription: { type: String, required: true },
        mechanicId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        priority: { type: String, enum: ["low", "medium", "high"], required: true },
        status: { type: String, enum: ["open", "resolved"], default: "open" },
    },
    { timestamps: true }
);

export const EmergencyRequest = mongoose.model('emergencyrequest', emergencyRequestSchema);