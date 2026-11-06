# MERN Authentication System

A full-stack authentication application built using the MERN stack with secure authentication, Google OAuth integration, and profile management.

## Features

- User Registration
- User Login and Logout
- Password Hashing with bcrypt
- JWT Authentication
- HTTP-only Cookies
- Google OAuth Login and Signup
- Protected Routes
- Persistent Authentication
- User Profile Dashboard
- Profile Update
- Profile Image Upload using Cloudinary
- REST API Integration

## Tech Stack

**Frontend**
- React.js
- Vite
- Tailwind CSS
- React Router
- Axios
- Google OAuth

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Cloudinary
- Multer

## Project Structure

```text
project/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── lib/
│   │   └── pages/
│   └── package.json
│
└── backend/
    ├── controllers/
    ├── models/
    ├── routes/
    ├── middleware/
    ├── utils/
    └── package.json
```

## Installation

### 1. Clone Repository

```bash
git clone YOUR_REPOSITORY_URL
```

### 2. Backend Setup

```bash
cd backend
npm install
npm run dev
```

Create a `.env` file in the backend directory and configure your environment variables.

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=YOUR_BACKEND_API_URL
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
```

## Security

- Passwords are hashed before storage.
- Authentication tokens are handled using HTTP-only cookies.
- Protected routes restrict unauthorized access.
- Google ID tokens are verified by the backend.

## Future Improvements

- Password Reset
- Email Verification
- Account Security Improvements
- Production Deployment

## Author

**Adnan Haider**

- LinkedIn: https://www.linkedin.com/in/adnanhaider-mern-stack-developer/
