import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import {
  User,
  Camera,
  Shield,
  Star,
  Car,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  LogOut,
  Loader2,
  BadgeCheck
} from 'lucide-react';
import clsx from 'clsx';

const ProfilePage = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordSection, setShowPasswordSection] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [isOnline, setIsOnline] = useState(true);
  
    const [profile, setProfile] = useState({
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        role: 'user',
        isVerified: true,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80'
    });

    const [vehicles, setVehicles] = useState([
        { id: 1, make: 'Toyota', model: 'Camry', year: 2020, plate: 'ABC 123' },
        { id: 2, make: 'Honda', model: 'Civic', year: 2019, plate: 'XYZ 789' }
    ]);

    const [passwords, setPasswords] = useState({
        old: '',
        new: '',
        confirm: ''
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
        }
    };

    const handleProfileUpdate = async () => {
        setLoading(true);
        try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsEditing(false);
        toast.success('Profile updated successfully!');
        } catch (error) {
        toast.error('Failed to update profile');
        } finally {
        setLoading(false);
        }
    };

    const handlePasswordUpdate = async () => {
        if (passwords.new !== passwords.confirm) {
        toast.error('New passwords do not match');
        return;
        }
        setLoading(true);
        try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPasswords({ old: '', new: '', confirm: '' });
        setShowPasswordSection(false);
        toast.success('Password updated successfully!');
        } catch (error) {
        toast.error('Failed to update password');
        } finally {
        setLoading(false);
        }
    };

    const handleAddVehicle = () => {
        const newVehicle = {
        id: vehicles.length + 1,
        make: 'New Vehicle',
        model: '',
        year: new Date().getFullYear(),
        plate: ''
        };
        setVehicles([...vehicles, newVehicle]);
    };

    const handleDeleteVehicle = (id) => {
        setVehicles(vehicles.filter(v => v.id !== id));
        toast.success('Vehicle removed successfully');
    };

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Toaster position="top-right" />
        
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Profile Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                >
                <div className="relative h-36 bg-gradient-to-r from-blue-600 to-blue-800">
                    <div className="absolute -bottom-12 left-8 flex items-end space-x-4">
                        <div className="relative">
                            <img
                                src={imagePreview || profile.image}
                                alt={profile.name}
                                className="w-24 h-24 rounded-full border-4 border-white object-cover"
                            />
                            {isEditing && (
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                                >
                                    <Camera size={16} />
                                </button>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </div>
                        <div className="mb-2">
                            <div className="flex items-center space-x-2">
                                <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
                                {profile.isVerified && (
                                    <BadgeCheck className="w-6 h-6 text-blue-400" />
                                )}
                            </div>
                            <p className="text-blue-200">{profile.role}</p>
                        </div>
                    </div>
                </div>
                
                <div className="pt-16 pb-6 px-8">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center space-x-4">
                            {profile.role === 'mechanic' && (
                            <>
                                <div className="flex items-center space-x-2">
                                    <Star className="w-5 h-5 text-yellow-400" />
                                    <span className="font-semibold">{profile.rating}</span>
                                </div>
                                <button
                                    onClick={() => setIsOnline(!isOnline)}
                                    className={clsx(
                                        'px-4 py-2 rounded-full font-medium transition-colors',
                                        isOnline
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                    )}
                                >
                                    {isOnline ? 'Online' : 'Offline'}
                                </button>
                            </>
                            )}
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                <Edit2 size={18} />
                                <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                            >
                                <LogOut size={18} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={profile.email}
                                disabled
                                className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone
                            </label>
                            <input
                                type="tel"
                                value={profile.phone}
                                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                disabled={!isEditing}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {isEditing && (
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={handleProfileUpdate}
                                disabled={loading}
                                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <CheckCircle2 size={20} />
                                )}
                                <span>Save Changes</span>
                            </button>
                        </div>
                    )}
                </div>
                </motion.div>

                {/* Vehicles Section */}
                {profile.role === 'user' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-md p-6"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">My Vehicles</h2>
                            <button
                                onClick={handleAddVehicle}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Plus size={18} />
                                <span>Add Vehicle</span>
                            </button>
                        </div>

                        <div className="grid gap-4">
                            {vehicles.map((vehicle) => (
                                <div
                                    key={vehicle.id}
                                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                                >
                                    <div className="flex items-center space-x-4">
                                        <Car className="w-6 h-6 text-gray-400" />
                                        <div>
                                            <h3 className="font-medium">
                                                {vehicle.make} {vehicle.model}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {vehicle.year} • {vehicle.plate}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handleDeleteVehicle(vehicle.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Password Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-md p-6"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Security</h2>
                        <button
                            onClick={() => setShowPasswordSection(!showPasswordSection)}
                            className="text-blue-600 hover:text-blue-800"
                        >
                        {showPasswordSection ? 'Cancel' : 'Change Password'}
                        </button>
                    </div>

                    <AnimatePresence>
                        {showPasswordSection && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwords.old}
                                        onChange={(e) => setPasswords({ ...passwords, old: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwords.new}
                                        onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwords.confirm}
                                        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        onClick={handlePasswordUpdate}
                                        disabled={loading}
                                        className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                        <Shield size={20} />
                                        )}
                                        <span>Update Password</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default ProfilePage;