import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../firebase-config"; // adjust path if needed


const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(false);

        try {
            const res = await axios.post('http://localhost:5000/user/login', { email, password }, { withCredentials: true });

            if (res.status === 200) {
                sessionStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('user', JSON.stringify(res.data.user));
                toast.success('Login Successful');
                console.log('a');

                try {
                    console.log('b');
                    const fcmToken = await getToken(messaging, {
                        vapidKey: "BNeZu6L8hYEv91FL4yAndoZ-jdsymAW76BzTYRuMLSijcaa1GkbXcVnglagQ1FoimXjTZeT2EErBX4haYB9kfcA", // 🔐 replace with actual key
                    });
                    console.log('c');
    
                    if (fcmToken) {
                        await axios.post("http://localhost:5000/user/token", { fcmToken }, { withCredentials: true });
                        console.log("FCM token sent to backend.");
                    }
                } 
                catch (tokenErr) {
                    console.error("Failed to get/send FCM token:", tokenErr);
                }

                console.log('a');
                if(res.data.user.role === 'mechanic') {
                    navigate('/mechanic/requests');
                }
                else {
                    window.location.href = '/';
                }
            }
        }
        catch (err) {
            toast.error(err.response?.data?.message || 'Login Failed');
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
            <Toaster position="top-right" />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
                    <p className="text-gray-600">Login to your Theekkardo account</p>
                </div>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email or Phone"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-600">Remember me</span>
                        </label>
                        <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                            Forgot Password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="text-center mt-6 text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-blue-600 hover:text-blue-800">
                        Sign up
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default LoginPage;
