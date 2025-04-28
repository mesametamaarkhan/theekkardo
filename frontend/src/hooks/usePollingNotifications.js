import { useState, useEffect } from 'react';
import axios from 'axios';

const usePollingNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    
    const fetchNotifications = async () => {
        try {
            const response = await axios.get('${API_BASE_URL}/unread-notifications'); // adjust API route as needed
            setNotifications(response.data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000); 

        return () => clearInterval(interval);
    }, []);

    return notifications;
};

export default usePollingNotifications;
