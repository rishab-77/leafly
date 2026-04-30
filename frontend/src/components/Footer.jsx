import { Leaf } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '3rem 2rem',
    }}>
      <div style={{
        maxWidth: 900, margin: '0 auto',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Leaf size={14} color="var(--lime)" />
          <span style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '1.1rem', color: 'var(--ivory)', opacity: 0.6
          }}>
            Leafly
          </span>
        </div>

        <div style={{ display: 'flex', gap: '2rem' }}>
          {[
            { label: 'Analyze',      path: '/analyze' },
            { label: 'How It Works', path: '/how-it-works' },
            { label: 'Plants',       path: '/plants' },
            { label: 'About',        path: '/about' },
          ].map(link => (
            <Link key={link.path} to={link.path} style={{
              color: 'rgba(245,240,232,0.3)', textDecoration: 'none',
              fontSize: '0.82rem', transition: 'color 0.2s'
            }}
              onMouseEnter={e => e.target.style.color = 'var(--lime)'}
              onMouseLeave={e => e.target.style.color = 'rgba(245,240,232,0.3)'}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <p style={{ fontSize: '0.75rem', color: 'rgba(245,240,232,0.2)' }}>
          EfficientNetB3 · PlantVillage · 91.8% Accuracy
        </p>
      </div>
    </footer>
  )
}