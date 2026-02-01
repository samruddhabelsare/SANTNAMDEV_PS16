import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import { School, Users, BookOpen } from 'lucide-react'

export default function Classrooms() {
  const [classrooms, setClassrooms] = useState([])
  const { user, profile } = useAuth()

  useEffect(() => {
    fetchClassrooms()
  }, [])

  const fetchClassrooms = async () => {
    try {
      const { data, error } = await supabase
        .from('classrooms')
        .select('*')

      if (error) throw error
      setClassrooms(data || [])
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div style={{ maxWidth: '800px', marginLeft: '260px', padding: 'var(--spacing-xl)' }}>
      <h2 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: 'var(--spacing-lg)' }}>
        Classrooms
      </h2>

      {classrooms.length === 0 ? (
        <div className="card text-center" style={{ padding: 'var(--spacing-xl)' }}>
          <School size={48} style={{ color: 'var(--gray-300)', margin: '0 auto var(--spacing-md)' }} />
          <p style={{ color: 'var(--gray-500)' }}>No classrooms available yet</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
          {classrooms.map((classroom) => (
            <div key={classroom.id} className="card">
              <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--primary-blue)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <School size={32} style={{ color: 'white' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: 'var(--spacing-xs)' }}>
                    {classroom.name || 'Classroom'}
                  </h3>
                  <div style={{ display: 'flex', gap: 'var(--spacing-md)', fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                    <span className={`badge ${classroom.type === 'official' ? 'badge-primary' : 'badge-info'}`}>
                      {classroom.type === 'official' ? 'Official' : 'Unofficial'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Users size={14} />
                      Members
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
