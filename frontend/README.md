# Tenord Frontend

The frontend application for Tenord, a modern real-time social media platform built with Next.js 15, React 19, and Tailwind CSS 4.

## 🎯 Overview

This is a server-side rendered and client-side interactive web application that provides a seamless user interface for real-time communication, channel management, and social interactions.

## 🏗️ Architecture

### Core Technologies

- **Next.js 15**: React framework with App Router
- **React 19**: UI library with latest features
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Utility-first styling
- **Framer Motion**: Smooth animations
- **Socket.IO Client**: Real-time communication
- **Axios**: HTTP client for API requests
- **Lucide React**: Modern icon library

### Key Features

- **Real-time Updates**: WebSocket integration for instant messaging
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Authentication**: Secure login/register with JWT
- **Channel System**: Create and manage multiple channels
- **Direct Messaging**: Private conversations
- **Profile Management**: Customizable user profiles
- **Invite System**: Share and accept channel invites
- **Image Uploads**: Avatar and banner uploads with preview
- **Dark Mode Ready**: Modern dark theme

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (see Configuration section)

3. Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:3000

## ⚙️ Configuration

Create a `.env.local` file in the frontend directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=http://localhost:3001
NEXT_PUBLIC_CDN_URL=http://localhost:3001/cdn

```

## 📁 Project Structure

```
frontend/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   ├── globals.css              # Global styles
│   ├── account/                 # Account settings page
│   ├── app/                     # Main application page
│   ├── forgot-password/         # Password recovery
│   ├── guidelines/              # Community guidelines
│   ├── invite/[code]/          # Invite acceptance
│   ├── login/                   # Login page
│   ├── privacy/                 # Privacy policy
│   ├── register/                # Registration page
│   ├── support/                 # Support page
│   └── terms/                   # Terms of service
├── components/                   # React components
│   ├── Header.tsx               # Navigation header
│   ├── Hero.tsx                 # Landing hero section
│   ├── app/                     # App-specific components
│   │   ├── ChatArea.tsx         # Message display
│   │   └── Sidebar.tsx          # Channel sidebar
│   └── modals/                  # Modal components
│       ├── CreateChannelModal.tsx
│       ├── CreateDMModal.tsx
│       ├── InviteModal.tsx
│       └── ProfileModal.tsx
├── contexts/                     # React Context providers
│   ├── AuthContext.tsx          # Authentication state
│   └── SocketContext.tsx        # WebSocket connection
├── lib/                         # Utility functions
│   └── api.ts                   # API client
├── public/                      # Static assets
└── package.json
```

## 🔌 API Integration

Centralized Axios client in `lib/api.ts` with base URL configuration, automatic credentials, and error handling. Provides standard REST methods (get, post, put, patch, delete).

## 🔐 Context Providers

### AuthContext
Manages user authentication state with methods for login, logout, and registration. Provides `user` object and `loading` state.

### SocketContext
Manages WebSocket connection for real-time features. Provides `socket` instance and `connected` state. Handles events: `message`, `dm`, `user_join`, `user_leave`.

## 🎨 Styling

Built with **Tailwind CSS 4** for utility-first styling and **Framer Motion** for smooth animations. Responsive design with mobile-first approach.

## 🧩 Components

### Core Components
- **Header**: Navigation header with logo and links
- **Hero**: Landing page hero section

### App Components
- **ChatArea**: Message display with real-time updates
- **Sidebar**: Channel list and navigation

### Modal Components
- **CreateChannelModal**: Create new channels
- **CreateDMModal**: Start direct messages
- **InviteModal**: Generate and share invite links
- **ProfileModal**: View and edit user profiles

## 📄 Pages

### Public Pages

- `/` - Landing page with product information
- `/login` - User login
- `/register` - New user registration
- `/forgot-password` - Password recovery
- `/invite/[code]` - Accept channel invites
- `/guidelines` - Community guidelines
- `/privacy` - Privacy policy
- `/terms` - Terms of service
- `/support` - Support information

### Protected Pages

- `/app` - Main application (channels & messages)
- `/account` - Account settings and profile

## 📜 Scripts

```bash
# Development with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint code
npm run lint

# Type check
npx tsc --noEmit
```

## 🎯 Development Workflow

1. Create/modify components in `components/`
2. Add pages in `app/` directory
3. Use contexts for shared state
4. Style with Tailwind classes
5. Test real-time features with backend
6. Verify type safety with TypeScript
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm run start
```

### Environment Variables

Set these in your deployment platform:
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_WS_URL`
- `NEXT_PUBLIC_CDN_URL`


## 📝 License

ISC License - see LICENSE file for details.

## 👤 Author

**TanvishGG**

For issues and questions, please open an issue on GitHub.