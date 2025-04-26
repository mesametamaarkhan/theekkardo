import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Clock, MapPin, Car, Loader2, DollarSign, X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const MechanicRequestsPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [requests, setRequests] = useState([]);
    const [showEmergencyOnly, setShowEmergencyOnly] = useState(false);
    const [showBidModal, setShowBidModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [bidAmount, setBidAmount] = useState('');
    const [estimatedTime, setEstimatedTime] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        navigator.serviceWorker.addEventListener("message", (event) => {
            if (event.data.type === "service_request") {
                console.log("Received service_request notification:", event.data);
                window.location.reload();
            }
        });

        const loggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
        setIsLoggedIn(loggedIn);
        
        const fetchRequests = async () => {
            setLoading(true);
            try {
                const res = await axios.get('http://localhost:5000/service-request/', { withCredentials: true});
                if(res.status === 200) {
                    setRequests(res.data.serviceRequests);
                }
            } catch (error) {
                toast.error('Failed to fetch service requests');
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const formatTimeAgo = (date) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + ' years ago';
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + ' months ago';
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + ' days ago';
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + ' hours ago';
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + ' minutes ago';
        return Math.floor(seconds) + ' seconds ago';
    };

    const handlePlaceBid = (request) => {
        setSelectedRequest(request);
        setShowBidModal(true);
    };

    const handleSubmitBid = async (e) => {
        e.preventDefault();
        if (!selectedRequest) return;

        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/service-request/place-bid', { serviceRequestId: selectedRequest._id, bidAmount, message }, { withCredentials: true });
            
            if(res.status === 200) {
                toast.success('Bid placed successfully!');
                setShowBidModal(false);
                setBidAmount('');
                setEstimatedTime('');
                setMessage('');
            }
        } 
        catch (error) {
            toast.error('Failed to place bid');
        } 
        finally {
            setLoading(false);
        }
    };

    const filteredRequests = showEmergencyOnly ? requests.filter(req => req.isEmergency) : requests;
    
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Toaster position="top-right" />

            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Service Requests</h1>
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={showEmergencyOnly}
                            onChange={(e) => setShowEmergencyOnly(e.target.checked)}
                            className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <span className="text-sm text-gray-600">Emergency Only</span>
                    </label>
                </div>

                {loading && requests.length === 0 ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    </div>
                ) : filteredRequests.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                        <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No service requests</h3>
                        <p className="text-gray-500">There are no pending service requests at the moment.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredRequests.map((request) => (
                            <motion.div
                                key={request._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-xl shadow-sm p-6"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-3">
                                            <h3 className="font-semibold text-lg">
                                                {request.vehicle.make} {request.vehicle.model} {request.vehicle.year}
                                            </h3>
                                            {request.isEmergency && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                                    Emergency
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-600">{request.issueDescription}</p>
                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <MapPin className="w-4 h-4 mr-1" />
                                                <a
                                                    href={`https://www.google.com/maps?q=${request.location.lat},${request.location.lng}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    View Location
                                                </a>
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="w-4 h-4 mr-1" />
                                                <span>{formatTimeAgo(request.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handlePlaceBid(request)}
                                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <DollarSign className="w-4 h-4" />
                                        <span>Place Bid</span>
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Bid Modal */}
                <AnimatePresence>
                    {showBidModal && selectedRequest && (
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
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-semibold">Place a Bid</h3>
                                    <button
                                        onClick={() => setShowBidModal(false)}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmitBid} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Bid Amount ($)
                                        </label>
                                        <input
                                            type="number"
                                            value={bidAmount}
                                            onChange={(e) => setBidAmount(e.target.value)}
                                            placeholder="Enter your bid amount"
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Estimated Time
                                        </label>
                                        <input
                                            type="text"
                                            value={estimatedTime}
                                            onChange={(e) => setEstimatedTime(e.target.value)}
                                            placeholder="e.g., 1-2 hours"
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Message
                                        </label>
                                        <textarea
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Describe how you can help..."
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            rows={4}
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                                        disabled={loading}
                                    >
                                        {loading ? 'Submitting...' : 'Submit Bid'}
                                    </button>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default MechanicRequestsPage;
