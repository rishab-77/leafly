import { motion } from 'framer-motion'
import { Server, Database, Activity, Code2, Cpu, Box, Rocket, ShieldCheck, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function About() {
  const navigate = useNavigate()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } }
  }

  // Helper for Bento Box Panels
  const BentoPanel = ({ children, style, delay = 0 }) => (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -4, scale: 1.01 }}
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '24px',
        padding: '2rem',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2), inset 0 0 0 1px rgba(255,255,255,0.02)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        ...style
      }}
    >
      {/* Subtle top-light gradient for 3D feel */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '100px',
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.03) 0%, transparent 100%)',
        pointerEvents: 'none'
      }} />
      {children}
    </motion.div>
  )

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
        position: 'fixed', top: '10%', right: '-10%',
        width: '70vw', height: '70vw',
        background: 'radial-gradient(circle, rgba(168,255,62,0.06) 0%, transparent 60%)',
        pointerEvents: 'none', zIndex: 0
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '4rem 2rem', position: 'relative', zIndex: 10 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <p style={{
            color: '#a8ff3e', fontSize: '0.85rem',
            letterSpacing: '0.15em', textTransform: 'uppercase',
            marginBottom: '0.8rem', fontWeight: 600
          }}>
            The Project
          </p>
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 400, color: '#f5f0e8', marginBottom: '1.2rem'
          }}>
            About Leafly
          </h1>
          <p style={{
            color: 'rgba(245,240,232,0.6)', fontSize: '1.1rem', fontFamily: 'Inter, sans-serif',
            maxWidth: 600, margin: '0 auto', lineHeight: 1.6
          }}>
            An AI-powered plant disease detection system. Built using deep transfer learning to classify 15 distinct diseases with laboratory-grade accuracy.
          </p>
        </motion.div>

        {/* BENTO BOX GRID */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
            gridAutoRows: 'minmax(180px, auto)',
            gap: '1.5rem',
            marginBottom: '4rem'
          }}
        >
          {/* Main Accuracy Card (Spans 2 columns, 2 rows) */}
          <BentoPanel style={{ 
            gridColumn: isMobile ? '1' : 'span 2', 
            gridRow: isMobile ? 'auto' : 'span 2',
            justifyContent: 'center', alignItems: 'center', textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(168,255,62,0.05) 0%, rgba(20,30,20,0.5) 100%)',
            border: '1px solid rgba(168,255,62,0.15)'
          }}>
            <div style={{
              position: 'absolute', top: '-20%', left: '-20%', width: '140%', height: '140%',
              background: 'radial-gradient(circle, rgba(168,255,62,0.1) 0%, transparent 60%)',
              pointerEvents: 'none'
            }}/>
            <ShieldCheck size={48} color="#a8ff3e" style={{ marginBottom: '1rem' }} />
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '5rem', lineHeight: 1, color: '#a8ff3e', marginBottom: '0.5rem' }}>
              98.84%
            </div>
            <div style={{ fontSize: '1.2rem', color: '#f5f0e8', fontFamily: 'Inter, sans-serif', fontWeight: 500, marginBottom: '0.5rem' }}>
              Test Accuracy
            </div>
            <div style={{ fontSize: '0.9rem', color: 'rgba(245,240,232,0.5)', fontFamily: 'Inter, sans-serif' }}>
              Evaluated on truly unseen data
            </div>
          </BentoPanel>

          {/* Model Architecture Card (Spans 2 columns, 1 row) */}
          <BentoPanel style={{ gridColumn: isMobile ? '1' : 'span 2', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ background: 'rgba(168,255,62,0.1)', padding: '0.8rem', borderRadius: '14px' }}>
                <Activity color="#a8ff3e" size={24} />
              </div>
              <div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: '#f5f0e8', margin: 0 }}>EfficientNet-B3</h3>
                <p style={{ fontSize: '0.85rem', color: 'rgba(245,240,232,0.5)', fontFamily: 'Inter, sans-serif', margin: 0, marginTop: '0.2rem' }}>
                  Base Architecture
                </p>
              </div>
            </div>
            <p style={{ fontSize: '0.95rem', color: 'rgba(245,240,232,0.7)', fontFamily: 'Inter, sans-serif', margin: 0, lineHeight: 1.5 }}>
              Pre-trained on ImageNet and fine-tuned on PlantVillage data using a two-phase transfer learning approach. Contains 11M+ trained parameters.
            </p>
          </BentoPanel>

          {/* Phase 1 Training (1 column, 1 row) */}
          <BentoPanel style={{ justifyContent: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontFamily: 'Cormorant Garamond, serif', color: '#f5f0e8', lineHeight: 1, marginBottom: '0.5rem' }}>
              92.4%
            </div>
            <div style={{ fontSize: '0.9rem', color: '#a8ff3e', fontFamily: 'Inter, sans-serif', fontWeight: 500, marginBottom: '0.2rem' }}>
              Phase 1 Val Acc
            </div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(245,240,232,0.4)', fontFamily: 'Inter, sans-serif' }}>
              Custom Head Training
            </div>
          </BentoPanel>

          {/* Phase 2 Training (1 column, 1 row) */}
          <BentoPanel style={{ justifyContent: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontFamily: 'Cormorant Garamond, serif', color: '#f5f0e8', lineHeight: 1, marginBottom: '0.5rem' }}>
              99.5%
            </div>
            <div style={{ fontSize: '0.9rem', color: '#a8ff3e', fontFamily: 'Inter, sans-serif', fontWeight: 500, marginBottom: '0.2rem' }}>
              Phase 2 Val Acc
            </div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(245,240,232,0.4)', fontFamily: 'Inter, sans-serif' }}>
              Fine-tuning Top Layers
            </div>
          </BentoPanel>

          {/* Tech Stack Header (Spans 4 columns, very short row) */}
          <div style={{ gridColumn: isMobile ? '1' : 'span 4', padding: '2rem 0 0 1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
             <div style={{ height: '1px', flex: 1, background: 'rgba(255,255,255,0.1)' }} />
             <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: 'rgba(245,240,232,0.5)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Core Technology</span>
             <div style={{ height: '1px', flex: 1, background: 'rgba(255,255,255,0.1)' }} />
          </div>

          {/* PyTorch */}
          <BentoPanel style={{ alignItems: 'center', textAlign: 'center', justifyContent: 'center', padding: '1.5rem' }}>
            <Box size={32} color="#f5f0e8" style={{ marginBottom: '1rem', opacity: 0.8 }} />
            <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#f5f0e8', fontSize: '1.1rem' }}>PyTorch 2.2</div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(245,240,232,0.4)', marginTop: '0.5rem' }}>Deep Learning Framework</div>
          </BentoPanel>

          {/* FastAPI */}
          <BentoPanel style={{ alignItems: 'center', textAlign: 'center', justifyContent: 'center', padding: '1.5rem' }}>
            <Zap size={32} color="#f5f0e8" style={{ marginBottom: '1rem', opacity: 0.8 }} />
            <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#f5f0e8', fontSize: '1.1rem' }}>FastAPI</div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(245,240,232,0.4)', marginTop: '0.5rem' }}>High-Performance Backend</div>
          </BentoPanel>

          {/* React */}
          <BentoPanel style={{ alignItems: 'center', textAlign: 'center', justifyContent: 'center', padding: '1.5rem' }}>
            <Code2 size={32} color="#f5f0e8" style={{ marginBottom: '1rem', opacity: 0.8 }} />
            <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#f5f0e8', fontSize: '1.1rem' }}>React + Vite</div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(245,240,232,0.4)', marginTop: '0.5rem' }}>Frontend Architecture</div>
          </BentoPanel>

          {/* Dataset */}
          <BentoPanel style={{ alignItems: 'center', textAlign: 'center', justifyContent: 'center', padding: '1.5rem' }}>
            <Database size={32} color="#f5f0e8" style={{ marginBottom: '1rem', opacity: 0.8 }} />
            <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#f5f0e8', fontSize: '1.1rem' }}>PlantVillage</div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(245,240,232,0.4)', marginTop: '0.5rem' }}>20K+ Training Images</div>
          </BentoPanel>

        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '2rem' }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/analyze')}
            style={{
              background: 'linear-gradient(135deg, #a8ff3e 0%, #8ae62e 100%)',
              color: '#0a0f0a', border: 'none', borderRadius: '100px',
              padding: '1.1rem 2.5rem', fontSize: '1rem',
              fontFamily: 'Inter, sans-serif', fontWeight: 600,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.8rem',
              boxShadow: '0 10px 20px rgba(168,255,62,0.2)'
            }}
          >
            <Rocket size={18} /> Test The Model
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05, background: 'rgba(245,240,232,0.05)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open('https://github.com/rishab-77/leafly', '_blank')}
            style={{
              background: 'transparent', color: '#f5f0e8',
              border: '1px solid rgba(245,240,232,0.2)',
              borderRadius: '100px', padding: '1.1rem 2.5rem',
              fontSize: '1rem', fontFamily: 'Inter, sans-serif',
              fontWeight: 400, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.8rem'
            }}
          >
            <Code2 size={18} /> View Source Code
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}