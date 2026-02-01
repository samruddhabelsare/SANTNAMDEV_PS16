import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import { CheckCircle, XCircle, Users } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminVerification() {
  const [pendingUsers, setPendingUsers] = useState([])
  const { profile } = useAuth()

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchPendingUsers()
    }
  }, [profile])

  const fetchPendingUsers = async () => {
    if (localStorage.getItem('mockMode') === 'true') {
      const { mockStore } = await import('../lib/mockStore')
      setPendingUsers(mockStore.getPendingUsers())
      return
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('verification_status', 'pending')

      if (error) throw error
      setPendingUsers(data || [])
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const verifyUser = async (userId) => {
    if (localStorage.getItem('mockMode') === 'true') {
       const { mockStore } = await import('../lib/mockStore')
       mockStore.verifyUser(userId)
       toast.success('User verified (Mock)!')
       fetchPendingUsers()
       return
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ verification_status: 'verified' })
        .eq('id', userId)

      if (error) throw error
      toast.success('User verified successfully!')
      fetchPendingUsers()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const rejectUser = async (userId) => {
    if (localStorage.getItem('mockMode') === 'true') {
       const { mockStore } = await import('../lib/mockStore')
       mockStore.rejectUser(userId)
       toast.success('User rejected (Mock)')
       fetchPendingUsers()
       return
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ verification_status: 'rejected' })
        .eq('id', userId)

      if (error) throw error
      toast.success('User rejected')
      fetchPendingUsers()
    } catch (error) {
      toast.error(error.message)
    }
  }

  if (profile?.role !== 'admin') {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="card text-center" style={{ padding: 'var(--spacing-xl)' }}>
          <p style={{ color: 'var(--gray-500)' }}>Access denied. Admin only.</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: 'var(--spacing-lg)' }}>
        User Verification
      </h2>

      {pendingUsers.length === 0 ? (
        <div className="card text-center" style={{ padding: 'var(--spacing-xl)' }}>
          <Users size={48} style={{ color: 'var(--gray-300)', margin: '0 auto var(--spacing-md)' }} />
          <p style={{ color: 'var(--gray-500)' }}>No pending verifications</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
          {pendingUsers.map((user) => (
            <div key={user.id} className="card">
              <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <p style={{ fontWeight: '600', fontSize: '1.125rem', marginBottom: 'var(--spacing-xs)' }}>
                  {user.email}
                </p>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                  <span className="badge badge-primary">
                    {user.role?.toUpperCase()}
                  </span>
                  <span className="badge badge-warning">
                    PENDING
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                <button
                  onClick={() => verifyUser(user.id)}
                  className="btn btn-primary"
                >
                  <CheckCircle size={18} />
                  Verify
                </button>
                <button
                  onClick={() => rejectUser(user.id)}
                  className="btn btn-secondary"
                  style={{ color: 'var(--error-red)', borderColor: 'var(--error-red)' }}
                >
                  <XCircle size={18} />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
