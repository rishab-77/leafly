import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Mail, Lock, AlertCircle, Leaf } from 'lucide-react'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  // Focus states
  const [focusedInput, setFocusedInput] = useState(null)
  
  const { signup, loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  async function handleGoogleLogin() {
    try {
      setError('')
      setLoading(true)
      await loginWithGoogle()
      navigate('/')
    } catch (err) {
      setError('Failed to sign up with Google. ' + err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    if (password !== passwordConfirm) {
      return setError('Passwords do not match')
    }

    try {
      setError('')
      setLoading(true)
      await signup(email, password)
      navigate('/')
    } catch (err) {
      setError('Failed to create an account. ' + err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      paddingTop: '80px', minHeight: '100vh',
      backgroundColor: '#0a0f0a', display: 'flex', 
      alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden'
    }}>
      {/* --- Optimized Noise Overlay --- */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
        opacity: 0.15,
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")'
      }} />

      {/* --- Optimized Background Gradients --- */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '100vw', height: '100vw',
        background: 'radial-gradient(circle at 50% 50%, rgba(168,255,62,0.05) 0%, transparent 60%)',
        pointerEvents: 'none', zIndex: 0
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          background: 'rgba(10, 20, 12, 0.6)',
          border: '1px solid rgba(168,255,62,0.1)',
          borderRadius: '24px', padding: '3.5rem 3rem',
          width: '100%', maxWidth: '420px',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
          position: 'relative', zIndex: 10
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'linear-gradient(135deg, #a8ff3e, #2d8a00)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(168,255,62,0.3)'
          }}>
            <Leaf size={24} color="#0a1a0f" strokeWidth={2.5} />
          </div>
        </div>

        <h2 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '2.5rem', fontWeight: 400,
          color: '#f5f0e8', textAlign: 'center',
          marginBottom: '2rem'
        }}>
          Create Account
        </h2>

        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            style={{
              background: 'rgba(255, 77, 77, 0.1)',
              border: '1px solid rgba(255, 77, 77, 0.3)',
              padding: '1rem', borderRadius: '12px',
              color: '#ff4d4d', fontSize: '0.9rem',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              marginBottom: '1.5rem'
            }}
          >
            <AlertCircle size={18} />
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          
          <div style={{ position: 'relative' }}>
            <Mail size={18} color={focusedInput === 'email' ? '#a8ff3e' : 'rgba(245,240,232,0.4)'} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', transition: 'color 0.3s' }} />
            <input 
              type="email" 
              placeholder="Email Address" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedInput('email')}
              onBlur={() => setFocusedInput(null)}
              style={{
                width: '100%', padding: '1rem 1rem 1rem 3.2rem',
                background: 'rgba(255,255,255,0.03)', 
                border: `1px solid ${focusedInput === 'email' ? 'rgba(168,255,62,0.5)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '12px', color: '#f5f0e8', fontSize: '1rem',
                outline: 'none', fontFamily: 'Inter, sans-serif',
                transition: 'all 0.3s ease',
                boxShadow: focusedInput === 'email' ? '0 0 0 3px rgba(168,255,62,0.1)' : 'none'
              }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={18} color={focusedInput === 'password' ? '#a8ff3e' : 'rgba(245,240,232,0.4)'} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', transition: 'color 0.3s' }} />
            <input 
              type="password" 
              placeholder="Password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedInput('password')}
              onBlur={() => setFocusedInput(null)}
              style={{
                width: '100%', padding: '1rem 1rem 1rem 3.2rem',
                background: 'rgba(255,255,255,0.03)', 
                border: `1px solid ${focusedInput === 'password' ? 'rgba(168,255,62,0.5)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '12px', color: '#f5f0e8', fontSize: '1rem',
                outline: 'none', fontFamily: 'Inter, sans-serif',
                transition: 'all 0.3s ease',
                boxShadow: focusedInput === 'password' ? '0 0 0 3px rgba(168,255,62,0.1)' : 'none'
              }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={18} color={focusedInput === 'passwordConfirm' ? '#a8ff3e' : 'rgba(245,240,232,0.4)'} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', transition: 'color 0.3s' }} />
            <input 
              type="password" 
              placeholder="Confirm Password" 
              required
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              onFocus={() => setFocusedInput('passwordConfirm')}
              onBlur={() => setFocusedInput(null)}
              style={{
                width: '100%', padding: '1rem 1rem 1rem 3.2rem',
                background: 'rgba(255,255,255,0.03)', 
                border: `1px solid ${focusedInput === 'passwordConfirm' ? 'rgba(168,255,62,0.5)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '12px', color: '#f5f0e8', fontSize: '1rem',
                outline: 'none', fontFamily: 'Inter, sans-serif',
                transition: 'all 0.3s ease',
                boxShadow: focusedInput === 'passwordConfirm' ? '0 0 0 3px rgba(168,255,62,0.1)' : 'none'
              }}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 10px 25px rgba(168,255,62,0.2)' }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            type="submit"
            style={{
              background: 'linear-gradient(135deg, #a8ff3e, #85cc2b)', color: '#0a1a0f',
              padding: '1rem', borderRadius: '12px', border: 'none',
              fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '1rem', opacity: loading ? 0.7 : 1,
              transition: 'opacity 0.3s'
            }}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </motion.button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '2rem 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
          <span style={{ color: 'rgba(245,240,232,0.4)', fontSize: '0.85rem', fontFamily: 'Inter, sans-serif' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
        </div>

        <motion.button
          onClick={handleGoogleLogin}
          whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
          style={{
            width: '100%', padding: '0.9rem', borderRadius: '12px',
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            color: '#f5f0e8', fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 500,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
            transition: 'all 0.3s ease'
          }}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
            <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
              <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
              <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
              <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
              <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
            </g>
          </svg>
          Continue with Google
        </motion.button>

        <p style={{
          textAlign: 'center', marginTop: '2rem',
          color: 'rgba(245,240,232,0.6)', fontSize: '0.95rem',
          fontFamily: 'Inter, sans-serif'
        }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#a8ff3e', textDecoration: 'none', fontWeight: 500 }}>
            Log In
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
