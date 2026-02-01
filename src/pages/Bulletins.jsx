import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import { Bell, Pin, Clock, Send } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Bulletins() {
  const [bulletins, setBulletins] = useState([])
  const [content, setContent] = useState('')
  const [level, setLevel] = useState('college')
  const [loading, setLoading] = useState(false)
  const { user, profile } = useAuth()

  useEffect(() => {
    fetchBulletins()
  }, [])

  const fetchBulletins = async () => {
    try {
      const { data, error } = await supabase
        .from('bulletin_posts')
        .select('*, profiles:user_id(email, role)')
        .order('created_at', { ascending: false })

      if (error) throw error
      setBulletins(data || [])
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const createBulletin = async (e) => {
    e.preventDefault()
    if (!content.trim()) return

    if (!['teacher', 'admin'].includes(profile?.role)) {
      toast.error('Only teachers and admins can post bulletins')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.from('bulletin_posts').insert({
        user_id: user.id,
        content: content.trim(),
        level,
        reference_id: level === 'college' ? null : 'sample-ref'
      })

      if (error) throw error
      toast.success('Bulletin posted!')
      setContent('')
      fetchBulletins()
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: 'var(--spacing-lg)' }}>
        <Bell size={32} style={{ display: 'inline', marginRight: 'var(--spacing-sm)', verticalAlign: 'middle' }} />
        Official Bulletins
      </h2>

      {/* Create Bulletin (Teacher/Admin only) */}
      {['teacher', 'admin'].includes(profile?.role) && (
        <div className="card" style={{ marginBottom: 'var(--spacing-xl)', backgroundColor: '#e3f2fd' }}>
          <h3 style={{ fontWeight: '600', marginBottom: 'var(--spacing-md)' }}>
            Post Official Bulletin
          </h3>
          <form onSubmit={createBulletin}>
            <div className="form-group">
              <label className="form-label">Level</label>
              <select
                className="form-select"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                <option value="college">College-wide</option>
                <option value="department">Department</option>
                <option value="class">Class</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Bulletin Content</label>
              <textarea
                className="form-textarea"
                placeholder="Important announcement..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                style={{ minHeight: '100px' }}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="spinner"></span> : <><Send size={18} /> Post Bulletin</>}
            </button>
          </form>
        </div>
      )}

      {/* Bulletins List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
        {bulletins.length === 0 ? (
          <div className="card text-center" style={{ padding: 'var(--spacing-xl)' }}>
            <Bell size={48} style={{ color: 'var(--gray-300)', margin: '0 auto var(--spacing-md)' }} />
            <p style={{ color: 'var(--gray-500)' }}>No bulletins posted yet</p>
          </div>
        ) : (
          bulletins.map((bulletin) => (
            <div key={bulletin.id} className="card" style={{
              borderLeft: `4px solid ${bulletin.level === 'college' ? 'var(--primary-blue)' : bulletin.level === 'department' ? 'var(--secondary-orange)' : 'var(--success-green)'}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-md)' }}>
                <div>
                  <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xs)' }}>
                    <span className={`badge ${bulletin.level === 'college' ? 'badge-primary' : bulletin.level === 'department' ? 'badge-warning' : 'badge-success'}`}>
                      {bulletin.level.toUpperCase()}
                    </span>
                    <span className="badge badge-info">
                      {bulletin.profiles?.role?.toUpperCase()}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                    Posted by: {bulletin.profiles?.email?.split('@')[0]}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', color: 'var(--gray-500)', fontSize: '0.8125rem' }}>
                  <Clock size={14} />
                  {formatTime(bulletin.created_at)}
                </div>
              </div>

              <p style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--gray-900)' }}>
                {bulletin.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
