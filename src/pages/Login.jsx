import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Mail, Lock, LogIn } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await signIn(email, password)
    if (!error) {
      navigate('/dashboard')
    }
    setLoading(false)
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    await signInWithGoogle()
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: 'var(--spacing-lg)'
    }}>
      <div className="card" style={{ maxWidth: '450px', width: '100%' }}>
        <div className="text-center mb-4">
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: 'var(--primary-blue)',
            marginBottom: 'var(--spacing-sm)'
          }}>
            YuvaSetu
          </h1>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.9375rem' }}>
            College Networking Platform
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              <Mail size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
              Email Address
            </label>
            <input
              type="email"
              className="form-input"
              placeholder="your.email@college.edu.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Lock size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
              Password
            </label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner"></span>
            ) : (
              <>
                <LogIn size={20} />
                Sign In
              </>
            )}
          </button>
        </form>

        <div style={{
          margin: 'var(--spacing-lg) 0',
          textAlign: 'center',
          position: 'relative'
        }}>
          <span style={{
            backgroundColor: 'white',
            padding: '0 var(--spacing-md)',
            color: 'var(--gray-500)',
            fontSize: '0.875rem',
            position: 'relative',
            zIndex: 1
          }}>or</span>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: '1px',
            backgroundColor: 'var(--gray-200)',
            zIndex: 0
          }}></div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="btn btn-google w-full"
          disabled={loading}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.039l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.582c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.163 6.656 3.582 9 3.582z"/>
          </svg>
          Sign in with Google
        </button>

        <p className="text-center mt-4" style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: 'var(--primary-blue)', fontWeight: '500', textDecoration: 'none' }}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}
