# Lay's "Do Us A Flavor" API & Database Documentation

## Overview

This is the backend API for the Lay's flavor design contest. The API handles user authentication, flavor submissions, voting, and admin management.

**Base URL (Production):** `https://lays-do-us-a-flavor-api.onrender.com`  
**Base URL (Local Development):** `http://localhost:3000`

---

## Authentication

All protected routes require a **Bearer token** in the Authorization header.

### Getting a Token

1. Register a new account: `POST /api/users/register`
2. Login with credentials: `POST /api/users/login`
3. Use the returned `token` in all subsequent requests

### Using the Token

```
Authorization: Bearer <token>
```

### Token Details

- **Expires:** 7 days from issue
- **Payload:**
  - `userId` - User's MongoDB ID
  - `username` - Username
  - `isAdmin` - Boolean (true for admin accounts)
  - `iat` - Issued at timestamp
  - `exp` - Expiration timestamp

---

## Data Models

### User

```json
{
  "_id": "ObjectId",
  "username": "string (unique)",
  "email": "string (unique)",
  "password": "string (bcrypt hashed)",
  "isBanned": "boolean (default: false)",
  "isAdmin": "boolean (default: false)",
  "createdAt": "date"
}
```

**Notes:**
- Passwords are hashed with bcrypt before storage
- Banned users cannot login
- Admin accounts can access admin endpoints

### Submission

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (reference to User)",
  "flavorName": "string (2-100 characters)",
  "bagColor": "string (hex color code, e.g. #FF5733)",
  "fontChoice": "string (design choice)",
  "keyFlavors": "array of strings (optional)",
  "voteCount": "number (auto-incremented)",
  "createdAt": "date",
  "updatedAt": "date"
}
```

**Notes:**
- Each user can submit multiple flavors
- Vote count updates automatically when votes are cast
- Hex color format is required for bagColor

### Vote

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (reference to User)",
  "submissionId": "ObjectId (reference to Submission)",
  "createdAt": "date"
}
```

**Constraints:**
- Unique compound index on `(userId, submissionId)` - users can only vote once per submission
- Votes cannot be duplicated

---

## API Endpoints

### Health Check

#### `GET /api/health`

Quick endpoint to verify API is running.

**Response:**
```json
{ "status": "ok" }
```

---

### Users

#### `POST /api/users/register`

Create a new user account.

**Request Body:**
```json
{
  "username": "string (required)",
  "email": "string (required, valid email)",
  "password": "string (required, min 6 characters)"
}
```

**Response (201):**
```json
{
  "_id": "ObjectId",
  "username": "string",
  "email": "string",
  "createdAt": "date"
}
```

**Error Responses:**
- `400` - Missing fields or invalid input
- `409` - Username or email already exists

---

#### `POST /api/users/login`

Login with username and password to get JWT token.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "token": "jwt_token_string",
  "user": {
    "_id": "ObjectId",
    "username": "string",
    "email": "string",
    "createdAt": "date"
  }
}
```

**Error Responses:**
- `400` - Missing username or password
- `401` - Invalid credentials or user account has been banned

---

#### `GET /api/users/profile`

Get authenticated user's profile. **Protected route - requires valid token.**

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "_id": "ObjectId",
  "username": "string",
  "email": "string",
  "isBanned": "boolean",
  "createdAt": "date"
}
```

**Error Responses:**
- `401` - Missing or invalid token

---

### Submissions

#### `POST /api/submissions`

Create a new flavor submission. **Protected route - requires valid token.**

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "flavorName": "string (required, 2-100 characters)",
  "bagColor": "string (required, hex color code)",
  "fontChoice": "string (required)",
  "keyFlavors": ["string", "string"] (optional array)
}
```

**Response (201):**
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "flavorName": "string",
  "bagColor": "string",
  "fontChoice": "string",
  "keyFlavors": ["string"],
  "voteCount": 0,
  "createdAt": "date",
  "updatedAt": "date"
}
```

**Error Responses:**
- `400` - Missing required fields or invalid input
- `401` - Missing or invalid token

---

#### `GET /api/submissions`

Get all submissions. **Public route - no authentication required.**

**Query Parameters:**
- None (returns all submissions sorted by newest first)

**Response (200):**
```json
[
  {
    "_id": "ObjectId",
    "userId": "ObjectId",
    "flavorName": "string",
    "bagColor": "string",
    "fontChoice": "string",
    "keyFlavors": ["string"],
    "voteCount": "number",
    "createdAt": "date",
    "updatedAt": "date"
  }
]
```

---

#### `GET /api/submissions/my`

Get current user's submissions. **Protected route - requires valid token.**

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "_id": "ObjectId",
    "userId": "ObjectId",
    "flavorName": "string",
    "bagColor": "string",
    "fontChoice": "string",
    "keyFlavors": ["string"],
    "voteCount": "number",
    "createdAt": "date",
    "updatedAt": "date"
  }
]
```

**Error Responses:**
- `401` - Missing or invalid token

---

#### `DELETE /api/submissions/:id`

Delete a submission (user can only delete their own). **Protected route - requires valid token.**

**URL Parameters:**
- `id` - Submission MongoDB ID

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Submission removed successfully",
  "_id": "ObjectId"
}
```

**Error Responses:**
- `401` - Missing or invalid token
- `403` - User does not own this submission
- `404` - Submission not found

---

### Votes

#### `POST /api/votes`

Vote on a submission. Each user can only vote once per submission. **Protected route - requires valid token.**

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "submissionId": "ObjectId (required)"
}
```

**Response (201):**
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "submissionId": "ObjectId",
  "createdAt": "date"
}
```

**Error Responses:**
- `400` - Missing submissionId
- `401` - Missing or invalid token
- `404` - Submission not found
- `409` - User has already voted on this submission

---

#### `GET /api/votes/:submissionId`

Get vote count for a specific submission. **Public route - no authentication required.**

**URL Parameters:**
- `submissionId` - Submission MongoDB ID

**Response (200):**
```json
{
  "submissionId": "ObjectId",
  "voteCount": "number",
  "createdAt": "date",
  "updatedAt": "date"
}
```

**Error Responses:**
- `404` - Submission not found

---

#### `GET /api/votes`

Get all votes in the system with user and submission details. **Admin only route - requires valid admin token.**

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
[
  {
    "_id": "ObjectId",
    "userId": {
      "_id": "ObjectId",
      "username": "string",
      "email": "string"
    },
    "submissionId": {
      "_id": "ObjectId",
      "flavorName": "string",
      "bagColor": "string",
      "voteCount": "number"
    },
    "createdAt": "date"
  }
]
```

**Error Responses:**
- `401` - Missing or invalid token
- `403` - User is not an admin

---

### Admin Routes

All admin routes require a valid token with `isAdmin: true` in the JWT payload.

#### `GET /api/admin/users`

Get all users with basic info. **Admin only.**

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
[
  {
    "_id": "ObjectId",
    "username": "string",
    "email": "string",
    "isBanned": "boolean",
    "isAdmin": "boolean",
    "createdAt": "date"
  }
]
```

**Error Responses:**
- `401` - Missing or invalid token
- `403` - User is not an admin

---

#### `POST /api/admin/users/:userId/ban`

Ban a user (prevents login). **Admin only.**

**URL Parameters:**
- `userId` - User's MongoDB ID

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "message": "User banned successfully",
  "user": {
    "_id": "ObjectId",
    "username": "string",
    "email": "string",
    "isBanned": true,
    "isAdmin": "boolean",
    "createdAt": "date"
  }
}
```

**Error Responses:**
- `400` - Cannot ban admin account or user is already banned
- `401` - Missing or invalid token
- `403` - User is not an admin
- `404` - User not found

---

#### `GET /api/admin/submissions`

Get all submissions with user details populated. **Admin only.**

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
[
  {
    "_id": "ObjectId",
    "userId": {
      "_id": "ObjectId",
      "username": "string",
      "email": "string",
      "isBanned": "boolean"
    },
    "flavorName": "string",
    "bagColor": "string",
    "fontChoice": "string",
    "keyFlavors": ["string"],
    "voteCount": "number",
    "createdAt": "date",
    "updatedAt": "date"
  }
]
```

**Error Responses:**
- `401` - Missing or invalid token
- `403` - User is not an admin

---

#### `DELETE /api/admin/submissions/:submissionId`

Remove a submission (admin enforcement). **Admin only.**

**URL Parameters:**
- `submissionId` - Submission's MongoDB ID

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "message": "Submission removed successfully",
  "_id": "ObjectId"
}
```

**Error Responses:**
- `401` - Missing or invalid token
- `403` - User is not an admin
- `404` - Submission not found

---

## Error Handling

All errors follow a consistent format:

```json
{
  "error": "error message string"
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad request (invalid input, missing fields)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not found (resource doesn't exist)
- `409` - Conflict (duplicate vote, duplicate user, etc.)
- `500` - Server error

---

## Important Notes for Integrators

### Password Requirements
- Minimum 6 characters
- Must be stored as plain text in requests (HTTPS in production)
- Will be hashed with bcrypt (10 salt rounds) before database storage

### Username & Email Constraints
- Usernames and emails must be unique
- Cannot register with duplicate username or email
- Case-sensitive

### Vote Deduplication
- Users can only vote once per submission
- Attempting to vote twice on the same submission returns `409 Conflict`
- Check `GET /api/votes/:submissionId` to see current vote count before voting

### Banned Users
- Banned users receive `401 Invalid credentials` error on login attempt
- Admins can ban/unban users via admin endpoints
- Cannot ban admin accounts

### Admin Accounts
- Only accounts with `isAdmin: true` can access admin endpoints
- Admin flag is included in JWT token payload
- Used for role-based access control

### Submission Ownership
- Users can only delete their own submissions
- Deleting a submission does not delete associated votes
- Vote count is maintained even after user deletion

### Hex Color Validation
- `bagColor` must be valid hex format (e.g., `#FF5733`)
- Include the `#` prefix
- Case-insensitive (both `#ff5733` and `#FF5733` are valid)

### Development Admin Account

For testing purposes, an admin account is available:
- **Username:** `admin`
- **Email:** `admin@admin.com`
- **Password:** `Admin123`

This account has `isAdmin: true` and can access all admin endpoints.

---

## Request/Response Examples

### Complete User Flow Example

**1. Register**
```bash
curl -X POST https://lays-do-us-a-flavor-api.onrender.com/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "flavordesigner",
    "email": "designer@example.com",
    "password": "MyPassword123"
  }'
```

**2. Login**
```bash
curl -X POST https://lays-do-us-a-flavor-api.onrender.com/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "flavordesigner",
    "password": "MyPassword123"
  }'
```
*Response includes token to use in Authorization header*

**3. Create Submission**
```bash
curl -X POST https://lays-do-us-a-flavor-api.onrender.com/api/submissions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token_from_login>" \
  -d '{
    "flavorName": "Spicy Lime Blaze",
    "bagColor": "#FF5733",
    "fontChoice": "Bold",
    "keyFlavors": ["spicy", "lime", "hot"]
  }'
```

**4. Vote on Submission**
```bash
curl -X POST https://lays-do-us-a-flavor-api.onrender.com/api/votes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token_from_login>" \
  -d '{
    "submissionId": "<submission_id_from_step_3>"
  }'
```

**5. Check Vote Count**
```bash
curl https://lays-do-us-a-flavor-api.onrender.com/api/votes/<submission_id>
```

---

## Database Connection Details

**Provider:** MongoDB Atlas (Cloud)  
**Database Name:** `lays-do-us-a-flavor`  
**Collections:**
- `users` - User accounts
- `submissions` - Flavor submissions
- `votes` - User votes

**Indexes:**
- `users`: unique on `username`, unique on `email`
- `votes`: unique compound on `(userId, submissionId)`

---

## Environment Variables Required

```
PORT=3000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<secure_random_string>
```

---

## Rate Limiting

Currently no rate limiting is implemented. For production, consider adding:
- Request rate limits per IP
- Vote submission limits per user per day
- Registration limits per IP

---

## Support & Debugging

### Common Issues

**Token Expired?**
- Tokens expire after 7 days
- Re-login to get a new token

**Duplicate Vote Error?**
- Check if user already voted on that submission
- Use `GET /api/votes/:submissionId` to verify

**Cannot Delete Submission?**
- Verify you own the submission
- User ID in token must match submission `userId`

**Admin Route Returns 403?**
- Verify the token is for an admin account
- Check that `isAdmin: true` in JWT payload

---

## Version

**API Version:** 1.0  
**Last Updated:** January 8, 2026
