import { motion } from 'framer-motion'
import { CheckCircle, AlertTriangle, XCircle, RefreshCw } from 'lucide-react'
import { diseaseInfo } from '../data/diseases'

const severityConfig = {
  healthy:  { color: '#a8ff3e', icon: CheckCircle,     label: 'Healthy',  bg: 'rgba(168,255,62,0.08)'  },
  moderate: { color: '#ffc844', icon: AlertTriangle,   label: 'Moderate', bg: 'rgba(255,200,68,0.08)'  },
  severe:   { color: '#ff4d4d', icon: XCircle,         label: 'Severe',   bg: 'rgba(255,77,77,0.08)'   },
}

export default function ResultCard({ result, preview, onReset }) {
  const info = diseaseInfo[result.disease] || {
    display: result.disease,
    severity: 'moderate',
    emoji: '🌿',
    description: 'Disease detected in leaf sample.',
    treatment: 'Consult an agricultural specialist.'
  }

  const sev = severityConfig[info.severity]
  const Icon = sev.icon

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      style={{ padding: '0 2rem 6rem', maxWidth: 780, margin: '0 auto' }}
    >
      {/* Result card */}
      <div style={{
        background: 'var(--glass)',
        border: `1px solid ${sev.color}30`,
        borderRadius: 'var(--radius)',
        backdropFilter: 'blur(20px)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-soft)'
      }}>
        {/* Top bar */}
        <div style={{
          background: sev.bg,
          borderBottom: `1px solid ${sev.color}20`,
          padding: '1rem 1.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Icon size={18} color={sev.color} />
            <span style={{ color: sev.color, fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.05em' }}>
              {sev.label} — Analysis Complete
            </span>
          </div>
          <span style={{
            color: 'rgba(245,240,232,0.6)', fontSize: '0.8rem',
            padding: '0.4rem 0.75rem', borderRadius: 999,
            background: 'rgba(255,255,255,0.05)'
          }}>
            {result.confidence}% confidence
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
          {/* Left — image */}
          <div style={{ position: 'relative', minHeight: 280 }}>
            <img src={preview} alt="Analyzed leaf"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: `linear-gradient(to right, rgba(10,26,15,0.88) 20%, transparent 70%)`
            }} />
          </div>

          {/* Right — result */}
          <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{info.emoji}</div>
              <h2 style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '1.6rem', fontWeight: 300,
                color: 'var(--ivory)', lineHeight: 1.3, marginBottom: '1rem'
              }}>
                {info.display}
              </h2>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                <span style={{
                  color: sev.color, background: `${sev.color}20`,
                  padding: '0.5rem 0.85rem', borderRadius: 999,
                  fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.05em'
                }}>
                  {sev.label}
                </span>
                <span style={{
                  color: 'rgba(245,240,232,0.5)', fontSize: '0.78rem',
                  letterSpacing: '0.08em', textTransform: 'uppercase'
                }}>
                  {result.confidence}% confident
                </span>
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{
                fontSize: '0.92rem', color: 'rgba(245,240,232,0.72)',
                lineHeight: 1.75, marginBottom: '1rem'
              }}>
                {info.description}
              </p>
              <div style={{
                height: 8, background: 'rgba(255,255,255,0.07)',
                borderRadius: 999, overflow: 'hidden'
              }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${result.confidence}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                  style={{
                    height: '100%', borderRadius: 999,
                    background: `linear-gradient(90deg, ${sev.color}88, ${sev.color})`,
                    boxShadow: `0 0 14px ${sev.color}60`
                  }}
                />
              </div>
            </div>

            {/* Treatment */}
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16, padding: '1.2rem'
            }}>
              <p style={{
                fontSize: '0.75rem', color: 'rgba(245,240,232,0.45)',
                letterSpacing: '0.12em', textTransform: 'uppercase',
                marginBottom: '0.5rem'
              }}>
                Recommended Action
              </p>
              <p style={{ fontSize: '0.92rem', color: 'rgba(245,240,232,0.78)', lineHeight: 1.8 }}>
                {info.treatment}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Try another */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <motion.button
          whileHover={{ scale: 1.03, boxShadow: '0 0 24px rgba(255,255,255,0.08)' }}
          whileTap={{ scale: 0.97 }}
          onClick={onReset}
          style={{
            background: 'transparent',
            border: '1px solid rgba(245,240,232,0.18)',
            color: 'rgba(245,240,232,0.75)',
            borderRadius: '100px', padding: '0.75rem 2rem',
            fontSize: '0.95rem', fontFamily: 'DM Sans, sans-serif',
            cursor: 'pointer', display: 'inline-flex',
            alignItems: 'center', gap: '0.55rem',
            transition: 'all 0.2s'
          }}
        >
          <RefreshCw size={15} />
          Analyze Another Plant
        </motion.button>
      </div>
    </motion.section>
  )
}