import { motion, AnimatePresence } from 'framer-motion'
import { diseaseInfo } from '../data/diseases'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Search } from 'lucide-react'

// Convert the diseaseInfo object into a flat array for easier filtering
const allDiseases = Object.entries(diseaseInfo).map(([key, info]) => ({
  id: key,
  ...info,
  plantType: key.includes('Pepper') ? 'Pepper' : key.includes('Potato') ? 'Potato' : 'Tomato'
}))

const tabs = ['All', 'Tomato', 'Potato', 'Pepper']
const sevColors = { healthy: '#a8ff3e', moderate: '#ffc844', severe: '#ff4d4d' }
const sevLabels = { healthy: 'Healthy', moderate: 'Moderate Risk', severe: 'Severe Risk' }

export default function Plants() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Filter logic
  const filteredDiseases = allDiseases.filter(d => {
    const matchesTab = activeTab === 'All' || d.plantType === activeTab
    const matchesSearch = d.display.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  return (
    <div style={{
      paddingTop: '80px', minHeight: '100vh',
      backgroundColor: '#0a0f0a', position: 'relative', overflow: 'hidden'
    }}>
      {/* --- Optimized Noise Overlay --- */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
        opacity: 0.15,
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")'
      }} />

      {/* --- Optimized Background Gradients --- */}
      <div style={{
        position: 'fixed', top: '0%', left: '0%',
        width: '100vw', height: '100vh',
        background: 'radial-gradient(ellipse at 80% 20%, rgba(168,255,62,0.05) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(45,138,0,0.05) 0%, transparent 50%)',
        pointerEvents: 'none', zIndex: 0
      }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '4rem 2rem', position: 'relative', zIndex: 10 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <p style={{
            color: '#a8ff3e', fontSize: '0.85rem',
            letterSpacing: '0.15em', textTransform: 'uppercase',
            marginBottom: '0.8rem', fontWeight: 600
          }}>
            Botanical Encyclopedia
          </p>
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 400, color: '#f5f0e8', marginBottom: '1.2rem'
          }}>
            Supported Plants & Diseases
          </h1>
          <p style={{
            color: 'rgba(245,240,232,0.6)', fontSize: '1.1rem', fontFamily: 'Inter, sans-serif',
            maxWidth: 600, margin: '0 auto', lineHeight: 1.6
          }}>
            Leafly can detect 15 conditions across 3 crop types. Browse our database or search for a specific disease to learn more.
          </p>
        </motion.div>

        {/* Filters & Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ 
            display: 'flex', flexDirection: 'column', gap: '1.5rem', 
            marginBottom: '3rem', alignItems: 'center' 
          }}
        >
          {/* Search Input */}
          <div style={{ 
            position: 'relative', width: '100%', maxWidth: '400px'
          }}>
            <Search size={18} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search diseases..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%', padding: '1rem 1rem 1rem 3rem',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '100px', color: '#f5f0e8', fontSize: '1rem',
                outline: 'none', fontFamily: 'Inter, sans-serif',
                backdropFilter: 'blur(10px)'
              }}
            />
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center',
            background: 'rgba(255,255,255,0.03)', padding: '0.4rem', borderRadius: '100px',
            border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)'
          }}>
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '0.6rem 1.5rem', borderRadius: '100px', border: 'none',
                  background: activeTab === tab ? 'rgba(168,255,62,0.1)' : 'transparent',
                  color: activeTab === tab ? '#a8ff3e' : 'rgba(245,240,232,0.6)',
                  fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', fontWeight: activeTab === tab ? 600 : 400,
                  cursor: 'pointer', transition: 'all 0.3s ease',
                  border: `1px solid ${activeTab === tab ? 'rgba(168,255,62,0.2)' : 'transparent'}`
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Disease Grid */}
        <motion.div layout style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem'
        }}>
          <AnimatePresence mode="popLayout">
            {filteredDiseases.map((d) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={d.id}
                whileHover={{ y: -5, scale: 1.02 }}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '24px', padding: '1.5rem',
                  backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
                  display: 'flex', flexDirection: 'column',
                  // Using CSS variables for hover effects allows us to keep performance high
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                  position: 'relative', overflow: 'hidden'
                }}
              >
                {/* Subtle severity-based glow inside the card */}
                <div style={{
                  position: 'absolute', top: 0, right: 0, width: '150px', height: '150px',
                  background: `radial-gradient(circle at top right, ${sevColors[d.severity]}30, transparent 70%)`,
                  pointerEvents: 'none'
                }} />

                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem', zIndex: 1 }}>
                  <div style={{ 
                    fontSize: '2rem', background: 'rgba(255,255,255,0.05)', 
                    width: 50, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)'
                  }}>
                    {d.emoji}
                  </div>
                  <span style={{
                    fontSize: '0.75rem', fontWeight: 600,
                    color: sevColors[d.severity], fontFamily: 'Inter, sans-serif',
                    background: `${sevColors[d.severity]}15`, border: `1px solid ${sevColors[d.severity]}30`,
                    padding: '0.3rem 0.8rem', borderRadius: '100px',
                    letterSpacing: '0.05em'
                  }}>
                    {sevLabels[d.severity]}
                  </span>
                </div>

                <h3 style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '1.4rem', fontWeight: 400,
                  color: '#f5f0e8', marginBottom: '0.5rem', zIndex: 1
                }}>
                  {d.display.split('·')[1]?.trim() || d.display}
                </h3>

                <p style={{ 
                  fontSize: '0.9rem', color: 'rgba(245,240,232,0.6)', 
                  lineHeight: 1.6, fontFamily: 'Inter, sans-serif', margin: 0, zIndex: 1
                }}>
                  {d.description.slice(0, 100)}...
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredDiseases.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'rgba(245,240,232,0.4)', fontFamily: 'Inter, sans-serif' }}>
            No diseases found matching your search.
          </div>
        )}

      </div>
    </div>
  )
}