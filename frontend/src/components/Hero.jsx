import { motion } from 'framer-motion'
import { ArrowDown, Sparkles } from 'lucide-react'

export default function Hero({ onCTAClick }) {
  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
      padding: '8rem 2rem 4rem',
      textAlign: 'center'
    }}>
      {/* Radial glow background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(ellipse 80% 60% at 50% 40%, rgba(168,255,62,0.07) 0%, transparent 70%),
          radial-gradient(ellipse 40% 40% at 20% 80%, rgba(45,138,0,0.08) 0%, transparent 60%)
        `,
        pointerEvents: 'none'
      }} />

      {/* Floating orbs */}
      {[
        { size: 300, x: '10%', y: '20%', delay: 0 },
        { size: 200, x: '80%', y: '60%', delay: 1 },
        { size: 150, x: '60%', y: '15%', delay: 2 },
      ].map((orb, i) => (
        <motion.div key={i}
          animate={{ y: [0, -20, 0], opacity: [0.03, 0.06, 0.03] }}
          transition={{ duration: 6 + i * 2, repeat: Infinity, ease: 'easeInOut', delay: orb.delay }}
          style={{
            position: 'absolute', left: orb.x, top: orb.y,
            width: orb.size, height: orb.size, borderRadius: '50%',
            background: 'radial-gradient(circle, #a8ff3e, transparent)',
            pointerEvents: 'none'
          }}
        />
      ))}

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(168,255,62,0.08)',
          border: '1px solid rgba(168,255,62,0.2)',
          borderRadius: '100px', padding: '0.4rem 1rem',
          marginBottom: '2rem', fontSize: '0.8rem',
          color: 'var(--lime)', letterSpacing: '0.1em',
          textTransform: 'uppercase', fontWeight: 500
        }}
      >
        <Sparkles size={12} />
        AI-Powered Plant Diagnostics
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 'clamp(3rem, 8vw, 6rem)',
          fontWeight: 300, lineHeight: 1.1,
          color: 'var(--ivory)', marginBottom: '1.5rem',
          maxWidth: 800
        }}
      >
        Your plant speaks.
        <br />
        <em style={{ color: 'var(--lime)', fontStyle: 'italic' }}>We translate.</em>
      </motion.h1>

      {/* Subheading */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{
          fontSize: '1.1rem', fontWeight: 300,
          color: 'rgba(245,240,232,0.55)',
          maxWidth: 500, lineHeight: 1.7,
          marginBottom: '3rem', letterSpacing: '0.01em'
        }}
      >
        Upload a leaf image and get an instant diagnosis powered by
        EfficientNetB3 — trained on 20,000+ plant images.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}
      >
        <motion.button
          whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(168,255,62,0.3)' }}
          whileTap={{ scale: 0.97 }}
          onClick={onCTAClick}
          style={{
            background: 'var(--lime)', color: 'var(--forest)',
            border: 'none', borderRadius: '100px',
            padding: '1rem 2.5rem', fontSize: '1rem',
            fontFamily: 'DM Sans, sans-serif', fontWeight: 500,
            cursor: 'pointer', letterSpacing: '0.02em'
          }}
        >
          Analyze Your Plant
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
          style={{
            background: 'transparent', color: 'var(--ivory)',
            border: '1px solid rgba(245,240,232,0.2)',
            borderRadius: '100px', padding: '1rem 2.5rem',
            fontSize: '1rem', fontFamily: 'DM Sans, sans-serif',
            fontWeight: 300, cursor: 'pointer'
          }}
        >
          See How It Works
        </motion.button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        style={{
          display: 'flex', gap: '4rem', marginTop: '5rem',
          flexWrap: 'wrap', justifyContent: 'center'
        }}
      >
        {[
          { value: '91.8%', label: 'Test Accuracy' },
          { value: '20K+', label: 'Training Images' },
          { value: '15', label: 'Disease Classes' },
        ].map(stat => (
          <div key={stat.label} style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '2.2rem', fontWeight: 300, color: 'var(--lime)'
            }}>
              {stat.value}
            </div>
            <div style={{
              fontSize: '0.8rem', color: 'rgba(245,240,232,0.4)',
              letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.3rem'
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          position: 'absolute', bottom: '2rem',
          color: 'rgba(245,240,232,0.25)', cursor: 'pointer'
        }}
        onClick={onCTAClick}
      >
        <ArrowDown size={20} />
      </motion.div>
    </section>
  )
}