import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        mechanicId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        serviceRequestId: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceRequest", required: true },
        amount: { type: Number, required: true },
        paymentMethod: { type: String, enum: ["card", "cash", "wallet"], required: true },
        transactionId: { type: String, required: true },
        status: { type: String, enum: ["pending", "successful", "failed"], default: "pending" },
    },
    { timestamps: true }
);

export const Payment = mongoose.model('payment', paymentSchema);