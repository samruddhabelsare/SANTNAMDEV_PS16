import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Mail, Lock, LogIn, ArrowRight, Loader2, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  
  const { signIn, signInWithGoogle, user } = useAuth()
  const navigate = useNavigate()

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      console.log('User already authenticated, redirecting to dashboard')
      navigate('/dashboard')
    }
  }, [user, navigate])

  const validateForm = () => {
    const errors = {}
    if (!email) errors.email = 'Email is required'
    if (!password) errors.password = 'Password is required'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    console.log('Attempting login for:', email)
    
    try {
      const { data, error } = await signIn(email, password)
      
      if (error) {
        console.error('Login error:', error)
        // Toast is handled in AuthContext, but we can clarify here if needed
      } else {
        console.log('Login successful, data:', data)
        // Navigation typically handled by useEffect on 'user' change, 
        // but explicit navigate here acts as backup
        navigate('/dashboard')
      }
    } catch (err) {
      console.error('Unexpected login error:', err)
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      await signInWithGoogle()
    } catch (err) {
      console.error('Google sign in error:', err)
    } finally {
      setLoading(false) // Note: Google auth redirects away, so this might not run if successful
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'white' }}>
      {/* Left Side - Branding & Vision */}
      <div style={{
        flex: 1,
        backgroundColor: 'var(--primary-blue)',
        background: 'linear-gradient(135deg, #137fec 0%, #0b5ed7 100%)',
        color: 'white',
        padding: 'var(--spacing-xl)',
        display: 'none',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }} className="branding-section">
        {/* Decorative Circles */}
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}></div>
        <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}></div>

        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem' }}>
            <div style={{ width: '40px', height: '40px', background: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <span style={{ color: 'var(--primary-blue)', fontWeight: 'bold', fontSize: '1.2rem' }}>Y</span>
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '-0.5px' }}>YuvaSetu</span>
          </div>
          
          <h1 style={{ fontSize: '3rem', fontWeight: '700', lineHeight: 1.1, marginBottom: '1.5rem', maxWidth: '80%' }}>
            Empowering India's Youth
          </h1>
          <p style={{ fontSize: '1.125rem', opacity: 0.9, maxWidth: '80%', lineHeight: 1.6 }}>
            Connect with peers, alumni, and mentors. Build your future with a trusted network verified by your institution.
          </p>
        </div>

        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.2)', borderRadius: '99px', fontSize: '0.875rem' }}>
              🇮🇳 Digital India Initiative
            </div>
            <div style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.2)', borderRadius: '99px', fontSize: '0.875rem' }}>
              🔒 Secure & Verified
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--spacing-xl)',
        backgroundColor: 'var(--gray-50)'
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <div style={{ marginBottom: '2rem' }}>
             {/* Mobile Logo Show */}
             <div className="mobile-logo" style={{ display: 'none', marginBottom: '1.5rem', alignItems: 'center', gap: '8px' }}>
               <div style={{ width: '32px', height: '32px', background: 'var(--primary-blue)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <span style={{ color: 'white', fontWeight: 'bold' }}>Y</span>
               </div>
               <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary-blue)' }}>YuvaSetu</span>
             </div>

            <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--gray-900)', marginBottom: '0.5rem' }}>
              Welcome back
            </h2>
            <p style={{ color: 'var(--gray-500)' }}>
              Please enter your details to sign in
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-500)' }} />
                <input
                  id="email"
                  type="email"
                  className={`form-input ${fieldErrors.email ? 'error' : ''}`}
                  placeholder="name@college.edu.in"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setFieldErrors({...fieldErrors, email: null})
                  }}
                  style={{ paddingLeft: '40px', borderColor: fieldErrors.email ? 'var(--error-red)' : undefined }}
                  disabled={loading}
                />
              </div>
              {fieldErrors.email && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--error-red)', fontSize: '0.75rem', marginTop: '4px' }}>
                  <AlertCircle size={12} /> {fieldErrors.email}
                </span>
              )}
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}>
                <label className="form-label" htmlFor="password" style={{ marginBottom: 0 }}>Password</label>
                <a href="#" style={{ fontSize: '0.875rem', color: 'var(--primary-blue)', textDecoration: 'none', fontWeight: '500' }}>Forgot password?</a>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-500)' }} />
                <input
                  id="password"
                  type="password"
                  className={`form-input ${fieldErrors.password ? 'error' : ''}`}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setFieldErrors({...fieldErrors, password: null})
                  }}
                  style={{ paddingLeft: '40px', borderColor: fieldErrors.password ? 'var(--error-red)' : undefined }}
                  disabled={loading}
                />
              </div>
              {fieldErrors.password && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--error-red)', fontSize: '0.75rem', marginTop: '4px' }}>
                  <AlertCircle size={12} /> {fieldErrors.password}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
              style={{ padding: '0.75rem', fontSize: '1rem', justifyContent: 'center' }}
            >
              {loading ? (
                <Loader2 size={20} className="spinner" />
              ) : (
                <>
                  Sign In <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
          
          <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', color: 'var(--gray-300)' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'currentColor' }}></div>
            <span style={{ padding: '0 1rem', fontSize: '0.875rem', color: 'var(--gray-500)' }}>OR</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'currentColor' }}></div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="btn btn-google w-full"
            disabled={loading}
            style={{ justifyContent: 'center' }}
          >
            <svg width="20" height="20" viewBox="0 0 18 18" style={{ marginRight: '8px' }}>
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.039l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.582c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.163 6.656 3.582 9 3.582z"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-center mt-4" style={{ fontSize: '0.9375rem', color: 'var(--gray-600)' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: 'var(--primary-blue)', fontWeight: '600', textDecoration: 'none' }}>
              Sign up free
            </Link>
          </p>
        </div>
      </div>
      
      <style>{`
        @media (min-width: 900px) {
          .branding-section {
            display: flex !important;
          }
        }
        @media (max-width: 899px) {
            .mobile-logo {
                display: flex !important;
            }
        }
      `}</style>
    </div>
  )
}
