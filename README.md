# YuvaSetu - College Networking Platform

A modern college networking platform built with React, Vite, and Supabase, following UX4G Government Design System standards.

## Features

✅ **Authentication**
- Email/Password signup and login
- Google OAuth integration
- Auto-profile creation
- Role-based access (Student, Teacher, Alumni, Admin)

✅ **Verification System**
- Three-level verification (pending → verified by admin)
- Trust score system (default: 100)
- Verification badges

✅ **Posts Feed**
- Create posts with text and media
- View posts from verified users only
- Real-time feed updates

✅ **Connections**
- Send/accept/reject connection requests
- Mutual connection system
- View connections list

✅ **Private Chat**
- Realtime messaging with Supabase
- Connection-based chat (mutual only)
- Message history

✅ **Classrooms**
- View official/unofficial classrooms
- Classroom members
- Classroom-specific posts

✅ **Bulletin Board**
- Multi-level announcements (College/Department/Class)
- Teacher/Admin only posting
- Official notices display

✅ **Admin Panel**
- Verify user accounts
- Manage pending verifications
- Admin dashboard

## Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Supabase (PostgreSQL + Realtime)
- **Routing**: React Router v6
- **Styling**: UX4G-inspired CSS (Government Design System)
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **State Management**: React Context API

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace with your actual Supabase credentials from your Supabase project dashboard.

### 3. Backend Setup (Supabase)

The backend is already set up with the following tables:
- `profiles` - User profiles with verification status and trust score
- `posts` - Posts feed
- `connections` - Friend/connection system
- `messages` - Private chat messages
- `classrooms` - Classroom information
- `classroom_members` - Classroom membership
- `classroom_posts` - Posts in classrooms
- `bulletin_posts` - Official announcements

RLS (Row Level Security) policies are enforced to ensure:
- Unverified users cannot post, connect, or chat
- Users can only read their own profile
- Messaging only works if connection is accepted
- Classroom content visible only to members
- Only teachers/admin can post bulletins

### 4. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
yuvasetu/
├── src/
│   ├── components/
│   │   └── ProtectedRoute.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── lib/
│   │   └── supabaseClient.js
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Feed.jsx
│   │   ├── Connections.jsx
│   │   ├── Chat.jsx
│   │   ├── Classrooms.jsx
│   │   ├── Bulletins.jsx
│   │   ├── Profile.jsx
│   │   └── AdminVerification.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

## User Roles

1. **Student** - Can post, connect, chat, join classrooms, view bulletins
2. **Teacher** - All student features + post bulletins
3. **Alumni** - Can connect and network with current students
4. **Admin** - All features + verify user accounts

## App Flow

1. User signs up (email/password or Google)
2. Profile auto-created with status: `pending`
3. Admin verifies user → status becomes `verified`
4. Verified users can:
   - Create posts
   - Send/accept connection requests
   - Chat with connections
   - Join classrooms
   - View bulletins

## Design System

Following **UX4G (User Experience for Government)** principles:
- Government blue (#137fec) and orange accents
- Public Sans font (official UX4G font)
- High contrast for accessibility (WCAG 2.1 AA)
- Clean, professional government aesthetic
- Responsive design for mobile and desktop

## Security Features

✅ Row Level Security (RLS) enforced by Supabase
✅ Protected routes with authentication checks
✅ Verification-required actions
✅ Connection-based messaging
✅ Role-based permissions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

MIT License - feel free to use this project for your college!

## Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ for Indian colleges using UX4G Government Design System
