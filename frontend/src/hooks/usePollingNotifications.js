import { useState, useEffect } from 'react';
import axios from 'axios';

const usePollingNotifications = (interval = 60000) => {
  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('/api/unread-notifications');
        const newNotifications = response.data.map(notification => ({
          ...notification,
          unread: true 
        }));
        
        // Merge new notifications with existing ones
        setNotifications((prevNotifications) => [
          ...prevNotifications.filter((n) => !newNotifications.some((newN) => newN.id === n.id)),
          ...newNotifications
        ]);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    // Fetch notifications initially
    fetchNotifications();
    
    // Poll every `interval` milliseconds (e.g., 60000ms = 1 minute)
    const intervalId = setInterval(fetchNotifications, interval);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [interval]);

  return notifications;
};

export default usePollingNotifications;
