# Expense Tracker

A full-stack MERN expense tracking application with JWT authentication, bcrypt password hashing, protected API routes, expense CRUD operations, and a dashboard for spending summaries.

## Tech Stack

- **Frontend:** React, Vite, React Router, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT, bcryptjs

## Features

- User registration and login
- Password hashing with bcrypt
- JWT-based authentication
- Protected frontend routes and backend APIs
- Create, read, update and delete expenses
- Expense categories and dates
- Dashboard with total, monthly and category summaries
- User-specific expense data isolation
- Responsive interface

## Project Structure

```
client/   # React frontend
server/   # Express REST API
```

## Local Setup

### 1. Backend

```bash
cd server
npm install
copy .env.example .env
npm run dev
```

Add your MongoDB connection string and a JWT secret to `.env`.

### 2. Frontend

In another terminal:

```bash
cd client
npm install
npm run dev
```

The frontend runs on the Vite development server and communicates with the API at `http://localhost:5000`.

## API Overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/expenses`
- `POST /api/expenses`
- `PUT /api/expenses/:id`
- `DELETE /api/expenses/:id`
- `GET /api/expenses/summary`

## Environment Variables

See `server/.env.example`. Never commit a real `.env` file or credentials.
