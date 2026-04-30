import { motion } from 'framer-motion'
import { Leaf } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const links = [
  { label: 'How It Works', path: '/how-it-works' },
  { label: 'Plants',       path: '/plants' },
  { label: 'About',        path: '/about' },
]

export default function Navbar() {
  const location = useLocation()

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        backdropFilter: 'blur(24px)',
        background: 'rgba(10,26,15,0.92)',
        borderBottom: '1px solid rgba(168,255,62,0.12)',
        boxShadow: '0 18px 60px rgba(0,0,0,0.16)',
      }}
    >
      <div className="navbar-inner" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '1rem', maxWidth: 1320, margin: '0 auto', padding: '0.95rem 2rem'
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: 38, height: 38, borderRadius: '50%',
            background: 'linear-gradient(135deg, #a8ff3e, #2d8a00)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Leaf size={18} color="#0a1a0f" strokeWidth={2.5} />
          </div>
        <span style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '1.4rem', fontWeight: 400,
          letterSpacing: '0.05em', color: '#f5f0e8'
        }}>
          Leafly
        </span>
      </Link>

      {/* Nav links */}
      <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        {links.map(link => {
          const active = location.pathname === link.path
          return (
            <Link key={link.path} to={link.path} className="nav-link" style={{
              color: active ? 'var(--lime)' : 'rgba(245,240,232,0.65)',
              textDecoration: 'none', fontSize: '0.9rem',
              fontWeight: 400, letterSpacing: '0.05em',
              borderBottom: active ? '1px solid var(--lime)' : '1px solid transparent',
              paddingBottom: '2px', transition: 'all 0.2s'
            }}>
              {link.label}
            </Link>
          )
        })}

        <Link to="/analyze" className="nav-link nav-cta">
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 12px 32px rgba(168,255,62,0.18)' }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: 'var(--lime)', color: 'var(--forest)',
              borderRadius: '100px', padding: '0.65rem 1.55rem',
              fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', fontWeight: 500,
              cursor: 'pointer', letterSpacing: '0.02em'
            }}
          >
            Analyze Plant
          </motion.button>
        </Link>
      </div>
    </div>
    </motion.nav>
  )
}