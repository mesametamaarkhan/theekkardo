import React from 'react';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4">Theekkardo</h3>
                        <p className="text-gray-400">Your trusted partner for vehicle assistance</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
                            <li><a href="#features" className="text-gray-400 hover:text-white">Features</a></li>
                            <li><Link to="/login" className="text-gray-400 hover:text-white">Login</Link></li>
                            <li><Link to="/signup" className="text-gray-400 hover:text-white">Sign Up</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Contact</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li>support@theekkardo.com</li>
                            <li>+1 (555) 123-4567</li>
                            <li>123 Main Street</li>
                            <li>New York, NY 10001</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Follow Us</h4>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white"><Facebook /></a>
                            <a href="#" className="text-gray-400 hover:text-white"><Twitter /></a>
                            <a href="#" className="text-gray-400 hover:text-white"><Instagram /></a>
                            <a href="#" className="text-gray-400 hover:text-white"><Linkedin /></a>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Theekkardo. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer;