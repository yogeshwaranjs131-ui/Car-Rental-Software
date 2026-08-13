 Car Rental Software Frontend structure-

my-Car/frontend/README.md

 paste.

# 🚗 Car Rental Software - Frontend

A modern, responsive, and user-friendly **Car Rental Management System Frontend** built using **React.js, Vite, JavaScript, CSS, and REST APIs**.

This application allows customers to search and rent cars, manage bookings, make payments, maintain wishlists, submit reviews, and manage their profiles.

It also provides a complete Admin Dashboard for managing cars, users, bookings, payments, coupons, reports, and notifications.

---

# 📌 Project Overview

The Car Rental Software provides two major interfaces:

## 👤 Customer Application

Customers can:

- Register
- Login
- Logout
- Search cars
- Filter cars
- View car details
- View car images
- Select rental dates
- Select pickup location
- Select return location
- Book cars
- Apply coupons
- Select insurance
- Make payments
- View booking history
- Cancel bookings
- Add cars to wishlist
- Remove cars from wishlist
- Give ratings and reviews
- Manage profile
- Receive notifications
- Contact support

## 👨‍💼 Admin Dashboard

Administrators can:

- View dashboard
- Add cars
- Edit cars
- Delete cars
- Manage cars
- Manage bookings
- Manage users
- Manage payments
- Manage coupons
- Manage notifications
- View reports
- Manage settings
- Manage admin profile

---

# 🚀 Technologies Used

## Frontend

- React.js
- JavaScript
- Vite
- HTML5
- CSS3

## UI

- Responsive Design
- CSS
- Bootstrap / Tailwind CSS
- React Icons

## Routing

- React Router DOM

## API

- Axios
- REST API

## State Management

- React Context API
- Custom Hooks

## Authentication

- JWT
- Protected Routes
- Role-based Routes

## Payment

- Razorpay
- Stripe

---

# 📁 Frontend Folder Structure

```text
frontend/
│
├── public/
│   ├── favicon.ico
│   ├── logo.png
│   ├── robots.txt
│   ├── manifest.json
│   └── images/
│       ├── banner/
│       ├── cars/
│       └── icons/
│
├── src/
│   │
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   ├── videos/
│   │   ├── fonts/
│   │   └── styles/
│   │       ├── global.css
│   │       ├── variables.css
│   │       └── responsive.css
│   │
│   ├── components/
│   │   │
│   │   ├── common/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── Pagination.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── cars/
│   │   │   ├── CarCard.jsx
│   │   │   ├── CarList.jsx
│   │   │   ├── CarDetails.jsx
│   │   │   ├── CarFilter.jsx
│   │   │   └── CarGallery.jsx
│   │   │
│   │   ├── booking/
│   │   │   ├── BookingCard.jsx
│   │   │   ├── BookingForm.jsx
│   │   │   └── BookingSummary.jsx
│   │   │
│   │   └── payment/
│   │       ├── PaymentForm.jsx
│   │       └── PaymentSuccess.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── ResetPassword.jsx
│   │   ├── Cars.jsx
│   │   ├── CarDetails.jsx
│   │   ├── Booking.jsx
│   │   ├── MyBookings.jsx
│   │   ├── Wishlist.jsx
│   │   ├── Profile.jsx
│   │   ├── Contact.jsx
│   │   ├── About.jsx
│   │   ├── FAQ.jsx
│   │   ├── PrivacyPolicy.jsx
│   │   ├── Terms.jsx
│   │   └── NotFound.jsx
│   │
│   ├── admin/
│   │   ├── Dashboard.jsx
│   │   ├── AddCar.jsx
│   │   ├── EditCar.jsx
│   │   ├── ManageCars.jsx
│   │   ├── ManageBookings.jsx
│   │   ├── ManageUsers.jsx
│   │   ├── Payments.jsx
│   │   ├── Reports.jsx
│   │   ├── Coupons.jsx
│   │   ├── Notifications.jsx
│   │   ├── Settings.jsx
│   │   └── Profile.jsx
│   │
│   ├── layouts/
│   │   ├── MainLayout.jsx
│   │   ├── AdminLayout.jsx
│   │   └── AuthLayout.jsx
│   │
│   ├── routes/
│   │   ├── AppRoutes.jsx
│   │   ├── UserRoutes.jsx
│   │   └── AdminRoutes.jsx
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   ├── BookingContext.jsx
│   │   └── ThemeContext.jsx
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useBooking.js
│   │   ├── useCars.js
│   │   └── useDebounce.js
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── carService.js
│   │   ├── bookingService.js
│   │   ├── paymentService.js
│   │   ├── userService.js
│   │   └── adminService.js
│   │
│   ├── utils/
│   │   ├── formatDate.js
│   │   ├── formatCurrency.js
│   │   ├── validators.js
│   │   ├── constants.js
│   │   └── storage.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .env
├── .gitignore
├── package.json
├── vite.config.js
└── README.md


---

⚙️ Installation

1. Navigate to Frontend

cd frontend

2. Install Dependencies

npm install


---

📦 Install Required Packages

React Router

npm install react-router-dom

Axios

npm install axios

React Icons

npm install react-icons

Payment

npm install @stripe/stripe-js

For Razorpay, the checkout script can be loaded through the application when required.


---

🔐 Environment Variables

Create:

frontend/.env

Add:

VITE_API_URL=https://car-rental-software.onrender.com/api

For production:

VITE_API_URL=https://your-backend-url.com/api


---

▶️ Run Frontend

Start development server:

npm run dev

Vite will normally run the application at:

http://localhost:5173


---

🏗️ Build for Production

npm run build

Preview production build:

npm run preview


---

🔗 Backend Connection

Frontend communicates with the backend through REST APIs.

Frontend
   ↓
Axios
   ↓
REST API
   ↓
Express.js
   ↓
MongoDB

Backend URL:

https://car-rental-software.onrender.com

API URL:

https://car-rental-software.onrender.com/api

Frontend .env:

VITE_API_URL=https://car-rental-software.onrender.com/api


---

🔐 Authentication Flow

User
 ↓
Register
 ↓
Login
 ↓
Backend validates credentials
 ↓
JWT Token
 ↓
Token stored securely
 ↓
Protected Routes
 ↓
Dashboard / Booking / Profile


---

👤 Customer Pages

Home

/

Features:

Hero banner

Search cars

Popular cars

Featured cars

Rental benefits

Customer reviews

FAQ

Footer



---

Login

/login


---

Register

/register


---

Cars

/cars

Features:

Search

Filter

Sort

Pagination

Car cards



---

Car Details

/cars/:id

Features:

Car gallery

Car information

Price

Features

Availability

Reviews

Book Now



---

Booking

/booking/:carId

Booking includes:

Pickup date

Return date

Pickup location

Return location

Insurance

Coupon

Price calculation

Payment



---

My Bookings

/my-bookings

Customers can:

View bookings

View booking details

Cancel booking

View payment status



---

Wishlist

/wishlist


---

Profile

/profile


---

👨‍💼 Admin Dashboard

Admin routes are protected.

/admin


---

📊 Admin Features

Dashboard

/admin/dashboard

Displays:

Total Users

Total Cars

Total Bookings

Total Revenue

Pending Bookings

Completed Bookings

Cancelled Bookings



---

Manage Cars

/admin/cars

Admin can:

Add car

Edit car

Delete car

Change availability

Upload images



---

Add Car

/admin/cars/add

Car information:

Brand

Model

Category

Year

Price

Seats

Fuel type

Transmission

Location

Images

Features

Description



---

Manage Bookings

/admin/bookings

Admin can:

View bookings

Confirm bookings

Reject bookings

Cancel bookings

Complete bookings



---

Manage Users

/admin/users


---

Payments

/admin/payments


---

Reports

/admin/reports

Reports can display:

Revenue

Bookings

Users

Cars

Monthly statistics



---

🧩 Component Architecture

Reusable components are stored inside:

src/components/

Example:

Navbar
Footer
Button
Modal
Input
Loader
Pagination

This avoids duplicate code.


---

🚗 Car Component Flow

Cars.jsx
   ↓
CarList.jsx
   ↓
CarCard.jsx
   ↓
CarDetails.jsx
   ↓
BookingForm.jsx


---

📅 Booking Flow

Car Details
     ↓
Book Now
     ↓
Booking Form
     ↓
Select Dates
     ↓
Select Location
     ↓
Insurance
     ↓
Coupon
     ↓
Booking Summary
     ↓
Payment
     ↓
Payment Success


---

💳 Payment Flow

Booking
   ↓
Payment Form
   ↓
Create Payment Order
   ↓
Razorpay / Stripe
   ↓
Payment
   ↓
Verify Payment
   ↓
Booking Confirmation
   ↓
Payment Success


---

❤️ Wishlist Flow

Car Card
   ↓
Wishlist Button
   ↓
Wishlist API
   ↓
Wishlist Context
   ↓
Wishlist Page


---

🧠 Context API

AuthContext

Handles:

Login

Logout

Register

Current user

Authentication state


BookingContext

Handles:

Selected car

Rental dates

Location

Booking information


CartContext

Handles temporary selected rental information if needed.

ThemeContext

Handles:

Light mode

Dark mode

Theme preferences



---

🪝 Custom Hooks

useAuth

const { user, login, logout } = useAuth();

useCars

Used for:

Fetching cars

Searching

Filtering


useBooking

Used for:

Booking state

Booking operations


useDebounce

Used for:

Search optimization

Reducing unnecessary API requests



---

🔌 Services

API-related code is separated into service files.

services/
├── api.js
├── authService.js
├── carService.js
├── bookingService.js
├── paymentService.js
├── userService.js
└── adminService.js

Example:

carService.getCars()


---

🛡️ Protected Routes

Customers must login before accessing:

/my-bookings
/wishlist
/profile
/booking

Admins must have admin privileges before accessing:

/admin/*


---

📱 Responsive Design

The application should support:

Mobile

Tablet

Laptop

Desktop

Large screens


Responsive CSS:

src/assets/styles/responsive.css


---

🎨 Styling

Global styling:

src/assets/styles/global.css

CSS variables:

src/assets/styles/variables.css

Responsive styling:

src/assets/styles/responsive.css


---

📅 Date & Currency Utilities

Date formatting:

src/utils/formatDate.js

Currency formatting:

src/utils/formatCurrency.js

Example:

₹2,500
₹5,000
₹10,000


---

✅ Form Validation

Validation utilities:

src/utils/validators.js

Validates:

Name

Email

Phone

Password

Dates

Booking information

Payment information



---

💾 Local Storage

Storage utility:

src/utils/storage.js

Used for application preferences and non-sensitive client-side state where appropriate.

Authentication/session handling should follow the backend's security design.


---

📡 API Error Handling

The frontend should handle:

400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
500 Server Error

Example:

Something went wrong.
Please try again.


---

⏳ Loading States

The application uses:

Loader.jsx

for:

API requests

Car loading

Booking loading

Payment loading

Dashboard loading



---

❌ Error Pages

Not Found:

/404

Component:

src/pages/NotFound.jsx


---

🧪 Testing

Recommended frontend testing tools:

Jest

React Testing Library

Vitest


Example future test structure:

src/
└── tests/
    ├── Login.test.jsx
    ├── Cars.test.jsx
    ├── Booking.test.jsx
    └── Payment.test.jsx


---

🔄 Application Flow

Car Rental Software
                           │
             ┌─────────────┴─────────────┐
             │                           │
         Customer                     Admin
             │                           │
       Authentication              Admin Login
             │                           │
        Browse Cars                 Dashboard
             │                           │
       Car Details              Manage Cars
             │                           │
         Booking                 Manage Users
             │                           │
         Payment                Manage Bookings
             │                           │
        Confirmation             Payments
             │                           │
        My Bookings               Reports
             │                           │
        Wishlist                  Coupons
             │                           │
          Review                 Settings


---

📦 Recommended Package.json Scripts

{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}


---

🛠️ Development Workflow

1. Start MongoDB
       ↓
2. Start Backend
       ↓
3. Start Frontend
       ↓
4. Open Browser
       ↓
5. Register/Login
       ↓
6. Browse Cars
       ↓
7. Select Car
       ↓
8. Select Rental Dates
       ↓
9. Create Booking
       ↓
10. Payment
       ↓
11. Booking Confirmation


---

🚀 Production Deployment

Frontend can be deployed on:

Vercel

Netlify

AWS

Cloudflare Pages


Before deployment:

npm run build

The production files will be generated inside:

dist/


---

🔐 Production Environment

Production .env example:

VITE_API_URL=https://your-production-backend.com/api

Do not put private backend secrets inside frontend environment variables.


---

📌 Git Setup

Initialize Git:

git init

Add files:

git add .

Commit:

git commit -m "Initial Car Rental Frontend"

Add GitHub repository:

git remote add origin <your-github-url>

Push:

git push -u origin main


---

⚠️ .gitignore

Recommended:

node_modules/
dist/
.env
.env.local


---

🔗 Backend & Frontend

┌──────────────────────────────┐
│       React Frontend         │
│       Port: 5173             │
└──────────────┬───────────────┘
               │
               │ Axios / REST API
               ↓
┌──────────────────────────────┐
│      Express Backend         │
│       Port: 5000             │
└──────────────┬───────────────┘
               │
               ↓
┌──────────────────────────────┐
│          MongoDB             │
└──────────────────────────────┘


---

🎯 Project Goals

The frontend is designed to provide:

Professional UI

Responsive design

Easy navigation

Secure authentication

Fast car search

Smooth booking experience

Online payment

Admin management

Reusable components

Scalable architecture

Clean code

REST API integration



---

⭐ Main Features

✅ Authentication
✅ Car Search
✅ Car Filter
✅ Car Details
✅ Car Gallery
✅ Booking
✅ Payment
✅ Wishlist
✅ Reviews
✅ Coupons
✅ Insurance
✅ Notifications
✅ User Profile
✅ Admin Dashboard
✅ Car Management
✅ User Management
✅ Booking Management
✅ Payment Management
✅ Reports
✅ Responsive Design


---

👨‍💻 Author

Car Rental Software

A complete MERN Stack Car Rental Management System.

Technologies

React.js
Vite
JavaScript
Node.js
Express.js
MongoDB
Mongoose
JWT
Axios
Razorpay
Stripe
Cloudinary


---

📄 License

This project is developed for educational, portfolio, and commercial application purposes.


---

⭐ Final Project Architecture

Car Rental Software
│
├── frontend
│   │
│   ├── React
│   ├── Vite
│   ├── Components
│   ├── Pages
│   ├── Admin
│   ├── Context
│   ├── Hooks
│   ├── Services
│   └── Routes
│
└── backend
    │
    ├── Node.js
    ├── Express.js
    ├── MongoDB
    ├── Controllers
    ├── Models
    ├── Routes
    ├── Services
    ├── Middleware
    └── Validators


---

🚗 Car Rental Software

Build → Book → Pay → Drive 🚘