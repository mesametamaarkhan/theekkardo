import React, { useEffect, useState } from 'react';
import { Menu, User, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import NotificationPanel from './NotificationPanel';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        const loggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
        setIsLoggedIn(loggedIn);
    }, []);

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    return (
        <nav className="bg-white shadow-sm relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold text-blue-600">Theekkardo</Link>
                    </div>
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
                        <a href="#features" className="text-gray-700 hover:text-blue-600">Features</a>
                        {isLoggedIn ? (
                            <div className="flex items-center space-x-4 relative">
                                <div className="relative">
                                    <button onClick={toggleNotifications} className="relative flex items-center justify-center">
                                        <Bell className="w-6 h-6 text-gray-700 hover:text-blue-600" />
                                        {/* Red dot */}
                                        <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white"></span>
                                    </button>
                                    {showNotifications && <NotificationPanel />}
                                </div>
                                <Link to="/profile" className="text-gray-700 hover:text-blue-600">
                                    <User className="w-6 h-6" />
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
                                <Link
                                    to="/signup"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button className="text-gray-700">
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
