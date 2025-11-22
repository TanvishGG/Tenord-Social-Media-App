# Tenord - Social Media Application

A modern, real-time social media platform inspired by Discord, built with a focus on seamless communication and user experience.

## 🌟 Features

- **Real-time Communication**: WebSocket-based instant messaging
- **Channel Management**: Create and manage multiple channels
- **Direct Messaging**: Private one-on-one conversations
- **User Profiles**: Customizable avatars, banners, and bios
- **Invite System**: Share invite codes to add members to channels
- **Media Support**: Avatar and banner image uploads with CDN delivery
- **Authentication**: Secure JWT-based authentication with password recovery
- **Modern UI**: Responsive design with Tailwind CSS and Framer Motion animations

## 🏗️ Architecture

This is a monorepo containing:
- **Backend**: Express.js REST API with WebSocket support
- **Frontend**: Next.js 15 application with React 19

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ and npm/yarn
- PostgreSQL database
- SMTP server for email functionality

### Installation

1. Clone the repository:
```bash
git clone https://github.com/TanvishGG/Tenord-Social-Media-App.git
cd Tenord-Social-Media-App
```

2. Set up the backend:
```bash
cd backend
npm install
```

3. Set up the frontend:
```bash
cd ../frontend
npm install
```

### Configuration

#### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/tenord"
EMAIL_HOST="smtp.gmail.com"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
JWT_SECRET="your-jwt-secret-key"
JWT_PUBLIC="your-jwt-public-key"
```

#### Frontend Environment Variables

Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=http://localhost:3001
```

### Running the Application

#### Development Mode

1. Start the backend server:
```bash
cd backend
npm run start
```

2. In a new terminal, start the frontend:
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

#### Production Build

Backend:
```bash
cd backend
npm run build
node dist/index.js
```

Frontend:
```bash
cd frontend
npm run build
npm run start
```

## 📚 Documentation

- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Real-time**: Socket.IO
- **Authentication**: JWT with bcrypt
- **Validation**: Zod
- **Email**: Nodemailer
- **Image Processing**: Sharp

### Frontend
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **Real-time**: Socket.IO Client
- **Icons**: Lucide React

## 📁 Project Structure

```
Tenord-Social-Media-App/
├── backend/
│   ├── controllers/       # Request handlers
│   ├── routes/           # API route definitions
│   ├── schemas/          # Validation schemas
│   ├── utils/            # Helper functions
│   ├── prisma/           # Database schema
│   └── index.ts          # Entry point
├── frontend/
│   ├── app/              # Next.js pages
│   ├── components/       # React components
│   ├── contexts/         # React contexts
│   └── lib/              # Utility functions
└── README.md
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- HTTP-only cookies for session management
- CORS protection
- Input validation with Zod schemas
- Secure password reset flow

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**TanvishGG**

- GitHub: [@TanvishGG](https://github.com/TanvishGG)

## 🙏 Acknowledgments

- Inspired by Discord's communication platform
- Built with modern web technologies
- Community feedback and contributions
