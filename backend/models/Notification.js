import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    title: String,
    body: String,
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: String,
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

export const Notification = mongoose.model('notification', notificationSchema);