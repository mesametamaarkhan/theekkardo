import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, AlertTriangle, Star, CheckCircle, Calendar, Timer, Loader2, User, Phone, X, Send } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import clsx from 'clsx';
import axios from 'axios'; // You forgot to import axios!

const UserServicePage = () => {
    const { requestId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [request, setRequest] = useState(null);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [hoveredStar, setHoveredStar] = useState(0);

    useEffect(() => {
        const fetchRequest = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/service-request/${requestId}`, {
                    withCredentials: true,
                });
                setRequest(response.data.serviceRequest);
            }
            catch (error) {
                console.error(error);
                toast.error('Failed to fetch request details');
            }
            finally {
                setLoading(false);
            }
        };

        fetchRequest();

        const interval = setInterval(fetchRequest, 30000);
        return () => clearInterval(interval);
    }, [requestId]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            toast.success('Review submitted successfully!');
            setShowRatingModal(false);
            navigate('/profile');
        } catch (error) {
            toast.error('Failed to submit review');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (!request) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900">Request not found</h2>
                    <button
                        onClick={() => navigate('/profile')}
                        className="mt-4 text-blue-600 hover:text-blue-800"
                    >
                        Back to Profile
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Toaster position="top-right" />
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                >
                    <div
                        className={clsx(
                            'px-6 py-3 text-white flex items-center justify-between',
                            request.status === 'accepted'
                                ? 'bg-blue-600'
                                : request.status === 'in-progress'
                                    ? 'bg-yellow-600'
                                    : request.status === 'completed'
                                        ? 'bg-green-600'
                                        : 'bg-gray-600'
                        )}
                    >
                        <div className="flex items-center space-x-2">
                            {request.status === 'accepted' ? (
                                <Clock className="w-5 h-5" />
                            ) : request.status === 'in-progress' ? (
                                <Timer className="w-5 h-5" />
                            ) : (
                                <CheckCircle className="w-5 h-5" />
                            )}
                            <span className="font-medium capitalize">
                                {request.status.replace('-', ' ')}
                            </span>
                        </div>
                        {request.isEmergency && (
                            <span className="flex items-center space-x-1 bg-red-500 px-2 py-1 rounded-full text-sm">
                                <AlertTriangle className="w-4 h-4" />
                                <span>Emergency</span>
                            </span>
                        )}
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Mechanic Info */}
                        {request.mechanicId && (
                            <div className="border-b pb-6">
                                <h2 className="text-lg font-semibold mb-4">Mechanic Information</h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-3">
                                        <User className="w-5 h-5 text-gray-400" />
                                        <span>{request.mechanicId.fullName || 'Mechanic assigned'}</span>
                                    </div>
                                    {/* If you have mechanic contact details, add here */}
                                </div>
                            </div>
                        )}

                        {/* Vehicle Details */}
                        <div className="border-b pb-6">
                            <h2 className="text-lg font-semibold mb-4">Vehicle Details</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <span className="text-gray-600">Vehicle</span>
                                    <p className="font-medium">
                                        {request.vehicle.make} {request.vehicle.model} {request.vehicle.year}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-600">Plate Number</span>
                                    <p className="font-medium">{request.vehicle.plateNumber}</p>
                                </div>
                            </div>
                        </div>

                        {/* Service Details */}
                        <div className="border-b pb-6">
                            <h2 className="text-lg font-semibold mb-4">Service Details</h2>
                            <div className="space-y-4">
                                <div>
                                    <span className="text-gray-600">Service Name</span>
                                    <p className="font-medium mt-1">{request.serviceId?.name || 'Service'}</p>
                                </div>
                                <div>
                                    <span className="text-gray-600">Issue Description</span>
                                    <p className="font-medium mt-1">{request.issueDescription}</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <MapPin className="w-5 h-5 text-gray-400" />
                                        <span>Lat: {request.location.lat}, Lng: {request.location.lng}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="w-5 h-5 text-gray-400" />
                                        <span>{new Date(request.preferredTime).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Button */}
                        {request.status === 'completed' && (
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setShowRatingModal(true)}
                                    className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Star className="w-5 h-5" />
                                    <span>Rate & Review</span>
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Rating Modal */}
                <AnimatePresence>
                    {showRatingModal && (
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
                                    <h3 className="text-xl font-semibold">Rate Your Experience</h3>
                                    <button
                                        onClick={() => setShowRatingModal(false)}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmitReview} className="space-y-4">
                                    <div className="flex justify-center space-x-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHoveredStar(star)}
                                                onMouseLeave={() => setHoveredStar(0)}
                                                className="focus:outline-none"
                                            >
                                                <Star
                                                    className={clsx(
                                                        'w-8 h-8 transition-colors',
                                                        (hoveredStar ? star <= hoveredStar : star <= rating)
                                                            ? 'text-yellow-400 fill-yellow-400'
                                                            : 'text-gray-300'
                                                    )}
                                                />
                                            </button>
                                        ))}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Your Review
                                        </label>
                                        <textarea
                                            value={review}
                                            onChange={(e) => setReview(e.target.value)}
                                            placeholder="Share your experience..."
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            rows={4}
                                            required
                                        />
                                    </div>

                                    <div className="flex justify-end space-x-4 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setShowRatingModal(false)}
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
                                                <Send className="w-5 h-5" />
                                            )}
                                            <span>Submit Review</span>
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default UserServicePage;
