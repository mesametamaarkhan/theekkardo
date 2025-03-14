import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        role: { type: String, enum: ["user", "mechanic", "admin"], required: true },
        fullName: { type: String, required: true },
        email: { type: String, unique: true, required: true },
        passwordHash: { type: String, required: true },
        phone: { type: String, required: true },
        profileImage: { type: String },
        location: {
            lat: { type: Number },
            lng: { type: Number },
        },
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