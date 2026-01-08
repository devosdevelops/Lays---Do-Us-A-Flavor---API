# Lays "Do Us A Flavor" API

A Node.js Express API for the Lay's "Do Us A Flavor" campaign. Users can design their own flavor and bag design, submit them, and vote on other submissions. Admins can manage users, submissions, and votes.

## Project Structure

```
src/
├── app.js                 # Express app configuration
├── server.js              # Server entry point
├── config/
│   └── db.js              # MongoDB connection
├── controllers/           # Business logic
│   ├── userController.js
│   ├── submissionController.js
│   ├── voteController.js
│   └── adminController.js
├── middleware/            # Express middleware
│   ├── errorHandler.js
│   └── auth.js
├── models/                # Mongoose schemas
│   ├── Placeholder.js     # User model
│   ├── Submission.js
│   └── Vote.js
├── routes/                # API endpoints
│   ├── index.js
│   ├── users.js
│   ├── submissions.js
│   ├── votes.js
│   └── admin.js
└── utils/
    └── logger.js          # Logging utilities
```

## Features (Planned)

### User Accounts
- [x] Create account endpoint (placeholder)
- [ ] Authentication & JWT tokens
- [ ] User profile management

### Submissions
- [x] Create submission endpoint (placeholder)
- [x] Get user submissions endpoint (placeholder)
- [x] Remove submission endpoint (placeholder)
- [ ] Image upload integration (Cloudinary)
- [ ] Edit submissions (nice-to-have)
- [ ] Screenshot export (nice-to-have)

### Voting
- [x] Submit vote endpoint (placeholder)
- [x] Get vote counts endpoint (placeholder)
- [ ] Vote validation (prevent duplicates)
- [ ] Remove vote (nice-to-have)

### Admin Dashboard
- [x] View all users endpoint (placeholder)
- [x] Ban user endpoint (placeholder)
- [x] View all submissions endpoint (placeholder)
- [x] Remove submission endpoint (placeholder)
- [x] View all votes endpoint (placeholder)

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/devosdevelops/Lays---Do-Us-A-Flavor---API.git
cd Lays---Do-Us-A-Flavor---API
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/lays-do-us-a-flavor
JWT_SECRET=your_secret_key_here
```

4. Start the server
```bash
npm start
```

The server will run on `http://localhost:3000`

## API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Users
- `POST /api/users/register` - Create new account
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile

### Submissions
- `POST /api/submissions` - Create submission
- `GET /api/submissions/my` - Get user's submissions
- `GET /api/submissions` - Get all submissions
- `DELETE /api/submissions/:id` - Remove submission
- `PUT /api/submissions/:id` - Edit submission (WIP)
- `GET /api/submissions/:id/export` - Export screenshot (WIP)

### Votes
- `POST /api/votes` - Submit vote
- `GET /api/votes/:submissionId` - Get vote count for submission
- `GET /api/votes` - Get all votes (admin)

### Admin
- `GET /api/admin/users` - View all users
- `POST /api/admin/users/:userId/ban` - Ban user
- `GET /api/admin/submissions` - View all submissions
- `DELETE /api/admin/submissions/:submissionId` - Remove submission
- `GET /api/admin/votes` - View all votes

## Development Notes

All endpoints are currently **placeholders** with TODO comments indicating where business logic should be implemented.

### Next Steps
1. Implement user authentication with JWT
2. Add input validation
3. Implement database operations (CRUD)
4. Add password hashing with bcrypt
5. Implement image upload integration
6. Add comprehensive error handling
7. Set up logging system
8. Add unit and integration tests

### Architecture Decisions
- **ES Modules**: Using modern import/export syntax
- **Modular Structure**: One responsibility per file
- **Environment Variables**: All config via `.env`
- **Placeholder Implementations**: TODO comments guide future development

## Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT Authentication](https://jwt.io/)
- [REST API Design Best Practices](https://restfulapi.net/)

## License

This is a school project for the Lay's "Do Us A Flavor" campaign.

## Related Projects

- **Frontend**: Three.js flavor configurator
- **Admin Dashboard**: Vue-based admin panel
## Usage
Clone the repo, install dependencies, and start building your API logic in the provided structure.# Lays---Do-Us-A-Flavor---API
