import React from 'react';
import usePollingNotifications from '../hooks/usePollingNotifications'; // adjust path if needed

const NotificationPanel = () => {
    const notifications = usePollingNotifications(60000); // Poll every 60 seconds

    return (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50 overflow-hidden animate-fade-in">
            <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className="px-4 py-3 text-center text-gray-500">No new notifications</div>
                ) : (
                    notifications.map((notification) => (
                        <div key={notification.id} className="px-4 py-3 hover:bg-gray-100 transition">
                            <div className="text-sm font-semibold text-gray-800">
                                {notification.title}
                                {notification.unread && (
                                    <span className="ml-2 text-xs text-red-500">New</span>
                                )}
                            </div>
                            <div className="text-xs text-gray-500">{notification.time}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationPanel;
