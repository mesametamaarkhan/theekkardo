import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  User, 
  Star, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  MessageSquare,
  Loader2,
  ThumbsUp,
  Calendar
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const BidsPage = () => {
    const { requestId } = useParams();
    const navigate = useNavigate();
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedBid, setSelectedBid] = useState(null);
    const [serviceRequest, setServiceRequest] = useState({
        vehicle: {
            make: '',
            model: '',
            year: new Date().getFullYear(),
            plateNumber: ''
        },
        location: {
            lat: null,
            lng: null
        },
        _id: '',
        userId: '',
        serviceId: {
            _id: '',
            name: '',
            description: '',
            basePrice: 0,
            image: '',
            createdAt: '',
            updatedAt: '',
            __v: 0
        },
        issueDescription: '',
        preferredTime: '',
        status: 'pending',
        createdAt: '',
        updatedAt: '',
        __v: 0
    });
    

    useEffect(() => {
        const fetchBids = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/service-request/bids/${requestId}`, { withCredentials: true });

                if(response.status === 200) {
                    setBids(response.data.bids);
                    setServiceRequest(response.data.serviceRequest);
                    toast.success('Bids fetched successfully');
                }
                else {
                    toast.error('An error occurred');
                }
            }
            catch(error) {
                console.error("Error fetching bids:", error);
                toast.error("Failed to load bids. Please try again.");
            }
            finally {
                setLoading(false);
            }
        };

        fetchBids();
    }, []);

    // const serviceRequest = {
    //     id: requestId,
    //     service: "Emergency Repairs",
    //     vehicle: "Toyota Camry 2020",
    //     issue: "Car won't start, possibly battery related issue",
    //     location: "123 Main St, New York",
    //     preferredTime: "2024-03-20T10:00",
    //     status: "Pending"
    // };

    // // Mock bids data
    // const [bids] = useState([
    //     {
    //         id: 1,
    //         mechanicId: 101,
    //         mechanicName: "John Smith",
    //         mechanicRating: 4.8,
    //         amount: 120,
    //         estimatedTime: "1-2 hours",
    //         message: "I can help you with your battery issue. I have all the necessary equipment and can arrive within 30 minutes.",
    //         experience: "10 years",
    //         completedJobs: 234,
    //         avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80"
    //     },
    //     {
    //         id: 2,
    //         mechanicId: 102,
    //         mechanicName: "Mike Johnson",
    //         mechanicRating: 4.9,
    //         amount: 150,
    //         estimatedTime: "1 hour",
    //         message: "Specialized in battery diagnostics and replacement. Available immediately with all required tools.",
    //         experience: "15 years",
    //         completedJobs: 456,
    //         avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80"
    //     },
    //     {
    //         id: 3,
    //         mechanicId: 103,
    //         mechanicName: "Sarah Williams",
    //         mechanicRating: 4.7,
    //         amount: 135,
    //         estimatedTime: "1-1.5 hours",
    //         message: "I can diagnose and fix your battery issue. I'll bring a replacement battery just in case it's needed.",
    //         experience: "8 years",
    //         completedJobs: 189,
    //         avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80"
    //     }
    // ]);

    const handleAcceptBid = async (bid) => {
        setSelectedBid(bid);
        setShowConfirmModal(true);
    };

    const confirmAcceptBid = async () => {
        if (!selectedBid) return;

        setLoading(true);
        try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast.success('Bid accepted successfully! The mechanic has been notified.');
        setShowConfirmModal(false);
        // Navigate to a confirmation or tracking page
        navigate(`/service-tracking/${requestId}`);
        } catch (error) {
        toast.error('Failed to accept bid. Please try again.');
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Toaster position="top-right" />
        
            <div className="max-w-4xl mx-auto">
                {/* Service Request Details */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Request Details</h1>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">Service Type</p>
                            <p className="font-medium">{serviceRequest.serviceId.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Vehicle</p>
                            <p className="font-medium">{serviceRequest.vehicle.make} {serviceRequest.vehicle.model} {serviceRequest.vehicle.year}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Location</p>
                            <p className="font-medium">{serviceRequest.location.lat} {serviceRequest.location.lng}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Preferred Time</p>
                            <p className="font-medium">
                                {new Date(serviceRequest.preferredTime).toLocaleString()}
                            </p>
                        </div>
                        <div className="md:col-span-2">
                            <p className="text-sm text-gray-600">Issue Description</p>
                            <p className="font-medium">{serviceRequest.issueDescription}</p>
                        </div>
                    </div>
                </div>

                {/* Bids Section */}
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Mechanic Bids ({bids.length})
                </h2>

                <div className="space-y-6">
                    {bids.map((bid) => (
                        <motion.div
                            key={bid._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl shadow-md p-6"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-4">
                                    <img
                                        src={bid.mechanicId.profileImage}
                                        alt={bid.mechanicId.fullName}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div>
                                        <h3 className="font-semibold text-lg">{bid.mechanicId.fullName}</h3>
                                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                                            <div className="flex items-center">
                                                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                                                <span>{bid.mechanicId.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                <div className="text-2xl font-bold text-blue-600">
                                    ${bid.bidAmount}
                                </div>
                                </div>
                            </div>

                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-start space-x-2">
                                    <MessageSquare className="w-5 h-5 text-gray-400 mt-1" />
                                    <p className="text-gray-700">{bid.message}</p>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => handleAcceptBid(bid)}
                                    className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <CheckCircle size={20} />
                                    <span>Accept Bid</span>
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Confirmation Modal */}
                <AnimatePresence>
                {showConfirmModal && selectedBid && (
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
                            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md"
                        >
                            <h3 className="text-xl font-semibold mb-4">Confirm Selection</h3>
                            <p className="text-gray-600 mb-6">
                            Are you sure you want to accept the bid from {selectedBid.mechanicName} for ${selectedBid.amount}?
                            </p>
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => setShowConfirmModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmAcceptBid}
                                    disabled={loading}
                                    className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                    <CheckCircle size={20} />
                                    )}
                                    <span>Confirm</span>
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default BidsPage;