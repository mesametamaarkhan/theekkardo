import React from 'react';
import { Routes, Route } from 'react-router-dom';
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

function App() {
	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			<Navbar />
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/signup" element={<SignupPage />} />
				<Route path="/forgot-password" element={<ForgotPasswordPage />} />
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