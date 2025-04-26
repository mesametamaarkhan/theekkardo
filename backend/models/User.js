import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        role: { type: String, enum: ["user", "mechanic", "admin"], required: true },
        fullName: { type: String, required: true },
        email: { type: String, unique: true, required: true },
        passwordHash: { type: String, required: true },
        phone: { type: String, required: true }, //needs to be unique too
        profileImage: { type: String },
        otp: { type: String},
        otpExpiry: { type: Date },
        fcmToken: { type: String },
        vehicles: [
        {
            make: String,
            model: String,
            year: Number,
            plateNumber: String,
        },
        ],
        status: { type: String, enum: ["online", "offline"], default: "offline" },
        rating: { type: Number, default: 0 },
        verified: { type: Boolean, default: false },
    },
    {
        timestamps: true
    }
);

export const User = mongoose.model('user', UserSchema); 