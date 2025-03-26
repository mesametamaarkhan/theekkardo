import mongoose from "mongoose";

const bidSchema = new mongoose.Schema(
    {
        serviceRequestId: { type: mongoose.Schema.Types.ObjectId, ref: "servicerequest", required: true },
        mechanicId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
        bidAmount: { type: Number, required: true },
        message: { type: String }, // Optional message from mechanic
        status: { 
            type: String, 
            enum: ["pending", "accepted", "rejected"], 
            default: "pending" 
        },
    },
    { timestamps: true }
);

export const Bid = mongoose.model("Bid", bidSchema);
