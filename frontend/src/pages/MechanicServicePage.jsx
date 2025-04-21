import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, AlertTriangle, PlayCircle, CheckCircle, Calendar, Timer, Loader2, User, Phone } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import clsx from 'clsx';

const MechanicServicePage = () => {
    const { requestId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [request, setRequest] = useState(null);

    useEffect(() => {
        const fetchRequest = async () => {
            setLoading(true);
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                setRequest({
                    id: requestId,
                    customer: {
                        name: "John Smith",
                        phone: "+1 (555) 123-4567"
                    },
                    vehicle: {
                        make: "Toyota",
                        model: "Camry",
                        year: 2020,
                        plateNumber: "ABC123"
                    },
                    issue: "Car won't start, possibly battery related issue",
                    location: "123 Main St, New York",
                    createdAt: new Date().toISOString(),
                    isEmergency: true,
                    preferredTime: "2024-03-20T10:00:00Z",
                    status: 'accepted'
                });
            } catch (error) {
                toast.error('Failed to fetch request details');
            } finally {
                setLoading(false);
            }
        };

        fetchRequest();
    }, [requestId]);

    const handleStartService = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setRequest(prev =>
                prev
                    ? {
                        ...prev,
                        status: 'in_progress',
                        startedAt: new Date().toISOString()
                    }
                    : null
            );
            toast.success('Service started successfully');
        } catch (error) {
            toast.error('Failed to start service');
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteService = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setRequest(prev =>
                prev
                    ? {
                        ...prev,
                        status: 'completed',
                        completedAt: new Date().toISOString()
                    }
                    : null
            );
            toast.success('Service completed successfully');
        } catch (error) {
            toast.error('Failed to complete service');
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
                        onClick={() => navigate('/mechanic/requests')}
                        className="mt-4 text-blue-600 hover:text-blue-800"
                    >
                        Back to Requests
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
                    {/* Status Banner */}
                    <div
                        className={clsx(
                            "px-6 py-3 text-white flex items-center justify-between",
                            request.status === 'accepted'
                                ? "bg-blue-600"
                                : request.status === 'in_progress'
                                    ? "bg-yellow-600"
                                    : "bg-green-600"
                        )}
                    >
                        <div className="flex items-center space-x-2">
                            {request.status === 'accepted' ? (
                                <Clock className="w-5 h-5" />
                            ) : request.status === 'in_progress' ? (
                                <Timer className="w-5 h-5" />
                            ) : (
                                <CheckCircle className="w-5 h-5" />
                            )}
                            <span className="font-medium capitalize">
                                {request.status.replace('_', ' ')}
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
                        {/* Customer Info */}
                        <div className="border-b pb-6">
                            <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-3">
                                    <User className="w-5 h-5 text-gray-400" />
                                    <span>{request.customer.name}</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Phone className="w-5 h-5 text-gray-400" />
                                    <a href={`tel:${request.customer.phone}`} className="text-blue-600 hover:text-blue-800">
                                        {request.customer.phone}
                                    </a>
                                </div>
                            </div>
                        </div>

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
                                    <span className="text-gray-600">Issue Description</span>
                                    <p className="font-medium mt-1">{request.issue}</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <MapPin className="w-5 h-5 text-gray-400" />
                                        <span>{request.location}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="w-5 h-5 text-gray-400" />
                                        <span>{new Date(request.preferredTime).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end">
                            {request.status === 'accepted' && (
                                <button
                                    onClick={handleStartService}
                                    disabled={loading}
                                    className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <PlayCircle className="w-5 h-5" />
                                    )}
                                    <span>Start Service</span>
                                </button>
                            )}
                            {request.status === 'in_progress' && (
                                <button
                                    onClick={handleCompleteService}
                                    disabled={loading}
                                    className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <CheckCircle className="w-5 h-5" />
                                    )}
                                    <span>Complete Service</span>
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default MechanicServicePage;
