import React from 'react'

export default function StatCard({ label, value, icon: Icon, colorClass = 'text-blue-600', trend }) {
  return (
    <div className="card glass-card" style={{ padding: 'var(--spacing-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', fontWeight: '500' }}>{label}</p>
          <h3 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--gray-900)', marginTop: '4px' }}>
            {value}
          </h3>
        </div>
        <div style={{ 
          padding: '8px', 
          borderRadius: '8px', 
          backgroundColor: 'var(--gray-50)',
          color: 'var(--primary-blue)' 
        }}>
          <Icon size={24} />
        </div>
      </div>
      {trend && (
        <p style={{ fontSize: '0.75rem', color: 'var(--success-green)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>↑ {trend}</span>
          <span style={{ color: 'var(--gray-400)' }}>vs last month</span>
        </p>
      )}
    </div>
  )
}
