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
      style={{ padding: '0 2rem 6rem', maxWidth: 760, margin: '0 auto' }}
    >
      {/* Result card */}
      <div style={{
        background: 'var(--glass)',
        border: `1px solid ${sev.color}30`,
        borderRadius: 'var(--radius)',
        backdropFilter: 'blur(20px)',
        overflow: 'hidden',
        boxShadow: `0 0 60px ${sev.color}10`
      }}>
        {/* Top bar */}
        <div style={{
          background: sev.bg,
          borderBottom: `1px solid ${sev.color}20`,
          padding: '1rem 1.5rem',
          display: 'flex', alignItems: 'center', gap: '0.6rem'
        }}>
          <Icon size={18} color={sev.color} />
          <span style={{ color: sev.color, fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.05em' }}>
            {sev.label} — Analysis Complete
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
              background: `linear-gradient(to right, transparent 60%, var(--forest-mid))`
            }} />
          </div>

          {/* Right — result */}
          <div style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{info.emoji}</div>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '1.6rem', fontWeight: 300,
              color: 'var(--ivory)', lineHeight: 1.3, marginBottom: '1.5rem'
            }}>
              {info.display}
            </h2>

            {/* Confidence bar */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                marginBottom: '0.5rem'
              }}>
                <span style={{ fontSize: '0.8rem', color: 'rgba(245,240,232,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Confidence
                </span>
                <span style={{ fontSize: '0.9rem', color: sev.color, fontWeight: 500 }}>
                  {result.confidence}%
                </span>
              </div>
              <div style={{
                height: 6, background: 'rgba(255,255,255,0.07)',
                borderRadius: 100, overflow: 'hidden'
              }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${result.confidence}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                  style={{
                    height: '100%', borderRadius: 100,
                    background: `linear-gradient(90deg, ${sev.color}88, ${sev.color})`,
                    boxShadow: `0 0 12px ${sev.color}60`
                  }}
                />
              </div>
            </div>

            {/* Description */}
            <p style={{
              fontSize: '0.875rem', color: 'rgba(245,240,232,0.6)',
              lineHeight: 1.7, marginBottom: '1.5rem'
            }}>
              {info.description}
            </p>

            {/* Treatment */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 10, padding: '1rem'
            }}>
              <p style={{
                fontSize: '0.7rem', color: 'rgba(245,240,232,0.4)',
                letterSpacing: '0.1em', textTransform: 'uppercase',
                marginBottom: '0.4rem'
              }}>
                Recommended Action
              </p>
              <p style={{ fontSize: '0.85rem', color: 'rgba(245,240,232,0.75)', lineHeight: 1.6 }}>
                {info.treatment}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Try another */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onReset}
          style={{
            background: 'transparent',
            border: '1px solid rgba(245,240,232,0.15)',
            color: 'rgba(245,240,232,0.6)',
            borderRadius: '100px', padding: '0.75rem 2rem',
            fontSize: '0.9rem', fontFamily: 'DM Sans, sans-serif',
            cursor: 'pointer', display: 'inline-flex',
            alignItems: 'center', gap: '0.5rem',
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