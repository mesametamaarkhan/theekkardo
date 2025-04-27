import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Wrench, UserCheck, Shield, Trash2, AlertTriangle, CheckCircle, Search, ArrowUpRight, ArrowDownRight, DollarSign, Car, Clock, Bell, Loader2, LogOut, XCircle, RefreshCcw } from 'lucide-react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import clsx from 'clsx';

const AdminDashboard = () => {
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [actionType, setActionType] = useState(null);

    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({
        totalRequests: 0,
        completedRequests: 0,
        pendingRequests: 0,
        totalRevenue: 0,
    });

    // Fetch users + stats
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, statsRes] = await Promise.all([
                    axios.get('http://localhost:5000/admin/users', { withCredentials: true }),
                    axios.get('http://localhost:5000/admin/service-requests/', { withCredentials: true })
                ]);

                const fetchedUsers = usersRes.data.users;
                setUsers(fetchedUsers);

                // Separate counts
                const totalMechanics = fetchedUsers.filter(u => u.role === 'mechanic').length;
                const totalNormalUsers = fetchedUsers.filter(u => u.role === 'user').length;

                setStats(prev => ({
                    ...prev,
                    ...statsRes.data.serviceRequests,
                    totalMechanics,
                    totalNormalUsers,
                }));

            } catch (error) {
                console.error('Failed to fetch admin data:', error);
                toast.error('Failed to fetch dashboard data');
            }
        };

        fetchData();
    }, []);


    const handleAction = (user, action) => {
        setSelectedUser(user);
        setActionType(action);
        setShowConfirmModal(true);
    };

    const handleConfirmAction = async () => {
        if (!selectedUser || !actionType) return;

        setLoading(true);
        try {
            // Placeholder action: replace with real API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            toast.success(`${selectedUser.fullName} has been ${actionType === 'remove' ? 'removed' : 'promoted to admin'}`);
            setShowConfirmModal(false);
        } catch (error) {
            toast.error('Action failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        // Implement logout logic
    };

    const filteredUsers = users.filter(user =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const StatCard = ({ icon: Icon, title, value, change = null, prefix = '' }) => (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-gray-500 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold">
                        {prefix}{(value ?? 0).toLocaleString()}
                    </h3>
                    {change !== null && (
                        <div className={clsx(
                            "flex items-center mt-2 text-sm",
                            change >= 0 ? "text-green-600" : "text-red-600"
                        )}>
                            {change >= 0 ? (
                                <ArrowUpRight className="w-4 h-4 mr-1" />
                            ) : (
                                <ArrowDownRight className="w-4 h-4 mr-1" />
                            )}
                            <span>{Math.abs(change)}% from last month</span>
                        </div>
                    )}
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                    <Icon className="w-6 h-6 text-blue-600" />
                </div>
            </div>
        </div>
    );


    return (
        <div className="min-h-screen bg-gray-50">
            <Toaster position="top-right" />

            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-gray-900"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
                    <StatCard icon={Users} title="Total Users" value={stats.totalNormalUsers} />
                    <StatCard icon={Wrench} title="Total Mechanics" value={stats.totalMechanics} />
                    <StatCard icon={Clock} title="Pending Requests" value={stats.pending} />
                    <StatCard icon={CheckCircle} title="Completed Requests" value={stats.completed} />
                    <StatCard icon={XCircle} title="Cancelled Requests" value={stats.cancelled} />
                    <StatCard icon={RefreshCcw} title="In Progress Requests" value={stats.inProgress} />
                </div>



                {/* User Management */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">User Management</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search users..."
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left border-b border-gray-200">
                                    <th className="pb-3 font-semibold text-gray-600">Name</th>
                                    <th className="pb-3 font-semibold text-gray-600">Email</th>
                                    <th className="pb-3 font-semibold text-gray-600">Role</th>
                                    <th className="pb-3 font-semibold text-gray-600">Status</th>
                                    <th className="pb-3 font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredUsers.map((user) => (
                                    <tr key={user._id}>
                                        <td className="py-4">{user.fullName}</td>
                                        <td className="py-4">{user.email}</td>
                                        <td className="py-4 capitalize">{user.role}</td>
                                        <td className="py-4 capitalize">{user.status}</td>
                                        <td className="py-4">
                                            <div className="flex space-x-2">
                                                {/* Approve Request button */}
                                                {user.role === 'admin' && user.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleAction(user, 'approve')}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        title="Approve Admin Request"
                                                    >
                                                        <UserCheck size={18} />
                                                    </button>
                                                )}

                                                {/* Remove User button */}
                                                <button
                                                    onClick={() => handleAction(user, 'remove')}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Remove User"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                </div>

                {/* Confirm Modal */}
                <AnimatePresence>
                    {showConfirmModal && selectedUser && actionType && (
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
                                <div className="flex items-center space-x-3 text-red-600 mb-4">
                                    <AlertTriangle className="w-6 h-6" />
                                    <h3 className="text-xl font-semibold">Confirm Action</h3>
                                </div>

                                <p className="text-gray-600 mb-6">
                                    {actionType === 'remove'
                                        ? `Are you sure you want to remove ${selectedUser.fullName}?`
                                        : `Are you sure you want to promote ${selectedUser.fullName} to admin?`}
                                </p>

                                <div className="flex justify-end space-x-4">
                                    <button
                                        onClick={() => setShowConfirmModal(false)}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleConfirmAction}
                                        disabled={loading}
                                        className="flex items-center space-x-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                {actionType === 'remove' ? <Trash2 size={20} /> : <Shield size={20} />}
                                                <span>Confirm</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default AdminDashboard;
