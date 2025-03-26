import React, { useEffect, useState } from 'react';
import { Menu, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const loggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
        setIsLoggedIn(loggedIn);
    }, []);

    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold text-blue-600">Theekkardo</Link>
                    </div>
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
                        <a href="#features" className="text-gray-700 hover:text-blue-600">Features</a>
                        {isLoggedIn ? (
                            <Link to="/profile" className="text-gray-700 hover:text-blue-600">
                                <User className="w-6 h-6" />
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
                                <Link
                                    to="/signup"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                    <div className="md:hidden flex items-center">
                        <button className="text-gray-700">
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
};

export default Navbar;