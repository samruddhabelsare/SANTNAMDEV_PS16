import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import { UserPlus, Check, X, Users as UsersIcon } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Connections() {
  const [connections, setConnections] = useState([])
  const [pendingRequests, setPendingRequests] = useState([])
  const [users, setUsers] = useState([])
  const { user, profile } = useAuth()

  useEffect(() => {
    if (profile?.verification_status === 'verified') {
      fetchConnections()
      fetchPendingRequests()
      fetchUsers()
    }
  }, [profile])

  const fetchConnections = async () => {
    try {
      const { data, error } = await supabase
        .from('connections')
        .select('*')
        .eq('status', 'accepted')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)

      if (error) throw error
      setConnections(data || [])
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const fetchPendingRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('connections')
        .select('*')
        .eq('receiver_id', user.id)
        .eq('status', 'pending')

      if (error) throw error
      setPendingRequests(data || [])
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id)
        .eq('verification_status', 'verified')

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const sendRequest = async (receiverId) => {
    try {
      const { error } = await supabase.from('connections').insert({
        sender_id: user.id,
        receiver_id: receiverId,
        status: 'pending'
      })

      if (error) throw error
      toast.success('Connection request sent!')
      fetchUsers()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const acceptRequest = async (requestId) => {
    try {
      const { error } = await supabase
        .from('connections')
        .update({ status: 'accepted' })
        .eq('id', requestId)

      if (error) throw error
      toast.success('Request accepted!')
      fetchConnections()
      fetchPendingRequests()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const rejectRequest = async (requestId) => {
    try {
      const { error } = await supabase
        .from('connections')
        .update({ status: 'rejected' })
        .eq('id', requestId)

      if (error) throw error
      toast.success('Request rejected')
      fetchPendingRequests()
    } catch (error) {
      toast.error(error.message)
    }
  }

  if (profile?.verification_status !== 'verified') {
    return (
      <div style={{ maxWidth: '800px', marginLeft: '260px', padding: 'var(--spacing-xl)' }}>
        <div className="card text-center" style={{ padding: 'var(--spacing-xl)' }}>
          <p style={{ color: 'var(--gray-500)' }}>You need to be verified to view connections.</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '800px', marginLeft: '260px', padding: 'var(--spacing-xl)' }}>
      <h2 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: 'var(--spacing-lg)' }}>
        Connections
      </h2>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: 'var(--spacing-md)' }}>
            Pending Requests ({pendingRequests.length})
          </h3>
          {pendingRequests.map((request) => (
            <div key={request.id} className="card" style={{ marginBottom: 'var(--spacing-md)'}}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p>Connection request from user {request.sender_id.substring(0, 8)}...</p>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                  <button onClick={() => acceptRequest(request.id)} className="btn btn-primary">
                    <Check size={18} /> Accept
                  </button>
                  <button onClick={() => rejectRequest(request.id)} className="btn btn-secondary">
                    <X size={18} /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* My Connections */}
      <div style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: 'var(--spacing-md)' }}>
          My Connections ({connections.length})
        </h3>
        {connections.length === 0 ? (
          <div className="card text-center" style={{ padding: 'var(--spacing-xl)' }}>
            <UsersIcon size={48} style={{ color: 'var(--gray-300)', margin: '0 auto var(--spacing-md)' }} />
            <p style={{ color: 'var(--gray-500)' }}>No connections yet. Start connecting!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
            {connections.map((conn) => (
              <div key={conn.id} className="card">
                <p>Connected with user {(conn.sender_id === user.id ? conn.receiver_id : conn.sender_id).substring(0, 8)}...</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Find Users */}
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: 'var(--spacing-md)' }}>
          Find People
        </h3>
        <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
          {users.slice(0, 5).map((person) => (
            <div key={person.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: '600' }}>{person.email?.split('@')[0]}</p>
                  <span className="badge badge-primary">{person.role}</span>
                </div>
                <button onClick={() => sendRequest(person.id)} className="btn btn-primary">
                  <UserPlus size={18} /> Connect
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
