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
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.2rem 3rem',
        backdropFilter: 'blur(20px)',
        background: 'rgba(10,26,15,0.85)',
        borderBottom: '1px solid rgba(168,255,62,0.08)',
      }}
    >
      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'linear-gradient(135deg, #a8ff3e, #2d8a00)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Leaf size={16} color="#0a1a0f" strokeWidth={2.5} />
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
        {links.map(link => {
          const active = location.pathname === link.path
          return (
            <Link key={link.path} to={link.path} style={{
              color: active ? 'var(--lime)' : 'rgba(245,240,232,0.6)',
              textDecoration: 'none', fontSize: '0.85rem',
              fontWeight: 400, letterSpacing: '0.05em',
              borderBottom: active ? '1px solid var(--lime)' : '1px solid transparent',
              paddingBottom: '2px', transition: 'all 0.2s'
            }}>
              {link.label}
            </Link>
          )
        })}

        <Link to="/analyze">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: 'var(--lime)', color: 'var(--forest)',
              border: 'none', borderRadius: '100px',
              padding: '0.55rem 1.4rem',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.85rem', fontWeight: 500,
              cursor: 'pointer', letterSpacing: '0.02em'
            }}
          >
            Analyze Plant
          </motion.button>
        </Link>
      </div>
    </motion.nav>
  )
}