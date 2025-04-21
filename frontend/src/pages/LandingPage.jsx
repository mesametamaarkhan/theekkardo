import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { MapPin, Shield, Clock, AlertCircle, X, Calendar, Loader2 } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [services, setServices] = useState([]);
    const [showServiceModal, setShowServiceModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [userLocation, setUserLocation] = useState('');
    const [loading, setLoading] = useState(false);
    const [serviceRequest, setServiceRequest] = useState({
        make: '',
        model: '',
        year: new Date().getFullYear(),
        plateNumber: '',
        issueDescription: '',
        preferredTime: '',
    });
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

    useEffect(() => {
        const loggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
        setIsLoggedIn(loggedIn);

        const getServices = () => {
            axios.get('http://localhost:5000/service')
                .then(response => {
                    setServices(response.data.services);
                })
                .catch(error => {
                    toast.error('Error fetching services');
                    window.location.href('/login');
                });
        };

        getServices();
        console.log(services);
    }, []);

    const handleServiceRequest = (service) => {
        if (!isLoggedIn) {
            toast.error('Please login to request a service');
            return;
        }
        setSelectedService(service);
        setShowServiceModal(true);
        // Get user's location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation(`${position.coords.latitude}, ${position.coords.longitude}`);
                },
                () => {
                    toast.error('Unable to get your location. Please enter it manually.');
                }
            );
        }
    };

    const handleSubmitRequest = async (e) => {
        e.preventDefault();

        if (!userLocation) {
            toast.error('Please allow location access or enter your location manually');
            return;
        }

        setLoading(true);
        try {
            const [lat, lng] = userLocation.split(',').map(coord => parseFloat(coord.trim()));

            const response = await axios.post('http://localhost:5000/service-request/', {
                serviceId: selectedService._id,
                vehicle: {
                    make: serviceRequest.make,
                    model: serviceRequest.model,
                    year: serviceRequest.year,
                    plateNumber: serviceRequest.plateNumber,
                },
                location: {
                    lat,
                    lng
                },
                issueDescription: serviceRequest.issueDescription,
                preferredTime: serviceRequest.preferredTime,
            }, { withCredentials: true });

            if (response.status === 200) {
                toast.success('Service request submitted successfully!');
                setShowServiceModal(false);
                setServiceRequest({
                    make: '',
                    model: '',
                    year: new Date().getFullYear(),
                    plateNumber: '',
                    issueDescription: '',
                    preferredTime: '',
                });

                // Navigate to the bids page with the service request ID
                navigate(`/bids/${response.data.serviceRequest._id}`);
            }
        } catch (error) {
            toast.error('Failed to submit service request');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };


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

            {/* Services Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Professional automotive services tailored to your needs. From emergency repairs to regular maintenance, we've got you covered.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2 }}
                                className="relative group overflow-hidden rounded-xl"
                            >
                                <div className="absolute inset-0">
                                    <img
                                        src={service.image}
                                        alt={service.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
                                </div>
                                <div className="relative p-8 h-[400px] flex flex-col">
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-bold text-white mb-3">{service.name}</h3>
                                        <p className="text-gray-200">{service.description}</p>
                                    </div>
                                    <button
                                        onClick={() => handleServiceRequest(service)}
                                        className="mt-6 inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-gray-900 transition-colors duration-200"
                                    >
                                        Request Service
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Service Request Modal */}
            <AnimatePresence>
                {showServiceModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-semibold">Request {selectedService?.title}</h3>
                                <button
                                    onClick={() => setShowServiceModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmitRequest} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Vehicle Make
                                    </label>
                                    <input
                                        type="text"
                                        value={serviceRequest.make}
                                        onChange={(e) => setServiceRequest({ ...serviceRequest, make: e.target.value })}
                                        placeholder="e.g., Toyota"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Vehicle Model
                                    </label>
                                    <input
                                        type="text"
                                        value={serviceRequest.model}
                                        onChange={(e) => setServiceRequest({ ...serviceRequest, model: e.target.value })}
                                        placeholder="e.g., Camry"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Vehicle Year
                                    </label>
                                    <input
                                        type="number"
                                        value={serviceRequest.year}
                                        onChange={(e) => setServiceRequest({ ...serviceRequest, year: parseInt(e.target.value) })}
                                        min="1900"
                                        max={new Date().getFullYear() + 1}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Plate Number
                                    </label>
                                    <input
                                        type="text"
                                        value={serviceRequest.plateNumber}
                                        onChange={(e) => setServiceRequest({ ...serviceRequest, plateNumber: e.target.value.toUpperCase() })}
                                        placeholder="e.g., ABC 123"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Your Location
                                    </label>
                                    <input
                                        type="text"
                                        value={userLocation}
                                        onChange={(e) => setUserLocation(e.target.value)}
                                        placeholder="Enter your location"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Issue Description
                                    </label>
                                    <textarea
                                        value={serviceRequest.issueDescription}
                                        onChange={(e) => setServiceRequest({ ...serviceRequest, issueDescription: e.target.value })}
                                        placeholder="Describe the issue you're experiencing..."
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        rows={3}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Preferred Time
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={serviceRequest.preferredTime}
                                        onChange={(e) => setServiceRequest({ ...serviceRequest, preferredTime: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div className="flex justify-end space-x-4 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowServiceModal(false)}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <Calendar size={20} />
                                        )}
                                        <span>Submit Request</span>
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

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