import React, { createContext, useState, useEffect, useContext } from 'react'
import { supabase } from '../lib/supabaseClient'
import toast from 'react-hot-toast'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const isDevMode = React.useRef(false)

  useEffect(() => {
    // If supabase is not configured, stop loading
    if (!supabase) {
      setLoading(false)
      return
    }

    // Check active session
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error('Error checking session:', error)
      }
      const session = data?.session
      if (!isDevMode.current) {
        setUser(session?.user ?? null)
        if (session?.user) {
          fetchProfile(session.user.id)
        } else {
          setLoading(false)
        }
      }
    }).catch(err => {
      console.error('Unexpected error getting session:', err)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth State Change:', _event, session?.user?.id)
      
      // CRITICAL: If we are in dev mode, IGNORE Supabase updates completely
      if (isDevMode.current) {
        console.log('AuthContext: Ignoring Supabase update due to Dev Mode')
        return
      }

      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId) => {
    if (!supabase || userId === 'dev-user-id') return
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error.message)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email, password, role = 'student') => {
    if (!supabase) {
      toast.error('Supabase not configured')
      return { data: null, error: new Error('Supabase not configured') }
    }
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role }
        }
      })
      if (error) throw error
      toast.success('Account created! Please check your email for verification.')
      return { data, error: null }
    } catch (error) {
      toast.error(error.message)
      return { data: null, error }
    }
  }

  const signIn = async (email, password) => {
    if (!supabase) {
      toast.error('Supabase not configured')
      return { data: null, error: new Error('Supabase not configured') }
    }
    try {
      console.log('AuthContext: Signing in...')
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      
      console.log('AuthContext: Sign in successful', data)
      // Explicitly set user to avoid race condition with the listener
      if (data?.session?.user) {
        setUser(data.session.user)
        fetchProfile(data.session.user.id)
      }
      
      toast.success('Welcome back!')
      return { data, error: null }
    } catch (error) {
      console.error('AuthContext: Sign in error', error)
      toast.error(error.message)
      return { data: null, error }
    }
  }

  const signInWithGoogle = async () => {
    if (!supabase) {
      toast.error('Supabase not configured')
      return { data: null, error: new Error('Supabase not configured') }
    }
    try {
      const redirectTo = window.location.origin
      console.log('Google Auth: Redirecting to', redirectTo)
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectTo
        }
      })
      if (error) throw error
      
      console.log('Google Auth Result:', data)
      if (data?.url) {
        console.log('Manual redirecting to:', data.url)
        window.location.href = data.url
      }
      
      return { data, error: null }
    } catch (error) {
      console.error('Google Auth Error:', error)
      toast.error(error.message)
      return { data: null, error }
    }
  }

  const signOut = async () => {
    if (!supabase) return
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      toast.success('Signed out successfully')
      setUser(null)
      setProfile(null)
      isDevMode.current = false // Reset dev mode
    } catch (error) {
      toast.error(error.message)
    }
  }

  const loginAsDev = () => {
    isDevMode.current = true
    
    const devUser = {
      id: 'dev-user-id',
      email: 'dev@yuvasetu.edu.in',
      role: 'student'
    }
    const devProfile = {
      id: 'dev-user-id',
      email: 'dev@yuvasetu.edu.in',
      verification_status: 'verified',
      role: 'student',
      trust_score: 100
    }
    
    setUser(devUser)
    setProfile(devProfile)
    setLoading(false)
    toast.success('Bypassed Auth: Logged in as Dev User')
  }

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    loginAsDev,
    refetchProfile: () => user && fetchProfile(user.id)
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
