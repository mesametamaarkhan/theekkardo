import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import {
  Camera,
  Shield,
  Star,
  Car,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  LogOut,
  Loader2,
  BadgeCheck,
  X
} from 'lucide-react';
import clsx from 'clsx';

const ProfilePage = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordSection, setShowPasswordSection] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [isOnline, setIsOnline] = useState(true);
    const [showAddVehicle, setShowAddVehicle] = useState(false);
    const [error, setError] = useState('');
  
    const [profile, setProfile] = useState({
        fullName: '',
        email: '',
        phone: '',
        role: '',
        verified: Boolean,
        vehicles: [],
        rating: Number,
        profileImage: ''
    });

    const [passwords, setPasswords] = useState({
        old: '',
        new: '',
        confirm: ''
    });

    const [newVehicle, setNewVehicle] = useState({
        make: '',
        model: '',
        year: '',
        plateNumber: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get('http://localhost:5000/user/profile', { withCredentials: true });
                if(res.status === 200) {
                    setProfile(res.data.user);
                }
            }
            catch(err) {
                setError(err.message);
            }

            
        };

        fetchProfile();
    }, []);


    //done
    const handleProfileUpdate = async () => {
        setLoading(true);
        try {
            // Simulate API call
            const res = await axios.put('http://localhost:5000/user/update-profile', { fullName: profile.fullName, phone: profile.phone }, { withCredentials: true });
            
            if(res.status === 200) {
                toast.success('Profile updated successfully!');
                window.location.reload();
            }
        } 
        catch (error) {
            toast.error('Failed to update profile');
        } 
        finally {
            setLoading(false);
        }
    };

    //done
    const handlePasswordUpdate = async () => {
        if (passwords.new !== passwords.confirm) {
            toast.error('New passwords do not match');
            return;
        }
        setLoading(true);

        try {
            const res = await axios.put('http://localhost:5000/user/change-password', { currPassword: passwords.old, newPassword: passwords.new }, { withCredentials: true });
            
            if(res.status === 200) {
                toast.success('Profile updated successfully!');
                window.location.reload();
            }
        } 
        catch (error) {
            toast.error('Failed to update password');
        } 
        finally {
            setLoading(false);
        }
    };

    //done
    const handleLogout = async () => {
        try {
            const res = await axios.post('http://localhost:5000/user/logout', {}, { withCredentials: true });

            if(res.status === 200) {
                sessionStorage.setItem('isLoggedIn', 'false');
                toast.success('Logout Successful');
                window.location.href = '/login';
            }
        }
        catch(err) {
            toast.error(err.response?.data?.message || 'Logout Failed');
        }
        finally {
            setLoading(false);
        }
    };

    const handleAddVehicle = () => {
        setShowAddVehicle(true);
    };

    //TODO:
    const handleSubmitVehicle = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!newVehicle.make || !newVehicle.model || !newVehicle.year || !newVehicle.plate) {
        toast.error('Please fill in all fields');
        return;
        }

        setLoading(true);
        try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // const vehicle = {
        //     id: vehicles.length + 1,
        //     ...newVehicle
        // };
        
        // setVehicles([...vehicles, vehicle]);
        setNewVehicle({
            make: '',
            model: '',
            year: new Date().getFullYear(),
            plate: ''
        });
        setShowAddVehicle(false);
        toast.success('Vehicle added successfully');
        } catch (error) {
        toast.error('Failed to add vehicle');
        } finally {
        setLoading(false);
        }
    };

    //TODO: 
    const handleDeleteVehicle = (id) => {
        // setVehicles(vehicles.filter(v => v.id !== id));
        toast.success('Vehicle removed successfully');
    };

    //TODO:
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        
            setImageLoading(true);
            try {
                // Simulate API call for image upload
                await new Promise(resolve => setTimeout(resolve, 1000));
                toast.success('Profile picture updated successfully!');
            } catch (error) {
                toast.error('Failed to update profile picture');
                setImagePreview(null);
            } finally {
                setImageLoading(false);
            }
        }
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
                    <div className="relative h-32 bg-gradient-to-r from-blue-600 to-blue-800">
                        <div className="absolute -bottom-12 left-8">
                            <div className="relative group">
                                <img
                                    src={imagePreview || profile.profileImage}
                                    alt={profile.fullName}
                                    className="w-24 h-24 rounded-full border-4 border-white object-cover"
                                />
                                <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                >
                                    {imageLoading ? (
                                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                                    ) : (
                                        <Camera className="w-6 h-6 text-white" />
                                    )}
                                </button>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </div>
                    </div>
                
                    <div className="pt-16 pb-6 px-8">
                        <div className="flex flex-col space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <h1 className="text-2xl font-bold text-gray-900">{profile.fullName}</h1>
                                    {profile.verified && (
                                        <BadgeCheck className="w-6 h-6 text-blue-600" />
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
                        
                            <div className="flex items-center space-x-4">
                                <p className="text-gray-600">{profile.role}</p>
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
                        </div>

                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        {profile.vehicles.map((vehicle) => (
                            <div
                                key={vehicle.plateNumber}
                                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                            >
                                <div className="flex items-center space-x-4">
                                    <Car className="w-6 h-6 text-gray-400" />
                                    <div>
                                        <h3 className="font-medium">
                                            {vehicle.make} {vehicle.model}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {vehicle.year} • {vehicle.plateNumber}
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

                        {/* Add Vehicle Modal */}
                        <AnimatePresence>
                            {showAddVehicle && (
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
                                            <h3 className="text-xl font-semibold">Add New Vehicle</h3>
                                            <button
                                                onClick={() => setShowAddVehicle(false)}
                                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>

                                        <form onSubmit={handleSubmitVehicle} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Make
                                                </label>
                                                <input
                                                    type="text"
                                                    value={newVehicle.make}
                                                    onChange={(e) => setNewVehicle({ ...newVehicle, make: e.target.value })}
                                                    placeholder="e.g., Toyota"
                                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Model
                                                </label>
                                                <input
                                                    type="text"
                                                    value={newVehicle.model}
                                                    onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                                                    placeholder="e.g., Camry"
                                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Year
                                                </label>
                                                <input
                                                    type="Number"
                                                    value={newVehicle.year}
                                                    onChange={(e) => setNewVehicle({ ...newVehicle, year: parseInt(e.target.value) })}
                                                    min="1900"
                                                    max={new Date().getFullYear() + 1}
                                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Plate Number
                                                </label>
                                                <input
                                                    type="text"
                                                    value={newVehicle.plate}
                                                    onChange={(e) => setNewVehicle({ ...newVehicle, plate: e.target.value.toUpperCase() })}
                                                    placeholder="e.g., ABC 123"
                                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                                                />
                                            </div>

                                            <div className="flex justify-end space-x-4 mt-6">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowAddVehicle(false)}
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
                                                        <Plus size={20} />
                                                    )}
                                                    <span>Add Vehicle</span>
                                                </button>
                                            </div>
                                        </form>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
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