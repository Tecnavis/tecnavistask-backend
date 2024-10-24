# WAREHOUSE

## Description
A Node.js backend application that uses MongoDB for database management.

## Features
- Authentication, CRUD operations, etc.
- RESTful API for data interaction.

## Prerequisites
Before running this project, ensure that you have the following installed:
- **Node.js**: [Download Node.js](https://nodejs.org)

## Setup Instructions

### Clone the repository:
```bash
git clone https://github.com/NarjishaK/warehouse-backend.git
```

Install dependencies:
```bash
npm install
```

Set up environment variables:

PORT=3000
MONGO_URI=mongodb://localhost:27017/warehouse
JWT_SECRET=your_jwt_secret_key

Start MongoDB server:

```bash
mongod
```

Run the application:

```bash
npm start
```

The application will be running on http://localhost:3000/

Project Structure
.
├── controllers/   # API route logic
├── models/        # Mongoose models for MongoDB
├── routes/        # Route definitions
├── config/        # Database configuration
├── middleware/    # Custom middleware (e.g., auth)
├── .env           # Environment variables
├── server.js      # Application entry point
└── package.json   # Project metadata and dependencies



Technologies Used
Node.js: Backend runtime environment.
Express: Web framework for Node.js.
MongoDB: NoSQL database.
Mongoose: ODM library for MongoDB.
JWT: For user authentication.