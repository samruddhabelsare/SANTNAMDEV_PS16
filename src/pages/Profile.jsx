import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Mail, Shield, Award, CheckCircle } from 'lucide-react'

export default function Profile() {
  const { user, profile } = useAuth()

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: 'var(--spacing-lg)' }}>
        My Profile
      </h2>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-blue)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '2.5rem',
            fontWeight: '700',
            flexShrink: 0
          }}>
            {user?.email?.[0]?.toUpperCase()}
          </div>

          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: 'var(--spacing-sm)' }}>
              {user?.email?.split('@')[0]}
            </h3>
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
              <span className="badge badge-primary">
                {profile?.role?.charAt(0).toUpperCase() + profile?.role?.slice(1)}
              </span>
              {profile?.verification_status === 'verified' && (
                <span className="badge badge-success">
                  <CheckCircle size={12} /> Verified
                </span>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', fontWeight: '600', marginBottom: 'var(--spacing-xs)', color: 'var(--gray-700)' }}>
              <Mail size={16} />
              Email
            </label>
            <p style={{ fontSize: '1rem', color: 'var(--gray-600)' }}>{user?.email}</p>
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', fontWeight: '600', marginBottom: 'var(--spacing-xs)', color: 'var(--gray-700)' }}>
              <Shield size={16} />
              Trust Score
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
              <div style={{
                flex: 1,
                height: '8px',
                backgroundColor: 'var(--gray-200)',
                borderRadius: '9999px',
                overflow: 'hidden',
                maxWidth: '300px'
              }}>
                <div style={{
                  height: '100%',
                  width: `${profile?.trust_score || 100}%`,
                  backgroundColor: 'var(--success-green)',
                  borderRadius: '9999px'
                }}></div>
              </div>
              <span style={{ fontWeight: '600', fontSize: '1.125rem', color: 'var(--success-green)' }}>
                {profile?.trust_score || 100}/100
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginTop: 'var(--spacing-xs)' }}>
              Your trust score reflects your positive contributions to the community
            </p>
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', fontWeight: '600', marginBottom: 'var(--spacing-xs)', color: 'var(--gray-700)' }}>
              <Award size={16} />
              Verification Status
            </label>
            <p style={{ fontSize: '1rem' }}>
              {profile?.verification_status === 'verified' && (
                <span style={{ color: 'var(--success-green)' }}>✓ Verified Account</span>
              )}
              {profile?.verification_status === 'pending' && (
                <span style={{ color: 'var(--warning-yellow)' }}>⚠ Pending Verification</span>
              )}
              {profile?.verification_status === 'rejected' && (
                <span style={{ color: 'var(--error-red)' }}>✗ Verification Rejected</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
