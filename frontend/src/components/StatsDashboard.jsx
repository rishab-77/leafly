import { motion } from 'framer-motion'
import { Activity, ShieldCheck, Bug, BarChart3 } from 'lucide-react'

export default function StatsDashboard({ history }) {
  if (!history || history.length === 0) return null

  // 1. Total Scans
  const totalScans = history.length

  // 2. Most Common Disease
  const counts = {}
  let mostCommon = 'None'
  let maxCount = 0
  
  history.forEach(item => {
    const name = item.disease.includes('·') ? item.disease.split('·')[1].trim() : item.disease
    if (name.toLowerCase().includes('healthy')) return // Skip healthy for "most common disease"
    counts[name] = (counts[name] || 0) + 1
    if (counts[name] > maxCount) {
      maxCount = counts[name]
      mostCommon = name
    }
  })

  // 3. Health Score (Average confidence of healthy scans)
  const healthyScans = history.filter(item => item.disease.toLowerCase().includes('healthy'))
  const healthScore = healthyScans.length > 0
    ? Math.round(healthyScans.reduce((acc, curr) => acc + curr.confidence, 0) / healthyScans.length)
    : 0

  const stats = [
    { 
      label: 'Total Scans', 
      value: totalScans, 
      icon: BarChart3, 
      color: '#a8ff3e',
      desc: 'Lifetime analyses'
    },
    { 
      label: 'Common Issue', 
      value: mostCommon, 
      icon: Bug, 
      color: '#ffc844',
      desc: 'Most frequent disease'
    },
    { 
      label: 'Health Score', 
      value: `${healthScore}%`, 
      icon: ShieldCheck, 
      color: '#00d1ff',
      desc: 'Avg. healthy confidence'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      style={{ maxWidth: 800, margin: '4rem auto 0', padding: '0 2rem' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'rgba(245,240,232,0.5)' }}>
        <Activity size={18} />
        <span style={{ fontSize: '0.9rem', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600 }}>Garden Insights</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            whileHover={{ y: -5, background: 'rgba(255,255,255,0.04)' }}
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '20px',
              padding: '1.5rem',
              backdropFilter: 'blur(10px)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Background Glow */}
            <div style={{ 
              position: 'absolute', top: '-20%', right: '-20%', width: '60%', height: '60%', 
              background: `radial-gradient(circle, ${stat.color}10 0%, transparent 70%)`,
              pointerEvents: 'none'
            }} />

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ 
                width: 42, height: 42, borderRadius: '12px', background: `${stat.color}15`, 
                display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${stat.color}30`
              }}>
                <stat.icon size={20} color={stat.color} />
              </div>
            </div>

            <h3 style={{ fontSize: '0.85rem', color: 'rgba(245,240,232,0.5)', fontFamily: 'Inter, sans-serif', margin: '0 0 0.5rem 0', fontWeight: 500 }}>
              {stat.label}
            </h3>
            <p style={{ fontSize: '1.5rem', color: '#f5f0e8', fontFamily: 'Cormorant Garamond, serif', margin: '0 0 0.2rem 0', fontWeight: 400 }}>
              {stat.value}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'rgba(245,240,232,0.3)', fontFamily: 'Inter, sans-serif', margin: 0 }}>
              {stat.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
