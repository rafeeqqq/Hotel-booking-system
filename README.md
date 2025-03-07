# Hotel Booking System

A full-stack application for hotel booking with web check-in functionality using Aadhaar verification.

## Features

- User registration and authentication
- Browse available hotels
- Book hotels with guest information
- View booking history
- Web check-in with Aadhaar verification
- Responsive UI for all screen sizes

## Tech Stack

### Frontend
- React.js
- React Router for navigation
- Bootstrap for responsive UI
- Axios for API calls

### Backend
- Node.js with Express
- PostgreSQL database
- Prisma ORM for database operations
- JWT for authentication

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL database

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up your PostgreSQL database and update the `.env` file with your database connection string.

4. Run Prisma migrations to create database tables:
   ```
   npx prisma migrate dev --name init
   ```

5. Seed the database with initial hotel data:
   ```
   npm run db:seed
   ```

6. Start the backend server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm start
   ```

## Usage Flow

1. Register a new user account
2. Browse available hotels
3. Select a hotel and book it by providing check-in/check-out dates and guest information
4. View your bookings in the "My Bookings" section
5. Complete web check-in by providing Aadhaar numbers for all guests

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user info

### Hotels
- `GET /api/hotels` - Get all hotels
- `GET /api/hotels/:id` - Get hotel by ID

### Bookings
- `GET /api/bookings` - Get all bookings for the logged-in user
- `GET /api/bookings/:id` - Get booking by ID
- `POST /api/bookings` - Create a new booking
- `PUT /api/bookings/:id/check-in` - Complete web check-in
- `PUT /api/bookings/:id/cancel` - Cancel a booking
