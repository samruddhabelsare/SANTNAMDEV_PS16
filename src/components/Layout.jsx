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
        className="main-area"
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
            display: 'block' // Controlled by CSS
          }}
        >
          <Menu size={24} color="var(--primary-blue)" />
        </button>

        {children}
      </main>

      <style>{`
        .main-area {
          margin-left: 260px;
          flex: 1;
          padding: var(--spacing-xl);
          width: calc(100% - 260px);
          transition: margin-left 0.3s ease;
          min-height: 100vh;
        }

        /* Mobile styles */
        @media (max-width: 768px) {
          .main-area {
            margin-left: 0 !important;
            width: 100% !important;
            padding: 1rem !important;
          }
          /* Hide button on desktop, show on mobile */
          button.md\\:hidden {
            display: block !important;
          }
        }

        /* Desktop specific */
        @media (min-width: 769px) {
          button.md\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
