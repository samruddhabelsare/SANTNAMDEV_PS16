import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  Home,
  Users,
  Bell,
  CheckCircle,
  AlertCircle,
  Shield
} from 'lucide-react'
import StatCard from '../components/StatCard'
import TrustScore from '../components/TrustScore'
import NotificationsDropdown from '../components/NotificationsDropdown'

export default function Dashboard() {
  const { user, profile } = useAuth()

  const getVerificationBadge = () => {
    if (!profile) return null
    if (profile.verification_status === 'verified') {
      return (
        <span className="badge badge-success">
          <CheckCircle size={12} />
          Verified
        </span>
      )
    } else if (profile.verification_status === 'pending') {
      return (
        <span className="badge badge-warning">
          <AlertCircle size={12} />
          Pending
        </span>
      )
    } else {
      return (
        <span className="badge badge-error">
          <AlertCircle size={12} />
          Rejected
        </span>
      )
    }
  }

  return (
    <>
        {/* Header Section */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: 'var(--spacing-xl)',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h2 className="gradient-text" style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.25rem' }}>
              Dashboard
            </h2>
            <p style={{ color: 'var(--gray-500)', fontSize: '1rem' }}>
              Welcome back, {profile?.role === 'student' ? 'Future Leader' : 'Professor'} {user?.email?.split('@')[0]}
            </p>
          </div>
          
          <NotificationsDropdown />
        </div>

        {/* Verification Alert */}
        {profile?.verification_status === 'pending' && (
          <div className="glass-card" style={{
            padding: 'var(--spacing-lg)',
            backgroundColor: '#fff3cd', // Override glass background
            border: '1px solid #ffc107',
            marginBottom: 'var(--spacing-xl)',
            display: 'flex',
            gap: '1rem',
            alignItems: 'flex-start'
          }}>
            <AlertCircle size={24} color="#856404" style={{ marginTop: '2px' }} />
            <div>
              <h3 style={{ fontWeight: '700', color: '#856404', marginBottom: '0.25rem' }}>
                Verification Pending
              </h3>
              <p style={{ color: '#856404', fontSize: '0.9375rem' }}>
                Your account is currently under review. Access to some features may be limited until an administrator verifies your identity.
              </p>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-xl)'
        }}>
          {/* Trust Score Card */}
          <div className="card glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Your Reputation
              </p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--gray-900)', marginTop: '0.5rem' }}>
                Trust Score
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--primary-blue)', marginTop: '0.25rem' }}>
                Top 5% of students
              </p>
            </div>
            <TrustScore score={profile?.trust_score || 100} />
          </div>

          <StatCard 
            label="Verification Status" 
            value={
              <span className={`badge ${
                profile?.verification_status === 'verified' ? 'badge-success' : 
                profile?.verification_status === 'rejected' ? 'badge-error' : 'badge-warning'
              }`} style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
                {profile?.verification_status?.charAt(0).toUpperCase() + profile?.verification_status?.slice(1)}
              </span>
            } 
            icon={Shield} 
            colorClass="text-green-600"
          />

          <StatCard 
            label="Networking" 
            value="12 Connections" 
            icon={Users} 
            colorClass="text-purple-600"
            trend="+3"
          />
        </div>

        {/* Quick Actions Grid */}
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: 'var(--spacing-lg)', color: 'var(--gray-800)' }}>
          Quick Actions
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--spacing-lg)' }}>
          <Link to="/feed" className="card glass-card" style={{ textDecoration: 'none', transition: 'transform 0.2s' }}>
            <div style={{ 
              width: '48px', height: '48px', borderRadius: '12px', 
              backgroundColor: 'rgba(19, 127, 236, 0.1)', display: 'flex', 
              alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' 
            }}>
              <Home size={24} color="var(--primary-blue)" />
            </div>
            <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--gray-900)', marginBottom: '0.5rem' }}>
              View Feed
            </h4>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>
              Check latest updates from your college network.
            </p>
          </Link>

          <Link to="/connections" className="card glass-card" style={{ textDecoration: 'none', transition: 'transform 0.2s' }}>
            <div style={{ 
              width: '48px', height: '48px', borderRadius: '12px', 
              backgroundColor: 'rgba(255, 152, 0, 0.1)', display: 'flex', 
              alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' 
            }}>
              <Users size={24} color="var(--secondary-orange)" />
            </div>
            <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--gray-900)', marginBottom: '0.5rem' }}>
              Find Mentors
            </h4>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>
              Connect with alumni and teachers for guidance.
            </p>
          </Link>

          <Link to="/bulletins" className="card glass-card" style={{ textDecoration: 'none', transition: 'transform 0.2s' }}>
            <div style={{ 
              width: '48px', height: '48px', borderRadius: '12px', 
              backgroundColor: 'rgba(40, 167, 69, 0.1)', display: 'flex', 
              alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' 
            }}>
              <Bell size={24} color="var(--success-green)" />
            </div>
            <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--gray-900)', marginBottom: '0.5rem' }}>
              Official Bulletins
            </h4>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>
              Important notices from university administration.
            </p>
          </Link>
        </div>
        
        <style>{`
        .glass-card:hover {
          transform: translateY(-4px);
          transition: transform 0.2s ease;
        }
      `}</style>
    </>
  )
}

