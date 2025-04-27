import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { messaging } from './firebase-config'; // ✅ import messaging
import { onMessage, getToken } from "firebase/messaging"; // ✅ import onMessage and getToken

import LandingPage from './pages/LandingPage';
import { Footer, Navbar } from './components';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProfilePage from './pages/ProfilePage';
import BidsPage from './pages/BidsPage';
import MechanicRequestsPage from './pages/MechanicRequestsPage';
import MechanicServicePage from './pages/MechanicServicePage';
import UserServicePage from './pages/UserServicePage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
	useEffect(() => {
		const unsubscribe = onMessage(messaging, (payload) => {
			console.log("Message received:", payload);

			if (payload?.data?.type === "service_request") {
				console.log("New service request received!");
				
			}
		});

		// Clean up listener on unmount
		return () => {
			unsubscribe();
		};
	}, []);

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			<Navbar />
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/signup" element={<SignupPage />} />
				<Route path="/forgot-password" element={<ForgotPasswordPage />} />
				<Route path="/admin" element={<AdminDashboard />} />
				<Route path="/profile" element={<ProfilePage />} />
				<Route path="/bids/:requestId" element={<BidsPage />} />
				<Route path="/mechanic/requests" element={<MechanicRequestsPage />} />
				<Route path="/mechanic/service/:requestId" element={<MechanicServicePage />} />
				<Route path="/service/:requestId" element={<UserServicePage />} />
			</Routes>
			<Footer />
		</div>
	);
}

export default App;
