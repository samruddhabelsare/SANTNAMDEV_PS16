import React, { useState, useEffect, useRef } from 'react'
import { Bell, X, Check, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const { user } = useAuth()
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (user) {
      fetchNotifications()
      const subscription = supabase
        .channel('notifications')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        }, (payload) => {
          setNotifications(prev => [payload.new, ...prev])
          setUnreadCount(prev => prev + 1)
          toast('New Notification: ' + payload.new.title, { icon: '🔔' })
        })
        .subscribe()

      return () => {
        supabase.removeChannel(subscription)
      }
    }
  }, [user])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error // Table might not exist yet, catch error
      setNotifications(data || [])
      setUnreadCount(data?.filter(n => !n.is_read).length || 0)
    } catch (error) {
      console.warn('Error fetching notifications (table might be missing):', error.message)
      // Fallback for demo if table missing
      setNotifications([
        { id: '1', title: 'Welcome!', message: 'Welcome to YuvaSetu Dashboard.', type: 'success', is_read: false, created_at: new Date().toISOString() }
      ])
      setUnreadCount(1)
    }
  }

  const markAsRead = async (id) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)
      
      if (error) throw error
      
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      // Local update for demo
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
  }

  const deleteNotification = async (id, e) => {
    e.stopPropagation()
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setNotifications(prev => prev.filter(n => n.id !== id))
    } catch (error) {
      // Local delete for demo
      setNotifications(prev => prev.filter(n => n.id !== id))
    }
  }

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle size={16} className="text-green-500" />
      case 'warning': return <AlertTriangle size={16} className="text-yellow-500" />
      case 'error': return <XCircle size={16} className="text-red-500" />
      default: return <Info size={16} className="text-blue-500" />
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="glass-card relative p-2 hover:bg-gray-100 transition-colors"
        style={{ borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Bell size={20} className="text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justifyContent-center rounded-full bg-red-500 text-[10px] text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 z-50 glass-card overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-white/50">
            <h3 className="font-semibold text-gray-800">Notifications</h3>
            <span className="text-xs text-gray-500">{unreadCount} unread</span>
          </div>
          
          <div className="max-h-[300px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell size={24} className="mx-auto mb-2 opacity-20" />
                <p className="text-sm">No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={`p-3 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer flex gap-3 ${!notification.is_read ? 'bg-blue-50/50' : ''}`}
                >
                  <div className="mt-1 flex-shrink-0">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!notification.is_read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {new Date(notification.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <button 
                    onClick={(e) => deleteNotification(notification.id, e)}
                    className="text-gray-400 hover:text-red-500 self-start p-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
