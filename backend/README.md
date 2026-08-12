 Car Rental Software backend structure-
backend/README.md

file-ல் paste .

Car Rental Software - Backend

A complete and scalable Car Rental Management System Backend built using Node.js, Express.js, MongoDB, and REST APIs.

This backend provides APIs for customer authentication, car management, bookings, payments, reviews, wishlist, coupons, insurance, notifications, reports, admin dashboard, and support management.

---

📌 Project Overview

The Car Rental Software allows customers to:

- Register and login
- Browse available cars
- Search and filter cars
- View car details
- Select rental dates
- Book cars
- Make online payments
- View booking history
- Cancel bookings
- Add cars to wishlist
- Give reviews and ratings
- Apply coupons
- Select insurance
- Receive notifications
- Contact customer support

Administrators can:

- Manage users
- Manage cars
- Manage brands
- Manage categories
- Manage bookings
- Manage payments
- Manage coupons
- Manage insurance
- Manage reviews
- Manage locations
- Manage notifications
- View reports
- View dashboard analytics

---

🚀 Technologies Used

Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- REST API
- JWT Authentication

Security

- bcryptjs
- JSON Web Token
- Helmet
- CORS
- Express Rate Limiter
- Express Validator

Payment

- Razorpay
- Stripe

File Upload

- Multer
- Cloudinary

Email

- Nodemailer

Development

- Nodemon
- Morgan
- Jest / Supertest

---

📁 Backend Folder Structure

backend/
│
├── config/
│   ├── db.js
│   ├── cloudinary.js
│   ├── razorpay.js
│   ├── stripe.js
│   ├── mail.js
│   └── env.js
│
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── adminController.js
│   ├── carController.js
│   ├── bookingController.js
│   ├── paymentController.js
│   ├── reviewController.js
│   ├── wishlistController.js
│   ├── notificationController.js
│   ├── dashboardController.js
│   ├── reportController.js
│   ├── couponController.js
│   ├── locationController.js
│   ├── insuranceController.js
│   └── supportController.js
│
├── models/
│   ├── User.js
│   ├── Admin.js
│   ├── Car.js
│   ├── Brand.js
│   ├── Category.js
│   ├── Booking.js
│   ├── Payment.js
│   ├── Review.js
│   ├── Wishlist.js
│   ├── Coupon.js
│   ├── Notification.js
│   ├── Location.js
│   ├── Insurance.js
│   └── Contact.js
│
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── adminRoutes.js
│   ├── carRoutes.js
│   ├── bookingRoutes.js
│   ├── paymentRoutes.js
│   ├── reviewRoutes.js
│   ├── wishlistRoutes.js
│   ├── notificationRoutes.js
│   ├── dashboardRoutes.js
│   ├── reportRoutes.js
│   ├── couponRoutes.js
│   ├── locationRoutes.js
│   ├── insuranceRoutes.js
│   └── supportRoutes.js
│
├── middleware/
│   ├── authMiddleware.js
│   ├── adminMiddleware.js
│   ├── uploadMiddleware.js
│   ├── validateMiddleware.js
│   ├── errorMiddleware.js
│   ├── loggerMiddleware.js
│   ├── rateLimiter.js
│   └── notFound.js
│
├── services/
│   ├── authService.js
│   ├── carService.js
│   ├── bookingService.js
│   ├── paymentService.js
│   ├── emailService.js
│   ├── notificationService.js
│   ├── reportService.js
│   ├── couponService.js
│   └── dashboardService.js
│
├── validators/
│   ├── authValidator.js
│   ├── userValidator.js
│   ├── carValidator.js
│   ├── bookingValidator.js
│   ├── paymentValidator.js
│   └── reviewValidator.js
│
├── utils/
│   ├── generateToken.js
│   ├── generateInvoice.js
│   ├── calculatePrice.js
│   ├── uploadImage.js
│   ├── deleteImage.js
│   ├── sendEmail.js
│   ├── sendSMS.js
│   ├── logger.js
│   ├── responseHandler.js
│   ├── pagination.js
│   ├── dateHelper.js
│   └── constants.js
│
├── uploads/
│   ├── cars/
│   ├── users/
│   ├── documents/
│   └── temp/
│
├── public/
│   ├── images/
│   └── invoices/
│
├── logs/
│   ├── access.log
│   └── error.log
│
├── tests/
│   ├── auth.test.js
│   ├── car.test.js
│   ├── booking.test.js
│   └── payment.test.js
│
├── scripts/
│   ├── seedAdmin.js
│   ├── seedCars.js
│   └── seedDatabase.js
│
├── docs/
│   └── swagger.json
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
├── server.js
└── app.js

---

⚙️ Installation

1. Clone the Project

git clone <your-github-repository-url>

2. Navigate to Backend

cd backend

3. Install Dependencies

npm install

---

🔐 Environment Variables

Create a ".env" file inside the backend folder.

NODE_ENV=development

PORT=5000

MONGO_URI=mongodb://127.0.0.1:27017/car_rental

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Email
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=
MAIL_PASSWORD=

# Application
COMPANY_NAME=Car Rental Software
COMPANY_EMAIL=
COMPANY_PHONE=

---

🗄️ MongoDB Setup

You can use either:

Local MongoDB

mongodb://127.0.0.1:27017/car_rental

MongoDB Atlas

Create a MongoDB Atlas cluster and add the connection string:

MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/car_rental

---

▶️ Running the Server

Development

npm run dev

Production

npm start

The backend will run at:

http://localhost:5000

---

🔗 API Base URL

http://localhost:5000/api

---

🔐 Authentication API

Register

POST /api/auth/register

Login

POST /api/auth/login

Logout

POST /api/auth/logout

Get Current User

GET /api/auth/me

Forgot Password

POST /api/auth/forgot-password

Reset Password

POST /api/auth/reset-password

---

👤 User API

GET    /api/users/profile
PUT    /api/users/profile
PUT    /api/users/password
DELETE /api/users/account

---

🚗 Car API

GET    /api/cars
GET    /api/cars/:id
POST   /api/cars
PUT    /api/cars/:id
DELETE /api/cars/:id

Search Cars

GET /api/cars?search=BMW

Filter Cars

GET /api/cars?brand=BMW&category=SUV

Available Cars

GET /api/cars/available

---

📅 Booking API

POST   /api/bookings
GET    /api/bookings
GET    /api/bookings/:id
PUT    /api/bookings/:id
DELETE /api/bookings/:id

Booking Flow

Customer
   ↓
Select Car
   ↓
Select Pickup Location
   ↓
Select Return Location
   ↓
Select Date & Time
   ↓
Check Availability
   ↓
Calculate Rental Price
   ↓
Apply Coupon
   ↓
Select Insurance
   ↓
Create Booking
   ↓
Payment
   ↓
Booking Confirmation

---

💳 Payment API

POST /api/payments/create-order
POST /api/payments/verify
POST /api/payments/stripe
GET  /api/payments/:id

Supported payment gateways:

- Razorpay
- Stripe

---

⭐ Review API

POST   /api/reviews
GET    /api/reviews/car/:carId
PUT    /api/reviews/:id
DELETE /api/reviews/:id

Customers can:

- Give rating
- Write review
- Edit review
- Delete review

---

❤️ Wishlist API

GET    /api/wishlist
POST   /api/wishlist/:carId
DELETE /api/wishlist/:carId

---

🎟️ Coupon API

GET  /api/coupons
POST /api/coupons
POST /api/coupons/apply
PUT  /api/coupons/:id
DELETE /api/coupons/:id

Coupon features:

- Percentage discount
- Fixed discount
- Minimum booking amount
- Expiry date
- Usage limit
- Active/inactive status

---

📍 Location API

GET    /api/locations
POST   /api/locations
PUT    /api/locations/:id
DELETE /api/locations/:id

---

🛡️ Insurance API

GET    /api/insurance
POST   /api/insurance
PUT    /api/insurance/:id
DELETE /api/insurance/:id

---

🔔 Notification API

GET    /api/notifications
PUT    /api/notifications/:id/read
PUT    /api/notifications/read-all
DELETE /api/notifications/:id

---

📊 Admin Dashboard

Admin dashboard provides:

- Total users
- Total cars
- Total bookings
- Total revenue
- Pending bookings
- Completed bookings
- Cancelled bookings
- Available cars
- Rented cars
- Monthly revenue
- Booking statistics

Example:

GET /api/dashboard

---

📈 Reports API

GET /api/reports/revenue
GET /api/reports/bookings
GET /api/reports/users
GET /api/reports/cars

---

🛠️ Support API

POST /api/support
GET  /api/support
PUT  /api/support/:id

---

🖼️ Image Upload

Car images can be uploaded using:

Multer → Cloudinary

Supported operations:

- Upload car image
- Update car image
- Delete car image
- Upload user profile image
- Upload documents

---

📧 Email System

Email notifications can be sent for:

- Registration
- Login
- Password reset
- Booking confirmation
- Booking cancellation
- Payment confirmation
- Invoice
- Contact/support response

---

🧾 Invoice

After successful booking/payment, the system can generate an invoice.

Invoice contains:

- Customer name
- Booking ID
- Car details
- Pickup date
- Return date
- Rental days
- Base price
- Insurance
- Discount
- Tax
- Total amount
- Payment status

---

🔒 Security

The backend uses:

- JWT authentication
- Password hashing
- Role-based authorization
- Helmet
- CORS
- Rate limiting
- Request validation
- Error handling
- Secure environment variables

Passwords are never stored as plain text.

---

👥 User Roles

Customer

CUSTOMER

Can:

- Browse cars
- Book cars
- Make payments
- Manage profile
- Wishlist
- Reviews
- View bookings

Admin

ADMIN

Can:

- Manage cars
- Manage users
- Manage bookings
- Manage payments
- Manage coupons
- Manage insurance
- Manage reports
- Manage dashboard

---

🔄 Booking Status

PENDING
CONFIRMED
ONGOING
COMPLETED
CANCELLED
REJECTED

---

💰 Payment Status

PENDING
PROCESSING
PAID
FAILED
REFUNDED

---

🚘 Car Status

AVAILABLE
BOOKED
RENTED
MAINTENANCE
INACTIVE

---

🧮 Rental Price Calculation

Basic calculation:

Rental Days × Daily Price

Example:

Daily Price = ₹2,000

Rental Days = 3

Base Price = ₹2,000 × 3
           = ₹6,000

Additional charges can include:

Base Price
+ Insurance
+ Extra Services
+ Taxes
- Coupon Discount
-------------------
Final Amount

---

🧪 Testing

Run tests using:

npm test

Test files:

tests/
├── auth.test.js
├── car.test.js
├── booking.test.js
└── payment.test.js

---

🌱 Database Seeding

Seed admin:

node scripts/seedAdmin.js

Seed cars:

node scripts/seedCars.js

Seed complete database:

node scripts/seedDatabase.js

---

📚 API Documentation

Swagger documentation:

docs/swagger.json

The API documentation contains:

- Endpoints
- Request methods
- Parameters
- Request body
- Authentication
- Response structure
- Error responses

---

🧱 Backend Architecture

Client / Frontend
       ↓
     Routes
       ↓
   Middleware
       ↓
  Controllers
       ↓
    Services
       ↓
     Models
       ↓
    MongoDB

Additional layers:

Validators
Utils
Config
Services
Middleware

---

📦 Main Dependencies

Example dependencies:

npm install express mongoose dotenv cors bcryptjs jsonwebtoken

npm install multer cloudinary

npm install razorpay stripe

npm install nodemailer helmet compression

npm install express-validator express-rate-limit cookie-parser morgan

Development:

npm install -D nodemon

---

📜 NPM Scripts

Recommended "package.json" scripts:

{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest --runInBand"
  }
}

---

🌐 Frontend Connection

Frontend development server:

http://localhost:5173

Backend:

http://localhost:5000

API:

http://localhost:5000/api

Frontend API configuration should point to:

VITE_API_URL=http://localhost:5000/api

---

🛠️ Development Workflow

1. Start MongoDB
       ↓
2. Start Backend
       ↓
3. Start Frontend
       ↓
4. Login/Register
       ↓
5. Browse Cars
       ↓
6. Select Car
       ↓
7. Create Booking
       ↓
8. Payment
       ↓
9. Confirmation
       ↓
10. Admin Management

---

🚀 Deployment

Backend can be deployed on services such as:

- Render
- Railway
- AWS
- DigitalOcean
- VPS

MongoDB can be hosted using:

- MongoDB Atlas

Frontend can be deployed using:

- Vercel
- Netlify

---

🔐 Production Checklist

Before deployment:

- [ ] Set "NODE_ENV=production"
- [ ] Configure MongoDB Atlas
- [ ] Set strong JWT secret
- [ ] Configure Cloudinary
- [ ] Configure Razorpay
- [ ] Configure Stripe
- [ ] Configure email service
- [ ] Configure CORS
- [ ] Configure frontend URL
- [ ] Remove sensitive credentials from Git
- [ ] Add ".env" to ".gitignore"
- [ ] Test authentication
- [ ] Test booking
- [ ] Test payment
- [ ] Test image upload
- [ ] Test admin APIs

---

🐛 Error Handling

The backend uses centralized error handling.

Typical response:

{
  "success": false,
  "message": "Something went wrong"
}

Successful response:

{
  "success": true,
  "message": "Operation successful",
  "data": {}
}

---

📌 Git Setup

Initialize Git:

git init

Add files:

git add .

Commit:

git commit -m "Initial Car Rental Backend"

Add remote:

git remote add origin <your-github-url>

Push:

git push -u origin main

---

⚠️ Environment Security

Never commit:

.env

Your ".gitignore" should contain:

node_modules/
.env
uploads/*
logs/*
*.log

---

📄 License

This project is developed for educational, portfolio, and commercial application purposes.

---

👨‍💻 Author

Car Rental Software

Full Stack MERN Car Rental Management System.

Technologies:

React
Node.js
Express.js
MongoDB
Mongoose
JWT
Razorpay
Stripe
Cloudinary

---

⭐ Project Goal

The goal of this project is to build a professional, scalable, secure, and production-ready Car Rental Management System with complete customer and admin functionality.

Car Rental Software
        │
        ├── Customer
        │   ├── Authentication
        │   ├── Car Search
        │   ├── Booking
        │   ├── Payment
        │   ├── Wishlist
        │   ├── Reviews
        │   └── Notifications
        │
        └── Admin
            ├── Dashboard
            ├── Cars
            ├── Users
            ├── Bookings
            ├── Payments
            ├── Coupons
            ├── Insurance
            └── Reports