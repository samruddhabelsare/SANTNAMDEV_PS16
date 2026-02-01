# YuvaSetu Frontend - Technical Overview

## 🛠️ Technology Stack

### Core Framework
- **React 18**: Component-based UI library
- **Vite**: Next-generation frontend tooling (Build tool & Dev server)
- **JavaScript (ES6+)**: Primary programming language

### Styling & Design
- **CSS3 (Variables)**: Custom design system based on UX4G
- **Lucide React**: Modern, consistent icon set
- **Responsive Design**: Mobile-first approach using CSS Grid/Flexbox
- **Public Sans**: Official government font for typography

### State Management & Routing
- **React Context API (AuthContext)**: Global state for user session & profile
- **React Router v6**: Client-side routing with protected routes
- **React Hot Toast**: Lightweight notification system

### Backend Integration (Supabase)
- **@supabase/supabase-js**: Official client library
- **Authentication**: Email/Password & Google OAuth
- **Database**: PostgreSQL (via Supabase)
- **Realtime**: WebSocket subscriptions for Chat

---

## 🔄 User Flow & Architecture

### 1. Authentication Flow
1.  **Entry**: User creates account on `/signup` or logs in on `/login`.
2.  **Verification**: 
    - `AuthContext` detects session.
    - App fetches `profiles` table data.
    - If `verification_status` is *pending*, user is restricted from sensitive features.
    - If *verified*, full access is granted.
3.  **Protection**: `ProtectedRoute` component wraps all private pages.

### 2. Feature Flows

-   **Dashboard (`/dashboard`)**:
    -   Central hub. Shows Trust Score (default 100), Verification Badge, and Role.
    -   Sidebar dynamically adapts (e.g., "Verify Users" link only for Admins).

-   **Networking (`/connections`)**:
    -   User searches verified profiles.
    -   Sends "Connection Request".
    -   Receiver accepts -> Status updates to 'accepted'.
    -   Now they can chat.

-   **Messaging (`/chat`)**:
    -   Real-time subscription listening for new rows in `messages` table.
    -   Only allows sending to `accepted` connections.

-   **Feed (`/feed`)**:
    -   Fetches `posts` table (descending order).
    -   "Create Post" only visible to verified users.

---

## 📂 Project Structure

```
src/
├── components/      # Reusable UI (ProtectedRoute, etc.)
├── contexts/        # Global state (AuthContext)
├── lib/             # Configurations (supabaseClient)
├── pages/           # Page components (Login, Dashboard, Feed...)
├── App.jsx          # Route definitions
└── index.css        # Global styles & UX4G design variables
```
