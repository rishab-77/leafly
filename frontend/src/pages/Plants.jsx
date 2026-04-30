import { motion } from 'framer-motion'
import { diseaseInfo } from '../data/diseases'
import { useNavigate } from 'react-router-dom'

const categories = {
  'Bell Pepper 🫑': Object.entries(diseaseInfo).filter(([k]) => k.includes('Pepper')),
  'Potato 🥔':      Object.entries(diseaseInfo).filter(([k]) => k.includes('Potato')),
  'Tomato 🍅':      Object.entries(diseaseInfo).filter(([k]) => k.includes('Tomato')),
}

const sevColors = { healthy: '#a8ff3e', moderate: '#ffc844', severe: '#ff4d4d' }
const sevLabels = { healthy: 'Healthy', moderate: 'Moderate Risk', severe: 'Severe Risk' }

export default function Plants() {
  const navigate = useNavigate()

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '4rem 2rem' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <p style={{
            color: 'var(--lime)', fontSize: '0.8rem',
            letterSpacing: '0.15em', textTransform: 'uppercase',
            marginBottom: '0.8rem', fontWeight: 500
          }}>
            Disease Coverage
          </p>
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
            fontWeight: 300, color: 'var(--ivory)', marginBottom: '1rem'
          }}>
            Supported plants & diseases
          </h1>
          <p style={{
            color: 'rgba(245,240,232,0.45)', fontSize: '0.95rem',
            maxWidth: 460, margin: '0 auto', lineHeight: 1.7
          }}>
            Leafly can detect 15 conditions across 3 crop types.
            Click any card to analyze that disease.
          </p>
        </motion.div>

        {/* Categories */}
        {Object.entries(categories).map(([category, entries], ci) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: ci * 0.1 }}
            style={{ marginBottom: '3.5rem' }}
          >
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '1.6rem', fontWeight: 400,
              color: 'var(--ivory)', marginBottom: '1.25rem',
              paddingLeft: '1rem',
              borderLeft: '2px solid var(--lime)'
            }}>
              {category}
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1rem'
            }}>
              {entries.map(([key, info], j) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: j * 0.05 }}
                  whileHover={{ y: -4, boxShadow: `0 8px 30px ${sevColors[info.severity]}15` }}
                  onClick={() => navigate('/analyze')}
                  style={{
                    background: 'var(--glass)',
                    border: `1px solid ${sevColors[info.severity]}20`,
                    borderRadius: 'var(--radius)',
                    padding: '1.25rem',
                    cursor: 'pointer',
                    backdropFilter: 'blur(10px)',
                    transition: 'box-shadow 0.2s, border-color 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>{info.emoji}</span>
                    <span style={{
                      fontSize: '0.7rem', fontWeight: 500,
                      color: sevColors[info.severity],
                      background: `${sevColors[info.severity]}15`,
                      padding: '0.25rem 0.6rem', borderRadius: '100px',
                      letterSpacing: '0.05em'
                    }}>
                      {sevLabels[info.severity]}
                    </span>
                  </div>
                  <h3 style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '1.1rem', fontWeight: 400,
                    color: 'var(--ivory)', marginBottom: '0.4rem'
                  }}>
                    {info.display.split('·')[1]?.trim() || info.display}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(245,240,232,0.4)', lineHeight: 1.6 }}>
                    {info.description.slice(0, 80)}…
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Legend */}
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          {Object.entries(sevColors).map(([key, color]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
              <span style={{ fontSize: '0.78rem', color: 'rgba(245,240,232,0.4)' }}>
                {sevLabels[key]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}