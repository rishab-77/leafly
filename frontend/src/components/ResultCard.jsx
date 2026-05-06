import { motion } from 'framer-motion'
import { CheckCircle, AlertTriangle, XCircle, RefreshCw } from 'lucide-react'
import { diseaseInfo } from '../data/diseases'
import { useState, useEffect } from 'react'

const severityConfig = {
  healthy:  { color: '#a8ff3e', icon: CheckCircle,     label: 'Healthy' },
  moderate: { color: '#ffc844', icon: AlertTriangle,   label: 'Moderate Risk' },
  severe:   { color: '#ff4d4d', icon: XCircle,         label: 'Severe Risk' },
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
  
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      style={{ padding: '2rem 2rem 6rem', maxWidth: 900, margin: '0 auto' }}
    >
      {/* Result Bento Box */}
      <div style={{
        background: 'rgba(255,255,255,0.02)',
        border: `1px solid ${sev.color}40`,
        borderRadius: '24px',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        overflow: 'hidden',
        boxShadow: `0 20px 50px rgba(0,0,0,0.3), inset 0 0 0 1px ${sev.color}15`,
        display: 'flex', flexDirection: isMobile ? 'column' : 'row',
        position: 'relative'
      }}>
         {/* Subtle Severity Radial Glow */}
         <div style={{
           position: 'absolute', top: '-10%', left: '-10%', width: '50%', height: '50%',
           background: `radial-gradient(circle, ${sev.color}15 0%, transparent 70%)`,
           pointerEvents: 'none', zIndex: 0
         }}/>

        {/* Left — Image */}
        <div style={{ position: 'relative', width: isMobile ? '100%' : '40%', minHeight: 300, zIndex: 1 }}>
          <img src={preview} alt="Analyzed leaf"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          {/* Gradient fade to blend into the card */}
          <div style={{
            position: 'absolute', inset: 0,
            background: isMobile 
              ? 'linear-gradient(to top, rgba(10,15,10,1) 0%, transparent 40%)' 
              : 'linear-gradient(to right, transparent 0%, rgba(10,15,10,1) 90%, rgba(10,15,10,1) 100%)'
          }} />
          
          {/* Badge Overlay */}
          <div style={{ position: 'absolute', top: 20, left: 20, display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(10,15,10,0.6)', backdropFilter: 'blur(10px)', padding: '0.5rem 1rem', borderRadius: '100px', border: `1px solid ${sev.color}40` }}>
            <Icon size={16} color={sev.color} />
            <span style={{ color: '#f5f0e8', fontSize: '0.8rem', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
              Analysis Complete
            </span>
          </div>
        </div>

        {/* Right — Result Details */}
        <div style={{ padding: '2.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 1, background: 'rgba(10,15,10,0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ fontSize: '2.5rem', background: 'rgba(255,255,255,0.05)', width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
              {info.emoji}
            </div>
            <div>
               <h2 style={{
                 fontFamily: 'Cormorant Garamond, serif',
                 fontSize: '2rem', fontWeight: 400,
                 color: '#f5f0e8', margin: 0, lineHeight: 1.1
               }}>
                 {info.display.split('·')[1]?.trim() || info.display}
               </h2>
               <div style={{ color: 'rgba(245,240,232,0.5)', fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', marginTop: '0.3rem' }}>
                  {info.display.includes('·') ? info.display.split('·')[0].trim() : ''}
               </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            <span style={{
              color: sev.color, background: `${sev.color}15`, border: `1px solid ${sev.color}30`,
              padding: '0.4rem 1rem', borderRadius: '100px',
              fontSize: '0.8rem', fontWeight: 600, fontFamily: 'Inter, sans-serif'
            }}>
              {sev.label}
            </span>
            <span style={{
              color: 'rgba(245,240,232,0.6)', fontSize: '0.85rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              <strong style={{ color: '#f5f0e8' }}>{result.confidence}%</strong> confident
            </span>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '2rem' }}>
            <p style={{
              fontSize: '1rem', color: 'rgba(245,240,232,0.7)',
              lineHeight: 1.6, fontFamily: 'Inter, sans-serif', marginBottom: '1.5rem'
            }}>
              {info.description}
            </p>
            <div style={{
              height: 6, background: 'rgba(255,255,255,0.05)',
              borderRadius: 999, overflow: 'hidden'
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${result.confidence}%` }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
                style={{
                  height: '100%', borderRadius: 999,
                  background: `linear-gradient(90deg, ${sev.color}40, ${sev.color})`,
                  boxShadow: `0 0 10px ${sev.color}80`
                }}
              />
            </div>
          </div>

          {/* Treatment Bento Box */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '16px', padding: '1.5rem'
          }}>
            <p style={{
              fontSize: '0.75rem', color: 'rgba(245,240,232,0.5)',
              letterSpacing: '0.15em', textTransform: 'uppercase',
              marginBottom: '0.5rem', fontFamily: 'Inter, sans-serif', fontWeight: 600
            }}>
              Recommended Action
            </p>
            <p style={{ fontSize: '0.95rem', color: '#f5f0e8', lineHeight: 1.6, fontFamily: 'Inter, sans-serif', margin: 0 }}>
              {info.treatment}
            </p>
          </div>
        </div>
      </div>

      {/* Try another */}
      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <motion.button
          whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.05)' }}
          whileTap={{ scale: 0.95 }}
          onClick={onReset}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#f5f0e8',
            borderRadius: '100px', padding: '0.9rem 2.5rem',
            fontSize: '0.95rem', fontFamily: 'Inter, sans-serif', fontWeight: 500,
            cursor: 'pointer', display: 'inline-flex',
            alignItems: 'center', gap: '0.6rem',
          }}
        >
          <RefreshCw size={16} />
          Analyze Another Plant
        </motion.button>
      </div>
    </motion.section>
  )
}