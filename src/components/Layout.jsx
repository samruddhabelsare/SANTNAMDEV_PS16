import React, { useState } from 'react'
import { Menu } from 'lucide-react'
import Sidebar from './Sidebar'

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main 
        className="main-content"
        style={{
          marginLeft: '260px',
          flex: 1,
          padding: 'var(--spacing-xl)',
          width: 'calc(100% - 260px)',
          transition: 'margin-left 0.3s ease',
          minHeight: '100vh'
        }}
      >
        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden glass-card"
          style={{
            position: 'fixed',
            top: '1rem',
            right: '1rem',
            zIndex: 40,
            padding: '8px',
            display: 'none' // Hidden by default, shown via media query
          }}
        >
          <Menu size={24} color="var(--primary-blue)" />
        </button>

        {children}
      </main>

      <style>{`
        @media (max-width: 768px) {
          .main-content {
            margin-left: 0 !important;
            width: 100% !important;
            padding: 1rem !important;
          }
          button.md\\:hidden {
            display: block !important;
          }
        }
      `}</style>
    </div>
  )
}
