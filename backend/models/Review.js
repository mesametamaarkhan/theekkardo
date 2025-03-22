import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        serviceRequestId: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceRequest", required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        mechanicId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        rating: { type: Number, min: 1, max: 5, required: true },
        review: { type: String },
    },
    { timestamps: true }
);

export const Review = mongoose.model('review', reviewSchema);