import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Shield, Clock, AlertCircle } from 'lucide-react';

const LandingPage = () => {
    const features = [
        {
        icon: <Clock className="w-8 h-8 text-blue-500" />,
        title: "Real-time Tracking",
        description: "Track your mechanic's location and estimated arrival time in real-time"
        },
        {
        icon: <Shield className="w-8 h-8 text-blue-500" />,
        title: "Secure Payments",
        description: "Safe and secure payment processing for all services"
        },
        {
        icon: <MapPin className="w-8 h-8 text-blue-500" />,
        title: "Verified Mechanics",
        description: "All mechanics are verified and certified professionals"
        },
        {
        icon: <AlertCircle className="w-8 h-8 text-blue-500" />,
        title: "SOS Button",
        description: "24/7 emergency assistance with just one tap"
        }
    ];

    const testimonials = [
        {
        name: "John Doe",
        role: "Vehicle Owner",
        content: "Theekkardo saved me when my car broke down on the highway. Quick and professional service!",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
        },
        {
        name: "Jane Smith",
        role: "Mechanic Partner",
        content: "Being part of Theekkardo has helped me grow my business and connect with more customers.",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                Your Trusted Partner for Vehicle Assistance
                            </h1>
                            <p className="text-blue-100 text-lg mb-8">
                                Get instant access to verified mechanics and emergency services, anytime, anywhere.
                            </p>
                            <Link
                                to="/signup"
                                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                            >
                                Get Started
                            </Link>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="hidden md:block"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1000&q=80"
                                alt="Mechanic helping with car"
                                className="rounded-lg shadow-xl"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                        {
                            step: "1",
                            title: "Request Service",
                            description: "Select your location and describe your vehicle issue"
                        },
                        {
                            step: "2",
                            title: "Get Matched",
                            description: "We'll connect you with the nearest available mechanic"
                        },
                        {
                            step: "3",
                            title: "Problem Solved",
                            description: "Get your vehicle fixed and pay securely through the app"
                        }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2 }}
                                className="bg-white p-6 rounded-lg shadow-md text-center"
                            >
                                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                                <p className="text-gray-600">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Features</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white p-6 rounded-lg shadow-md text-center"
                            >
                                <div className="mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What Our Users Say</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2 }}
                                className="bg-white p-6 rounded-lg shadow-md"
                            >
                                <div className="flex items-center mb-4">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full mr-4"
                                    />
                                    <div>
                                        <h4 className="font-semibold">{testimonial.name}</h4>
                                        <p className="text-gray-600">{testimonial.role}</p>
                                    </div>
                                </div>
                                <p className="text-gray-700">{testimonial.content}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;