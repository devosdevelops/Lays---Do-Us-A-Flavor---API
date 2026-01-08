# Lay's "Do Us A Flavor" API

Backend API for the Lay's flavor design contest. Users submit custom flavor and bag designs, vote on submissions, and admins manage the platform.

## Project Structure

```
src/
├── app.js
├── server.js
├── config/
│   └── db.js
├── controllers/
│   ├── userController.js
│   ├── submissionController.js
│   ├── voteController.js
│   └── adminController.js
├── middleware/
│   ├── auth.js
│   └── errorHandler.js
├── models/
│   ├── Placeholder.js       # User model
│   ├── Submission.js
│   └── Vote.js
├── routes/
│   ├── index.js
│   ├── users.js
│   ├── submissions.js
│   ├── votes.js
│   └── admin.js
└── utils/
    └── logger.js
```

## Stack

- Node.js with ES modules
- Express.js
- MongoDB Atlas
- JWT authentication
- bcrypt password hashing

## Setup

1. Install dependencies
```bash
npm install
```

2. Configure environment variables in `.env`:
```env
PORT=3000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
```

3. Start the server
```bash
npm start
```

Server runs on `http://localhost:3000`

## API Routes

### Authentication
- `POST /api/users/register` - Create account
- `POST /api/users/login` - Login
- `GET /api/users/profile` - Get profile (protected)

### Submissions
- `POST /api/submissions` - Create submission (protected)
- `GET /api/submissions` - List all submissions
- `GET /api/submissions/my` - Get user's submissions (protected)
- `DELETE /api/submissions/:id` - Delete submission (protected, ownership required)

### Voting
- `POST /api/votes` - Vote on submission (protected, no duplicates)
- `GET /api/votes/:submissionId` - Get vote count for submission
- `GET /api/votes` - Get all votes (admin only)

### Admin
- `GET /api/admin/users` - List all users (admin only)
- `POST /api/admin/users/:userId/ban` - Ban user (admin only)
- `GET /api/admin/submissions` - List all submissions (admin only)
- `DELETE /api/admin/submissions/:id` - Delete submission (admin only)

## Authentication

Protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

Admin routes additionally check the `isAdmin` flag in the token.

## Database

Uses MongoDB Atlas with Mongoose schemas for Users, Submissions, and Votes. User passwords are hashed with bcrypt before storage. JWT tokens expire after 7 days.

## Deployment

For Render deployment, set these environment variables:
- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
