import admin from "../config/firebase.js";
import { Notification } from '../models/Notification.js';
import { User } from '../models/User.js';

export async function notifyMechanicsAboutService(serviceDetails) {
    try {
        const mechanics = await User.find({ role: 'mechanic', fcmToken: { $ne: null } });
        const title = "New Service Request";
        const body = `New service request from ${serviceDetails.userName} for ${serviceDetails.vehicleMake} ${serviceDetails.vehicleModel}.`;

        const payload = {
            notification: { title, body },
            data: {
                type: 'service_request',
                serviceId: serviceDetails._id.toString(),
            }
        };

        const tokens = mechanics.map(mechanic => mechanic.fcmToken);

        if(tokens.length) {
            // await admin.messaging().sendMulticast({
            //     tokens,
            //     notification: payload.notification,
            //     data: payload.data,
            // });
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

