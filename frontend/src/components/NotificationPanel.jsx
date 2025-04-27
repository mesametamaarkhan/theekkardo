import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NotificationPanel = ({ showNotifications }) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (showNotifications) {
            const fetchNotifications = async () => {
                try {
                    const response = await axios.get('http://localhost:5000/user/unread-notifications', { withCredentials: true });
                    setNotifications(response.data.notifications);
                } catch (error) {
                    console.error("Error fetching notifications", error);
                    setNotifications([]);
                }
            };

            fetchNotifications();
        }
    }, [showNotifications]);

    const handleNotificationClick = async (notificationId, linkToPage) => {
        try {
            await axios.put(`http://localhost:5000/user/notification/${notificationId}`, {}, { withCredentials: true });
            window.location.href = linkToPage;
        } catch (error) {
            console.error("Error marking notification as read", error);
        }
    };

    return (
        <div className="relative">
            {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50 overflow-hidden animate-fade-in">
                    <div className="max-h-72 overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <div
                                    key={notification._id}
                                    className="px-4 py-3 hover:bg-gray-100 transition cursor-pointer"
                                    onClick={() => handleNotificationClick(notification._id, notification.linkToPage)}
                                >
                                    <div className="text-sm font-semibold text-gray-800">{notification.title}</div>
                                    <div className="text-xs text-gray-500">{new Date(notification.createdAt).toLocaleString()}</div>
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-6 text-center text-gray-500">
                                No notifications right now.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationPanel;
