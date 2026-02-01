import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LayoutDashboard, Users, MessageSquare, BookOpen, FileText, User, Shield, LogIn, AlertTriangle } from 'lucide-react'

export default function DevToolbar() {
  const { user, loginAsDev, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  if (import.meta.env.PROD) return null

  const pages = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dash' },
    { path: '/feed', icon: FileText, label: 'Feed' },
    { path: '/connections', icon: Users, label: 'Conn' },
    { path: '/chat', icon: MessageSquare, label: 'Chat' },
    { path: '/classrooms', icon: BookOpen, label: 'Class' },
    { path: '/bulletins', icon: AlertTriangle, label: 'Bull' },
    { path: '/profile', icon: User, label: 'Prof' },
    { path: '/admin/verification', icon: Shield, label: 'Admin' },
  ]

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#1f2937',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '99px',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      zIndex: 9999,
      maxWidth: '90vw',
      overflowX: 'auto'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRight: '1px solid #374151', paddingRight: '12px' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#ff9800', whiteSpace: 'nowrap' }}>DEV MODE</span>
        {!user ? (
          <button 
            onClick={() => {
              loginAsDev()
              navigate('/dashboard')
            }}
            style={{ 
              background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', 
              padding: '4px 8px', fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap' 
            }}
          >
            Mock Login
          </button>
        ) : (
          <button 
            onClick={() => signOut()}
            style={{ 
              background: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', 
              padding: '4px 8px', fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap' 
            }}
          >
            Logout
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: '4px' }}>
        {pages.map((p) => (
          <button
            key={p.path}
            onClick={() => navigate(p.path)}
            title={p.label}
            style={{
              background: location.pathname === p.path ? 'rgba(255,255,255,0.2)' : 'transparent',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <p.icon size={16} />
          </button>
        ))}
      </div>
      
      <div style={{ display: 'flex', gap: '4px', borderLeft: '1px solid #374151', paddingLeft: '8px' }}>
        <button
           onClick={() => navigate('/login')}
           title="Login Page"
           style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}
        >
          <LogIn size={16} />
        </button>
      </div>
    </div>
  )
}
