import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  BookOpen, 
  FileText, 
  User, 
  LogOut,
  ShieldCheck
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Sidebar({ isOpen, onClose }) {
  const { profile, signOut } = useAuth()
  const location = useLocation()

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/feed', label: 'Feed', icon: FileText },
    { to: '/connections', label: 'Connections', icon: Users },
    { to: '/chat', label: 'Messages', icon: MessageSquare },
    { to: '/classrooms', label: 'Classrooms', icon: BookOpen },
    { to: '/bulletins', label: 'Bulletins', icon: FileText }, // Reusing FileText or use Bell
    { to: '/profile', label: 'Profile', icon: User },
  ]

  // Add Admin link if role is admin
  if (profile?.role === 'admin') {
    links.push({ to: '/admin-verification', label: 'Admin Panel', icon: ShieldCheck })
  }

  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`mobile-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />

      {/* Sidebar Container */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div style={{ padding: 'var(--spacing-xl)', borderBottom: '1px solid var(--gray-100)' }}>
          <h1 className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
            YuvaSetu
          </h1>
          <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '4px' }}>
            Government of India
          </p>
        </div>

        <nav style={{ flex: 1, padding: 'var(--spacing-lg)', overflowY: 'auto' }}>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
            {links.map((link) => (
              <li key={link.to}>
                <Link 
                  to={link.to} 
                  className={`nav-item ${isActive(link.to) ? 'active' : ''}`}
                  onClick={() => window.innerWidth < 768 && onClose && onClose()}
                >
                  <link.icon size={20} />
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div style={{ padding: 'var(--spacing-lg)', borderTop: '1px solid var(--gray-100)' }}>
          <button 
            onClick={signOut}
            className="nav-item"
            style={{ width: '100%', color: 'var(--error-red)', justifyContent: 'flex-start' }}
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <style>{`
        .sidebar {
          width: 260px;
          height: 100vh;
          background-color: white;
          border-right: 1px solid var(--gray-200);
          position: fixed;
          top: 0;
          left: 0;
          z-index: 50;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease;
          /* Default desktop: always visible (transform none) */
          transform: none; 
        }

        .mobile-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(0,0,0,0.5);
          z-index: 40;
          display: none;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        @media (max-width: 768px) {
          .sidebar {
            /* Mobile default: hidden off-screen */
            transform: translateX(-100%);
          }
          .sidebar.open {
            /* Mobile open: visible */
            transform: translateX(0);
          }
          
          .mobile-overlay.open {
            display: block;
            opacity: 1;
          }
        }
      `}</style>
    </>
  )
}
