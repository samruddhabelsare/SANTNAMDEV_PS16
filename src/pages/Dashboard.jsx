import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  Home,
  Users,
  MessageCircle,
  School,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  CheckCircle,
  AlertCircle,
  Shield
} from 'lucide-react'

export default function Dashboard() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/feed', icon: Home, label: 'Feed', requireVerified: true },
    { path: '/connections', icon: Users, label: 'Connections', requireVerified: true },
    { path: '/chat', icon: MessageCircle, label: 'Chat', requireVerified: true },
    { path: '/classrooms', icon: School, label: 'Classrooms', requireVerified: true },
    { path: '/bulletins', icon: Bell, label: 'Bulletins' },
    { path: '/profile', icon: User, label: 'Profile' },
  ]

  // Add admin verification link for admins
  if (profile?.role === 'admin') {
    navItems.push({ path: '/admin/verification', icon: Shield, label: 'Verify Users' })
  }

  const isActive = (path) => location.pathname === path

  const getVerificationBadge = () => {
    if (!profile) return null
    
    if (profile.verification_status === 'verified') {
      return (
        <span className="badge badge-success">
          <CheckCircle size={12} />
          Verified
        </span>
      )
    } else if (profile.verification_status === 'pending') {
      return (
        <span className="badge badge-warning">
          <AlertCircle size={12} />
          Pending
        </span>
      )
    } else {
      return (
        <span className="badge badge-error">
          <AlertCircle size={12} />
          Rejected
        </span>
      )
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--gray-50)' }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        backgroundColor: 'white',
        borderRight: '1px solid var(--gray-200)',
        position: 'fixed',
        height: '100vh',
        overflowY: 'auto',
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease',
        zIndex: 50
      }}
      className="sidebar">
        <div style={{ padding: 'var(--spacing-xl)' }}>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: 'var(--primary-blue)',
            marginBottom: 'var(--spacing-lg)'
          }}>
            YuvaSetu
          </h1>

          {/* User Profile Card */}
          <div style={{
            padding: 'var(--spacing-md)',
            backgroundColor: 'var(--gray-50)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--spacing-lg)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '600',
                fontSize: '1.125rem'
              }}>
                {user?.email?.[0]?.toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: '600', fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.email?.split('@')[0]}
                </p>
                <span className="badge badge-primary" style={{ fontSize: '0.6875rem', padding: '0.125rem 0.375rem' }}>
                  {profile?.role?.charAt(0).toUpperCase() + profile?.role?.slice(1)}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--spacing-sm)' }}>
              {getVerificationBadge()}
              <span style={{ fontSize: '0.75rem', color: 'var(--gray-600)' }}>
                Score: {profile?.trust_score || 100}
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav>
            {navItems.map((item) => {
              const Icon = item.icon
              const disabled = item.requireVerified && profile?.verification_status !== 'verified'
              
              return (
                <Link
                  key={item.path}
                  to={disabled ? '#' : item.path}
                  onClick={(e) => {
                    if (disabled) e.preventDefault()
                    setSidebarOpen(false)
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)',
                    padding: 'var(--spacing-sm) var(--spacing-md)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: 'var(--spacing-xs)',
                    textDecoration: 'none',
                    color: isActive(item.path) ? 'white' : 'var(--gray-700)',
                    backgroundColor: isActive(item.path) ? 'var(--primary-blue)' : 'transparent',
                    fontWeight: isActive(item.path) ? '500' : '400',
                    fontSize: '0.9375rem',
                    opacity: disabled ? 0.5 : 1,
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Icon size={20} />
                  {item.label}
                </Link>
              )
            })}

            <button
              onClick={handleSignOut}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
                padding: 'var(--spacing-sm) var(--spacing-md)',
                borderRadius: 'var(--radius-md)',
                marginTop: 'var(--spacing-md)',
                border: 'none',
                backgroundColor: 'transparent',
                color: 'var(--error-red)',
                fontWeight: '500',
                fontSize: '0.9375rem',
                cursor: 'pointer',
                width: '100%',
                transition: 'background-color 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = 'var(--gray-100)'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </nav>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          position: 'fixed',
          top: 'var(--spacing-md)',
          left: 'var(--spacing-md)',
          zIndex: 60,
          backgroundColor: 'var(--primary-blue)',
          color: 'white',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--spacing-sm)',
          cursor: 'pointer',
          display: 'none'
        }}
        className="mobile-menu-btn"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Main Content */}
      <main style={{
        marginLeft: '260px',
        flex: 1,
        padding: 'var(--spacing-xl)',
        width: 'calc(100% - 260px)'
      }}
      className="main-content">
        <h2 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: 'var(--spacing-lg)', color: 'var(--gray-900)' }}>
          Welcome back! 👋
        </h2>

        {profile?.verification_status === 'pending' && (
          <div style={{
            padding: 'var(--spacing-lg)',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--spacing-lg)'
          }}>
            <h3 style={{ fontWeight: '600', marginBottom: 'var(--spacing-sm)', color: '#856404' }}>
              <AlertCircle size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Verification Pending
            </h3>
            <p style={{ color: '#856404', fontSize: '0.9375rem' }}>
              Your account is pending verification by an administrator. You'll have access to all features once verified.
            </p>
          </div>
        )}

        {/* Dashboard Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-xl)'
        }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Trust Score</p>
                <p style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--primary-blue)' }}>{profile?.trust_score || 100}</p>
              </div>
              <Shield size={32} style={{ color: 'var(--primary-blue)', opacity: 0.2 }} />
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Status</p>
                <p style={{ fontSize: '1.25rem', fontWeight: '600' }}>{getVerificationBadge()}</p>
              </div>
              <CheckCircle size={32} style={{ color: 'var(--success-green)', opacity: 0.2 }} />
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Role</p>
                <p style={{ fontSize: '1.25rem', fontWeight: '600', textTransform: 'capitalize' }}>
                  {profile?.role || 'Student'}
                </p>
              </div>
              <User size={32} style={{ color: 'var(--secondary-orange)', opacity: 0.2 }} />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ marginTop: 'var(--spacing-xl)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: 'var(--spacing-md)' }}>
            Quick Actions
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-md)' }}>
            <Link to="/feed" className="card" style={{ textDecoration: 'none', color: 'inherit', padding: 'var(--spacing-lg)' }}>
              <Home size={24} style={{ color: 'var(--primary-blue)', marginBottom: 'var(--spacing-sm)' }} />
              <h4 style={{ fontWeight: '600', marginBottom: 'var(--spacing-xs)' }}>View Feed</h4>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>See what's happening in your college</p>
            </Link>

            <Link to="/connections" className="card"style={{ textDecoration: 'none', color: 'inherit', padding: 'var(--spacing-lg)' }}>
              <Users size={24} style={{ color: 'var(--primary-blue)', marginBottom: 'var(--spacing-sm)' }} />
              <h4 style={{ fontWeight: '600', marginBottom: 'var(--spacing-xs)' }}>Connect with Peers</h4>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>Build your network within the college</p>
            </Link>

            <Link to="/bulletins" className="card" style={{ textDecoration: 'none', color: 'inherit', padding: 'var(--spacing-lg)' }}>
              <Bell size={24} style={{ color: 'var(--primary-blue)', marginBottom: 'var(--spacing-sm)' }} />
              <h4 style={{ fontWeight: '600', marginBottom: 'var(--spacing-xs)' }}>Official Bulletins</h4>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>Stay updated with college announcements</p>
            </Link>
          </div>
        </div>
      </main>

      <style>{`
        @media (max-width: 768px) {
          .sidebar {
            transform: ${sidebarOpen ? 'translateX(0)' : 'translateX(-100%)'} !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
          .main-content {
            margin-left: 0 !important;
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  )
}
