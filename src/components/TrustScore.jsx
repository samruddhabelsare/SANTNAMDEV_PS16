import React from 'react'

export default function TrustScore({ score = 100 }) {
  // Ensure score is between 0 and 100
  const normalizedScore = Math.min(Math.max(score, 0), 100)
  
  return (
    <div className="trust-score-circle" style={{ '--score-percent': `${normalizedScore}%` }}>
      <div className="trust-score-inner">
        <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--gray-900)' }}>
          {normalizedScore}
        </span>
        <span style={{ fontSize: '0.625rem', color: 'var(--gray-500)', textTransform: 'uppercase', fontWeight: '600' }}>
          Trust Score
        </span>
      </div>
    </div>
  )
}
