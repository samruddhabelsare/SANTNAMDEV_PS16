import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import { Send, MessageCircle as MessageIcon } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Chat() {
  const [connections, setConnections] = useState([])
  const [selectedContact, setSelectedContact] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const { user, profile } = useAuth()

  useEffect(() => {
    if (profile?.verification_status === 'verified') {
      fetchConnections()
    }
  }, [profile])

  useEffect(() => {
    if (selectedContact) {
      fetchMessages()
      subscribeToMessages()
    }
  }, [selectedContact])

  const fetchConnections = async () => {
    if (localStorage.getItem('mockMode') === 'true') {
      setConnections([
        { id: 'mock-conn-1', sender_id: 'Sarah (Project Lead)', receiver_id: user.id, status: 'accepted' },
        { id: 'mock-conn-2', sender_id: 'Dr. Smith (Professor)', receiver_id: user.id, status: 'accepted' }
      ])
      return
    }
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

  const fetchMessages = async () => {
    if (localStorage.getItem('mockMode') === 'true') {
      const { mockStore } = await import('../lib/mockStore')
      const allMessages = mockStore.getMessages()
      // Filter messages for selected contact
      const filtered = allMessages.filter(m => 
        (m.sender_id === selectedContact && m.receiver_id === user.id) ||
        (m.sender_id === user.id && m.receiver_id === selectedContact)
      )
      setMessages(filtered)
      return
    }
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${selectedContact}),and(sender_id.eq.${selectedContact},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true })

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const subscribeToMessages = () => {
    const channel = supabase
      .channel('chat')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      }, (payload) => {
        if (
          (payload.new.sender_id === selectedContact && payload.new.receiver_id === user.id) ||
          (payload.new.sender_id === user.id && payload.new.receiver_id === selectedContact)
        ) {
          setMessages((prev) => [...prev, payload.new])
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedContact) return

    if (localStorage.getItem('mockMode') === 'true') {
      const { mockStore } = await import('../lib/mockStore')
      mockStore.addMessage({
        sender_id: user.id,
        receiver_id: selectedContact,
        message: newMessage.trim(),
        created_at: new Date().toISOString()
      })
      setNewMessage('')
      fetchMessages() // Refresh list
      return
    }

    try {
      const { error } = await supabase.from('messages').insert({
        sender_id: user.id,
        receiver_id: selectedContact,
        message: newMessage.trim()
      })

      if (error) throw error
      setNewMessage('')
    } catch (error) {
      toast.error(error.message)
    }
  }

  if (profile?.verification_status !== 'verified') {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="card text-center" style={{ padding: 'var(--spacing-xl)' }}>
          <p style={{ color: 'var(--gray-500)' }}>You need to be verified to access chat.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card" style={{ display: 'flex', height: 'calc(100vh - 100px)', overflow: 'hidden', padding: 0 }}>
      {/* Contacts List */}
      <div style={{
        width: '300px',
        borderRight: '1px solid var(--gray-200)',
        backgroundColor: 'white',
        overflow: 'auto'
      }}>
        <div style={{ padding: 'var(--spacing-lg)', borderBottom: '1px solid var(--gray-200)' }}>
          <h3 style={{ fontWeight: '600' }}>Messages</h3>
        </div>
        {connections.length === 0 ? (
          <div style={{ padding: 'var(--spacing-lg)', textAlign: 'center' }}>
            <MessageIcon size={48} style={{ color: 'var(--gray-300)', margin: '0 auto var(--spacing-md)' }} />
            <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>No connections yet</p>
          </div>
        ) : (
          connections.map((conn) => {
            const contactId = conn.sender_id === user.id ? conn.receiver_id : conn.sender_id
            return (
              <div
                key={conn.id}
                onClick={() => setSelectedContact(contactId)}
                style={{
                  padding: 'var(--spacing-md) var(--spacing-lg)',
                  cursor: 'pointer',
                  backgroundColor: selectedContact === contactId ? 'var(--gray-100)' : 'transparent',
                  borderBottom: '1px solid var(--gray-100)',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => {
                  if (selectedContact !== contactId) e.target.style.backgroundColor = 'var(--gray-50)'
                }}
                onMouseOut={(e) => {
                  if (selectedContact !== contactId) e.target.style.backgroundColor = 'transparent'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
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
                    fontSize: '1rem'
                  }}>
                    {contactId[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontWeight: '600', fontSize: '0.875rem' }}>
                      {contactId.substring(0, 8)}...
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                      Click to chat
                    </p>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--gray-50)' }}>
        {selectedContact ? (
          <>
            <div style={{
              padding: 'var(--spacing-lg)',
              backgroundColor: 'white',
              borderBottom: '1px solid var(--gray-200)'
            }}>
              <p style={{ fontWeight: '600' }}>Chat with {selectedContact.substring(0, 8)}...</p>
            </div>

            <div style={{ flex: 1, overflow: 'auto', padding: 'var(--spacing-lg)' }}>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: msg.sender_id === user.id ? 'flex-end' : 'flex-start',
                    marginBottom: 'var(--spacing-md)'
                  }}
                >
                  <div
                    style={{
                      maxWidth: '70%',
                      padding: 'var(--spacing-sm) var(--spacing-md)',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: msg.sender_id === user.id ? 'var(--primary-blue)' : 'white',
                      color: msg.sender_id === user.id ? 'white' : 'var(--gray-900)',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <p>{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={sendMessage} style={{
              padding: 'var(--spacing-lg)',
              backgroundColor: 'white',
              borderTop: '1px solid var(--gray-200)',
              display: 'flex',
              gap: 'var(--spacing-sm)'
            }}>
              <input
                type="text"
                className="form-input"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn btn-primary">
                <Send size={18} />
              </button>
            </form>
          </>
        ) : (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
          }}>
            <MessageIcon size={64} style={{ color: 'var(--gray-300)', marginBottom: 'var(--spacing-md)' }} />
            <p style={{ color: 'var(--gray-500)' }}>Select a contact to start chatting</p>
          </div>
        )}
      </div>
    </div>
  )
}
