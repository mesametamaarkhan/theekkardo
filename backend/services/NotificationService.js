import admin from "../config/firebase.js";
import { Notification } from '../models/Notification.js';
import { User } from '../models/User.js';

export const notifyMechanicsAboutService = async (serviceDetails, userId) => {
    try {
        const mechanics = await User.find({ role: 'mechanic', fcmToken: { $ne: null } });
        const user = await User.findOne({ _id: userId });

        const title = `Service Request from ${user.fullName}`;
        const body = `New service request for ${serviceDetails.vehicle.make} ${serviceDetails.vehicle.model} posted by ${user.fullName}.`;

        const payload = {
            notification: { title, body },
            data: {
                click_action: "https://theekkardo.onrender.com/mechanic/requests",
                type: 'service_request',
                serviceId: serviceDetails._id.toString(),
            }
        };

        const tokens = mechanics.map(mechanic => mechanic.fcmToken);

        if (tokens.length) {
            await Promise.all(
                tokens.map((token) => admin.messaging().send({ ...payload, token }))
            );
        }

        const notifications = mechanics.map(m => ({
            title,
            body,
            recipientId: m._id,
            type: 'service_request',
            linkToPage: "https://theekkardo.onrender.com/mechanic/requests"
        }));

        await Notification.insertMany(notifications);

    } catch (error) {
        console.error("Error notifying mechanics:", error);
    }
};

export const notifyUsersAboutBid = async (bidDetails, mechanicId) => {
    try {
        const users = await User.find({ role: 'user', fcmToken: { $ne: null } });
        const mechanic = await User.findOne({ _id: mechanicId });

        const title = `Bid from ${mechanic.fullName} Received`;
        const body = `You have received a new bid from ${mechanic.fullName} for your service request.`;

        const payload = {
            notification: { title, body },
            data: {
                click_action: `https://theekkardo.onrender.com/bids/${bidDetails.serviceRequestId}`,
                type: 'bid_received',
                serviceId: bidDetails.serviceRequestId.toString(),
            }
        };

        const tokens = users.map(user => user.fcmToken);

        if (tokens.length) {
            await Promise.all(
                tokens.map((token) => admin.messaging().send({ ...payload, token }))
            );
        }

        const notifications = users.map(user => ({
            title,
            body,
            recipientId: user._id,
            type: 'bid_received',
            linkToPage: `https://theekkardo.onrender.com/bids/${bidDetails.serviceRequestId}`
        }));

        await Notification.insertMany(notifications);

    } catch (error) {
        console.error("Error notifying users:", error);
    }
};

export const notifyMechanicAboutBidAcceptance = async (bidDetails, serviceRequestDetails) => {
    try {
        const mechanic = await User.findOne({ _id: serviceRequestDetails.mechanicId, fcmToken: { $ne: null } });

        const title = `Bid Accepted for Service Request #${serviceRequestDetails._id}`;
        const body = `Your bid for service request #${serviceRequestDetails._id} has been accepted by the user.`;

        const payload = {
            notification: { title, body },
            data: {
                click_action: `https://theekkardo.onrender.com/mechanic/service/${serviceRequestDetails._id}`,
                type: 'bid_accepted',
                serviceId: serviceRequestDetails._id.toString(),
            }
        };

        const token = mechanic.fcmToken;

        if (token) {
            await admin.messaging().send({ ...payload, token });
        }

        const notification = {
            title,
            body,
            recipientId: mechanic._id,
            type: 'bid_accepted',
            linkToPage: `https://theekkardo.onrender.com/mechanic/service/${serviceRequestDetails._id}`
        };

        await Notification.insertOne(notification);

    } catch (error) {
        console.error("Error notifying mechanic:", error);
    }
};

export const notifyUserAboutServiceStart = async (serviceRequestDetails) => {
    try {
        const user = await User.findOne({ _id: serviceRequestDetails.userId, fcmToken: { $ne: null } });

        if (!user) return;

        const title = `Your Service Has Started`;
        const body = `The service for your ${serviceRequestDetails.vehicle.make} ${serviceRequestDetails.vehicle.model} has officially started.`;

        const payload = {
            notification: { title, body },
            data: {
                click_action: `https://theekkardo.onrender.com/service/${serviceRequestDetails._id}`,
                type: 'service_started',
                serviceId: serviceRequestDetails._id.toString(),
            }
        };

        const token = user.fcmToken;

        if (token) {
            await admin.messaging().send({ ...payload, token });
        }

        const notification = {
            title,
            body,
            recipientId: user._id,
            type: 'service_started',
            linkToPage: `https://theekkardo.onrender.com/service/${serviceRequestDetails._id}`
        };

        await Notification.insertOne(notification);

    } catch (error) {
        console.error("Error notifying user about service start:", error);
    }
};

export const notifyUserAboutServiceCompletion = async (serviceRequestDetails) => {
    try {
        const user = await User.findOne({ _id: serviceRequestDetails.userId, fcmToken: { $ne: null } });

        if (!user) return;

        const title = `Your Service Is Complete`;
        const body = `The service for your ${serviceRequestDetails.vehicle.make} ${serviceRequestDetails.vehicle.model} has been completed. Please review the service.`;

        const payload = {
            notification: { title, body },
            data: {
                click_action: `https://theekkardo.onrender.com/user/service/${serviceRequestDetails._id}`,
                type: 'service_completed',
                serviceId: serviceRequestDetails._id.toString(),
            }
        };

        const token = user.fcmToken;

        if (token) {
            await admin.messaging().send({ ...payload, token });
        }

        const notification = {
            title,
            body,
            recipientId: user._id,
            type: 'service_completed',
            linkToPage: `https://theekkardo.onrender.com/user/service/${serviceRequestDetails._id}`
        };

        await Notification.insertOne(notification);

    } catch (error) {
        console.error("Error notifying user about service completion:", error);
    }
};