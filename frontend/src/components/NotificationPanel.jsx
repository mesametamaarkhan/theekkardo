import React from 'react';

const notifications = [
    { id: 1, title: "Your order has been shipped!", time: "2 hours ago" },
    { id: 2, title: "New message from support.", time: "5 hours ago" },
    { id: 3, title: "Your subscription is expiring soon.", time: "1 day ago" },
    { id: 4, title: "Special offer just for you!", time: "2 days ago" },
    { id: 5, title: "Security alert: New login detected.", time: "3 days ago" },
];

const NotificationPanel = () => {
    return (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50 overflow-hidden animate-fade-in">
            <div className="max-h-72 overflow-y-auto">
                {notifications.map((notification) => (
                    <div key={notification.id} className="px-4 py-3 hover:bg-gray-100 transition">
                        <div className="text-sm font-semibold text-gray-800">{notification.title}</div>
                        <div className="text-xs text-gray-500">{notification.time}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotificationPanel;
