# Tenord Backend

The backend service for Tenord, a real-time social media platform built with Express.js, Socket.IO, and PostgreSQL.

## 🎯 Overview

This is a RESTful API with WebSocket support that handles user authentication, channel management, messaging, and media storage. It uses Prisma as the ORM for PostgreSQL database interactions and provides real-time communication through Socket.IO.

## 🏗️ Architecture

### Core Technologies

- **Express.js**: Web framework for REST API
- **Socket.IO**: Real-time bidirectional communication
- **Prisma**: Type-safe database ORM
- **PostgreSQL**: Primary database
- **TypeScript**: Type safety and developer experience
- **JWT**: Authentication tokens
- **Zod**: Runtime type validation

### Key Features

- RESTful API endpoints
- WebSocket real-time messaging
- JWT-based authentication
- Image processing and CDN storage
- Email verification and password recovery
- Snowflake ID generation for distributed systems

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (see Configuration section)

3. Initialize the database:
```bash
npx prisma generate
npx prisma migrate dev
```

4. Start the development server:
```bash
npm run start
```

## ⚙️ Configuration

Create a `.env` file in the backend directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/tenord"

# Email (SMTP)
EMAIL_HOST="smtp.gmail.com"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-specific-password"

# JWT Authentication
JWT_SECRET="-----BEGIN RSA PRIVATE KEY-----\nYour private key here\n-----END RSA PRIVATE KEY-----"
JWT_PUBLIC="-----BEGIN PUBLIC KEY-----\nYour public key here\n-----END PUBLIC KEY-----"
```

### Configuration Notes

**Email (SMTP)**:
- For Gmail: Enable 2FA and generate an App Password
- For Outlook/Office365: Use `smtp.office365.com`
- Use the App Password in `EMAIL_PASS`

**JWT Keys**:
- Generate RSA key pair for JWT authentication
- Can use `openssl` to generate keys:
  ```bash
  openssl genrsa -out private.pem 2048
  openssl rsa -in private.pem -pubout -out public.pem
  ```
- Copy the full key content including BEGIN/END lines

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user account.

**Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

#### POST `/api/auth/login`
Login to an existing account.

**Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

#### POST `/api/auth/verify`
Verify email with code sent to email.

**Body:**
```json
{
  "email": "string",
  "code": "string"
}
```

#### POST `/api/auth/forgot-password`
Request password reset email.

**Body:**
```json
{
  "email": "string"
}
```

#### POST `/api/auth/reset-password`
Reset password with code.

**Body:**
```json
{
  "email": "string",
  "code": "string",
  "password": "string"
}
```

### Account Endpoints

All account endpoints require authentication (JWT in cookie).

#### GET `/api/account`
Get current user information.

#### PATCH `/api/account/profile`
Update user profile.

**Body:**
```json
{
  "nickname": "string",
  "about": "string",
  "avatar": "base64-encoded-image",
  "banner": "base64-encoded-image"
}
```

#### POST `/api/account/email`
Change email address.

#### DELETE `/api/account`
Delete user account.

### Channel Endpoints

#### POST `/api/channels`
Create a new channel.

**Body:**
```json
{
  "name": "string"
}
```

#### GET `/api/channels`
Get all channels user is a member of.

#### GET `/api/channels/:channelId`
Get specific channel details.

#### GET `/api/channels/:channelId/messages`
Get messages from a channel.

#### DELETE `/api/channels/:channelId`
Delete a channel (owner only).

### Direct Messages Endpoints

#### POST `/api/dms`
Create a DM channel.

**Body:**
```json
{
  "user_id": "string"
}
```

#### GET `/api/dms`
Get all DM channels.

#### GET `/api/dms/:channelId`
Get specific DM channel.

#### GET `/api/dms/:channelId/messages`
Get messages from DM channel.

### Invite Endpoints

#### POST `/api/invites`
Create a channel invite.

**Body:**
```json
{
  "channel_id": "string"
}
```

#### GET `/api/invites/:inviteId`
Get invite details.

#### POST `/api/invites/:inviteId/accept`
Accept an invite and join channel.

### User Endpoints

#### GET `/api/users/:userId`
Get public user profile.

### CDN Endpoints

#### GET `/cdn/avatars/:hash`
Get user avatar image.

#### GET `/cdn/banners/:hash`
Get user banner image.

### WebSocket Events

#### Client → Server

- `join_channel`: Join a channel room
  ```json
  { "channel_id": "string" }
  ```

- `leave_channel`: Leave a channel room
  ```json
  { "channel_id": "string" }
  ```

- `send_message`: Send a message to channel
  ```json
  {
    "channel_id": "string",
    "content": "string"
  }
  ```

- `send_dm`: Send a direct message
  ```json
  {
    "channel_id": "string",
    "content": "string"
  }
  ```

#### Server → Client

- `message`: New message in channel
- `dm`: New direct message
- `user_join`: User joined channel
- `user_leave`: User left channel
- `error`: Error occurred

## 🗄️ Database Schema

### Models

- **User**: User accounts with profile information
- **Channel**: Group channels for multiple users
- **DmChannel**: Direct message channels between two users
- **Message**: Messages in group channels
- **DmMessage**: Messages in DM channels
- **Invite**: Channel invitation codes
- **Avatar**: Stored avatar images
- **Banner**: Stored banner images

### Relationships

- Users can own multiple channels
- Users can be members of multiple channels
- Channels have multiple messages
- DM channels connect exactly two users
- Invites are linked to channels and users

## 🧰 Utilities

### AuthUtils
- `generateToken()`: Create JWT tokens
- `verifyToken()`: Validate JWT tokens
- `authenticate()`: Express middleware for route protection

### HashUtils
- `hashPassword()`: Hash passwords with bcrypt
- `comparePassword()`: Verify password hashes

### EmailUtils
- `sendVerificationEmail()`: Send email verification codes
- `sendPasswordResetEmail()`: Send password reset codes

### ImageUtils
- `processImage()`: Resize and optimize images
- `generateHash()`: Create unique image identifiers

### DataUtils
- Helper functions for data manipulation and validation

## 📜 Scripts

```bash
# Development with auto-reload
npm run start

# Build TypeScript to JavaScript
npm run build

# Run production build
node dist/index.js

# Lint code
npm run lint

# Format code
npm run format

# Prisma commands
npx prisma generate    # Generate Prisma client
npx prisma migrate dev # Run migrations
npx prisma studio      # Open Prisma Studio
npx prisma db push     # Push schema changes
```

## 🔒 Security

### Authentication Flow

1. User registers with email and password
2. Email verification code sent via SMTP
3. User verifies email with code
4. User can login and receive JWT token
5. JWT stored in HTTP-only cookie
6. Token required for authenticated endpoints

### Password Security

- Passwords hashed with bcrypt (10 rounds)
- Password reset requires email verification
- Tokens expire after set duration

### Input Validation

All request bodies validated with Zod schemas:
- `RegisterSchema`
- `LoginSchema`
- `EmailChangeSchema`
- `ForgotPasswordSchema`
- `ProfileUpdateSchema`
- `CreateChannelSchema`
- `MessageSchema`
- `DmCreateSchema`
- `InviteCreateSchema`

## 🏃 Development Workflow

1. Make changes to TypeScript files
2. Nodemon automatically restarts server
3. Test endpoints with Postman or frontend
4. Run migrations if schema changes
5. Commit changes with descriptive messages

### Database Changes

```bash
# Modify schema.prisma
npx prisma migrate dev --name description-of-change
npx prisma generate
```

## 🐛 Debugging

### Logging

The server logs all incoming requests:
```
[REQUEST] GET /api/channels
[PRISMA] Connected to the database
```

### Common Issues

1. **Database connection failed**: Check DATABASE_URL in .env
2. **JWT errors**: Verify JWT_SECRET is set
3. **Email not sending**: Confirm SMTP credentials
4. **Port already in use**: Change PORT in .env or kill process

## 🚀 Deployment

### Production Checklist

- [ ] Set strong JWT_SECRET
- [ ] Use production database
- [ ] Set NODE_ENV=production
- [ ] Configure CORS for production domain
- [ ] Set up reverse proxy (nginx)
- [ ] Enable HTTPS
- [ ] Set up CDN for images
- [ ] Configure error monitoring
- [ ] Set up database backups
- [ ] Use environment variables for secrets

### Build for Production

```bash
npm run build
NODE_ENV=production node dist/index.js
```

## 📊 Performance

- Uses Snowflake IDs for distributed ID generation
- Image optimization with Sharp
- Database connection pooling with Prisma
- WebSocket connection management
- User caching for reduced database queries

## 🤝 Contributing

1. Follow TypeScript best practices
2. Use Zod for input validation
3. Add proper error handling
4. Write descriptive commit messages
5. Update API documentation
6. Test endpoints thoroughly

## 📝 License

ISC License - see LICENSE file for details.

## 👤 Author

**TanvishGG**

For issues and questions, please open an issue on GitHub.