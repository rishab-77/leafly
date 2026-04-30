import { motion } from 'framer-motion'
import { diseaseInfo } from '../data/diseases'

const categories = {
  '🫑 Bell Pepper': Object.entries(diseaseInfo).filter(([k]) => k.includes('Pepper')),
  '🥔 Potato':      Object.entries(diseaseInfo).filter(([k]) => k.includes('Potato')),
  '🍅 Tomato':      Object.entries(diseaseInfo).filter(([k]) => k.includes('Tomato')),
}

const sevColors = { healthy: '#a8ff3e', moderate: '#ffc844', severe: '#ff4d4d' }

export default function SupportedPlants() {
  return (
    <section id="plants" style={{ padding: '6rem 2rem', maxWidth: 1000, margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ textAlign: 'center', marginBottom: '4rem' }}
      >
        <p style={{
          color: 'var(--lime)', fontSize: '0.8rem',
          letterSpacing: '0.15em', textTransform: 'uppercase',
          marginBottom: '0.8rem', fontWeight: 500
        }}>Coverage</p>
        <h2 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 300, color: 'var(--ivory)'
        }}>
          Supported plant diseases
        </h2>
      </motion.div>

      {Object.entries(categories).map(([category, entries], ci) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: ci * 0.1 }}
          style={{ marginBottom: '3rem' }}
        >
          <h3 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '1.4rem', fontWeight: 400,
            color: 'rgba(245,240,232,0.7)',
            marginBottom: '1rem', paddingLeft: '0.5rem',
            borderLeft: '2px solid rgba(168,255,62,0.3)'
          }}>
            {category}
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
            {entries.map(([key, info]) => (
              <div key={key} style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                background: 'var(--glass)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '100px', padding: '0.4rem 1rem',
                fontSize: '0.82rem', color: 'rgba(245,240,232,0.65)'
              }}>
                <div style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: sevColors[info.severity], flexShrink: 0
                }} />
                {info.display.split('·')[1]?.trim() || info.display}
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Legend */}
      <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
        {[['#a8ff3e', 'Healthy'], ['#ffc844', 'Moderate'], ['#ff4d4d', 'Severe']].map(([color, label]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
            <span style={{ fontSize: '0.78rem', color: 'rgba(245,240,232,0.4)' }}>{label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}