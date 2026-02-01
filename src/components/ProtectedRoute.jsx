import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export const ProtectedRoute = ({ children, requireVerified = false }) => {
  const { user, profile, loading } = useAuth()
  
  console.log('ProtectedRoute Check:', { 
    path: window.location.pathname, 
    loading, 
    hasUser: !!user, 
    verificationStatus: profile?.verification_status,
    requireVerified 
  })

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh' 
      }}>
        <div className="spinner" style={{ 
          width: '40px', 
          height: '40px',
          borderWidth: '3px',
          borderColor: 'var(--primary-blue)',
          borderTopColor: 'transparent'
        }}></div>
      </div>
    )
  }

  if (!user) {
    console.log('ProtectedRoute: No user, redirecting to login')
    return <Navigate to="/login" replace />
  }

  if (requireVerified && profile?.verification_status !== 'verified') {
    console.log('ProtectedRoute: User not verifying, redirecting')
    return <Navigate to="/pending-verification" replace />
  }

  return children
}
