import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import { Send, Image as ImageIcon, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Feed() {
  const [posts, setPosts] = useState([])
  const [content, setContent] = useState('')
  const [mediaUrl, setMediaUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const { user, profile } = useAuth()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (email, role, verification_status)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    }
  }

  const createPost = async (e) => {
    e.preventDefault()
    if (!content.trim()) return

    if (profile?.verification_status !== 'verified') {
      toast.error('Only verified users can post')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.from('posts').insert({
        user_id: user.id,
        content: content.trim(),
        media_url: mediaUrl.trim() || null
      })

      if (error) throw error
      toast.success('Post created!')
      setContent('')
      setMediaUrl('')
      fetchPosts()
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h2 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: 'var(--spacing-md)' }}>
          Feed
        </h2>

        {/* Create Post Form */}
        {profile?.verification_status === 'verified' && (
          <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
            <form onSubmit={createPost}>
              <div className="form-group">
                <textarea
                  className="form-textarea"
                  placeholder="What's on your mind?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  style={{ minHeight: '100px' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <ImageIcon size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
                  Media URL (optional)
                </label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://example.com/image.jpg"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <span className="spinner"></span> : <><Send size={18} /> Post</>}
              </button>
            </form>
          </div>
        )}

        {/* Posts List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          {posts.length === 0 ? (
            <div className="card text-center" style={{ padding: 'var(--spacing-xl)' }}>
              <p style={{ color: 'var(--gray-500)' }}>No posts yet. Be the first to post!</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="card">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-blue)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '1.125rem',
                    flexShrink: 0
                  }}>
                    {post.profiles?.email?.[0]?.toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: '600' }}>
                        {post.profiles?.email?.split('@')[0]}
                      </span>
                      {post.profiles?.verification_status === 'verified' && (
                        <span className="badge badge-success" style={{ fontSize: '0.6875rem', padding: '0.125rem 0.375rem' }}>
                          Verified
                        </span>
                      )}
                      <span className="badge badge-primary" style={{ fontSize: '0.6875rem', padding: '0.125rem 0.375rem' }}>
                        {post.profiles?.role}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', color: 'var(--gray-500)', fontSize: '0.8125rem' }}>
                      <Clock size={12} />
                      {formatTime(post.created_at)}
                    </div>
                  </div>
                </div>

                <p style={{ marginBottom: post.media_url ? 'var(--spacing-md)' : 0, lineHeight: 1.6 }}>
                  {post.content}
                </p>

                {post.media_url && (
                  <img
                    src={post.media_url}
                    alt="Post media"
                    style={{
                      width: '100%',
                      maxHeight: '400px',
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-md)',
                      marginTop: 'var(--spacing-md)'
                    }}
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
