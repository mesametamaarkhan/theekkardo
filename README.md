# 🚗 TheekKarDo - Mechanic Finder & Roadside Assistance

## 📌 Overview
**TheekKarDo** is a web-based application that connects vehicle owners with nearby mechanics and service providers in real-time. The platform helps users request emergency repairs, car washes, and general maintenance services at their location. It features GPS tracking, service scheduling, secure payments, and a rating system to ensure quality service.

## 🚀 Features
### User & Mechanic Management
- User & Mechanic Login/Signup
- Profile Management for both users and mechanics

### Service Request System
- Service Categories: Breakdown Repair, Car Wash, General Maintenance
- Location-Based Requests (User selects current or custom location)
- Service Details Form (Vehicle details, issue description, preferred time)
- Real-Time Mechanic Availability (Show online mechanics nearby)

### Real-Time Tracking & Communication
- In-app Chat (Quick communication between user & mechanic)
- Live GPS Tracking (Track mechanic’s location in real-time)

### Matching & Dispatch System
- Auto-Assign Mechanic (Nearest available mechanic assigned automatically)
- Manual Mechanic Selection (User can choose from available mechanics)
- Estimated Price Calculation (Based on service type, distance, and time)
- Request Status Tracking (Pending, Accepted, In Progress, Completed)

### Payment System
- Multiple Payment Methods (Cash, Card, Digital Wallets)
- Upfront Estimates and Invoicing
- Payment Confirmation & History

### Reviews & Ratings
- User Reviews for Mechanics
- Mechanic Ratings for Users (To prevent fake requests)

### Emergency & Safety Features
- Emergency Priority Option (For urgent roadside breakdowns)
- SOS Button (For immediate help if needed)

### Admin Dashboard
- Mechanic Approval & Verification
- User & Mechanic Data Management
- Service & Payment Monitoring

---

## 🛠️ Tech Stack
- **Frontend:** React.js, TailwindCSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT-based authentication
- **Real-Time Communication:** Firebase
- **Maps & Location Services:** Google Maps API
- **Payment Integration:** Stripe/PayPal (TBD)

---

## 🏗️ Installation & Setup
### Prerequisites
- Node.js (>=14.x)
- MongoDB (Local or Atlas)
- Google Maps API Key
- Payment Gateway API Keys (Stripe/PayPal)

### Clone the Repository
```sh
 git clone https://github.com/yourusername/vehicle-assist.git
 cd vehicle-assist
```

### Backend Setup
```sh
 cd backend
 npm install
 npm start
```

### Frontend Setup
```sh
 cd frontend
 npm install
 npm start
```

---

## 📌 Environment Variables
Create a `.env` file in the `backend/` directory and add:
```sh
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
PAYMENT_GATEWAY_KEY=your_payment_gateway_api_key
```

---

## 🚀 Usage
1. **Sign up/Login** as a vehicle owner or mechanic.
2. **Request a service** by selecting a category and location.
3. **Get matched** with a nearby mechanic automatically or manually.
4. **Communicate** via in-app chat and track in real-time.
5. **Make secure payments** through various options.
6. **Rate & Review** the service provider.

---

## 🤝 Contributing
1. Fork the repository.
2. Create a new branch (`feature/your-feature`)
3. Commit changes (`git commit -m "Added new feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## ✨ Contributors
- [Mesam E Tamaar Khan](https://github.com/mesametamaarkhan)
- [Aamna Saeed](https://github.com/AamnaSaeed)
- [Tashfeen Hassan](https://github.com/TashfeenHassan)

---

## 📬 Contact
For support or inquiries, contact **mesametamaarkhan@gmail.com** or open an issue in the repo.

