import admin from "../config/firebase.js";
import { Notification } from '../models/Notification.js';
import { User } from '../models/User.js';

export const notifyMechanicsAboutService = async (serviceDetails, userId) => {
    try {
        const mechanics = await User.find({ role: 'mechanic', fcmToken: { $ne: null } });
        const user = await User.findOne({ _id: userId });
        const title = "New Service Request";
        const body = `New service request from ${user.fullName} for ${serviceDetails.vehicle.make} ${serviceDetails.vehicle.model}.`;

        const payload = {
            notification: {
                title,
                body,
            },
            data: {
                click_action: "http://localhost:5137/mechanic/requests", // ✅ Put it inside `data`
                type: 'service_request',
                serviceId: serviceDetails._id.toString(),
            }
        };


        const tokens = mechanics.map(mechanic => mechanic.fcmToken);

        if (tokens.length) {
            const results = await Promise.all(
                tokens.map((token) => admin.messaging().send({ ...payload, token }))
            );
        };

        const notifications = mechanics.map(m => ({
            title, body, recipient: m._id, type: 'service_request'
        }));

        await Notification.insertMany(notifications);

    }
    catch (error) {
        console.error("Error notifying mechanics:", error);
    }
};

export const notifyUsersAboutBid = async (bidDetails, mechanicId) => {
    try {
        const users = await User.find({ role: 'user', fcmToken: { $ne: null } });
        const mechanic = await User.findOne({ _id: mechanicId });
        const title = "New Bid Received";
        const body = `New bid received from ${mechanic.fullName} for your service request.`;

        const payload = {
            notification: {
                title,
                body,
            },
            data: {
                click_action: `http://localhost:5137/bids/${bidDetails.serviceRequestId}`,
                type: 'bid_received',
                serviceId: bidDetails.serviceRequestId.toString(),
            }
        };

        const tokens = users.map(user => user.fcmToken);

        if (tokens.length) {
            const results = await Promise.all(
                tokens.map((token) => admin.messaging().send({ ...payload, token }))
            );
        };

        const notifications = users.map(user => ({
            title, body, recipient: user._id, type: 'bid_received'
        }));

        await Notification.insertMany(notifications);
    }
    catch (error) {
        console.error("Error notifying mechanics:", error);
    }
};

export const notifyMechanicAboutBidAcceptance = async (bidDetails, serviceRequestDetails) => {
    try {
        const mechanic = await User.findOne({ _id: serviceRequestDetails.mechanicId, fcmToken: { $ne: null } });

        const title = "New Bid Accepted";
        const body = `Your bid with service id: ${bidDetails.serviceRequestId} was accepted by the user.`;


        const payload = {
            notification: {
                title,
                body,
            },
            data: {
                click_action: `http://localhost:5137/mechanic/service/${serviceRequestDetails._id}`,
                type: 'bid_accepted',
                serviceId: serviceRequestDetails._id.toString(),
            }
        };

        const token = mechanic.fcmToken;

        if (token) {
            const result = await admin.messaging().send({ ...payload, token });
        }

        const notification = {
            title,
            body,
            recipient: mechanic._id,
            type: 'bid_accepted'
        };


        console.log('e');
        await Notification.insertOne(notification);
    }
    catch (error) {
        console.error("Error notifying mechanics:", error);
    }
};

