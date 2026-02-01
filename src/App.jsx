import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Feed from './pages/Feed'
import Connections from './pages/Connections'
import Chat from './pages/Chat'
import Classrooms from './pages/Classrooms'
import Bulletins from './pages/Bulletins'
import Profile from './pages/Profile'
import AdminVerification from './pages/AdminVerification'

import { isSupabaseConfigured } from './lib/supabaseClient'
import DevToolbar from './components/DevToolbar'

function ConfigError() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '2rem',
      fontFamily: "'Public Sans', sans-serif"
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        maxWidth: '500px',
        width: '100%'
      }}>
        <h1 style={{ color: '#dc3545', marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
          ⚠️ Supabase Configuration Missing
        </h1>
        <p style={{ marginBottom: '1.5rem', color: '#4b5563' }}>
          The application cannot start because Supabase credentials are missing.
        </p>
        
        <div style={{ backgroundColor: '#f3f4f6', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
          <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>How to fix:</h3>
          <ol style={{ paddingLeft: '1.5rem', margin: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>Create a file named <code>.env</code> in the project root</li>
            <li style={{ marginBottom: '0.5rem' }}>Add your Supabase credentials:</li>
          </ol>
          <pre style={{ 
            backgroundColor: '#1f2937', 
            color: '#e5e7eb', 
            padding: '1rem', 
            borderRadius: '6px',
            fontSize: '0.875rem',
            overflowX: 'auto',
            marginTop: '0.5rem'
          }}>
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
          </pre>
        </div>
        
        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
          You can find these credentials in your Supabase project dashboard under Settings &gt; API.
        </p>
        
        <button 
          onClick={() => window.location.reload()}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#137fec',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            marginTop: '1.5rem',
            cursor: 'pointer'
          }}
        >
          Check Again
        </button>
      </div>
    </div>
  )
}

function App() {
  if (!isSupabaseConfigured()) {
    return <ConfigError />
  }

  return (
    <AuthProvider>
      <BrowserRouter>
        <DevToolbar />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'white',
              color: 'var(--gray-900)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              fontFamily: 'var(--font-family)'
            },
            success: {
              iconTheme: {
                primary: 'var(--success-green)',
                secondary: 'white'
              }
            },
            error: {
              iconTheme: {
                primary: 'var(--error-red)',
                secondary: 'white'
              }
            }
          }}
        />
        
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/feed"
            element={
              <ProtectedRoute requireVerified>
                <Feed />
              </ProtectedRoute>
            }
          />
          <Route
            path="/connections"
            element={
              <ProtectedRoute requireVerified>
                <Connections />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute requireVerified>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/classrooms"
            element={
              <ProtectedRoute requireVerified>
                <Classrooms />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bulletins"
            element={
              <ProtectedRoute>
                <Bulletins />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/verification"
            element={
              <ProtectedRoute>
                <AdminVerification />
              </ProtectedRoute>
            }
          />
          
          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
