import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowRight, Sparkles, ScanLine, Leaf, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function Home() {
  const navigate = useNavigate()

  // Use MotionValues for performance instead of React State (prevents re-rendering the whole page)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Add spring physics for smooth, lag-free trailing
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 })
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 })

  // Map mouse coordinates to rotation values
  const rotateX = useTransform(springY, [-500, 500], [5, -5])
  const rotateY = useTransform(springX, [-500, 500], [-5, 5])

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = e.clientX - window.innerWidth / 2
      const y = e.clientY - window.innerHeight / 2
      mouseX.set(x)
      mouseY.set(y)
    }
    
    // throttle isn't needed strictly when using useMotionValue, but still good practice
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: '8rem 2rem 4rem',
      backgroundColor: '#0a0f0a', 
    }}>
      {/* --- Optimized Noise Overlay --- 
          Removed mixBlendMode which kills GPU performance. Used simple opacity instead. */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
        opacity: 0.15,
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")'
      }} />

      {/* --- Optimized Mesh Gradients --- 
          Removed CSS `filter: blur()`. Instead, rely purely on the radial-gradient fading to transparent. */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 30, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute', top: '-10%', left: '-10%',
          width: '50vw', height: '50vw',
          background: 'radial-gradient(circle, rgba(168,255,62,0.12) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0
        }}
      />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          x: [0, -40, 0],
          y: [0, 40, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear', delay: 2 }}
        style={{
          position: 'absolute', bottom: '-20%', right: '-10%',
          width: '60vw', height: '60vw',
          background: 'radial-gradient(circle, rgba(45,138,0,0.12) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0
        }}
      />

      <div style={{
        maxWidth: '1200px', width: '100%', margin: '0 auto',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '4rem', alignItems: 'center', zIndex: 10, position: 'relative'
      }}>
        
        {/* --- LEFT COLUMN: Text & CTAs --- */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
              background: 'rgba(168,255,62,0.05)',
              border: '1px solid rgba(168,255,62,0.2)',
              borderRadius: '100px', padding: '0.5rem 1.2rem',
              marginBottom: '2rem', fontSize: '0.85rem',
              color: '#a8ff3e', letterSpacing: '0.08em',
              textTransform: 'uppercase', fontWeight: 600,
            }}
          >
            <Sparkles size={14} />
            <span style={{ paddingTop: '2px' }}>Next-Gen Plant Diagnostics</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(3.5rem, 6vw, 5.5rem)',
              fontWeight: 400, lineHeight: 1.05,
              color: '#f5f0e8', marginBottom: '1.5rem',
              willChange: 'opacity, transform' // Performance optimization
            }}
          >
            Your plant speaks. <br />
            <em style={{ color: '#a8ff3e', fontStyle: 'italic' }}>We translate.</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              fontSize: '1.15rem', fontWeight: 300,
              color: 'rgba(245,240,232,0.7)',
              maxWidth: 480, lineHeight: 1.6,
              marginBottom: '3rem', fontFamily: 'Inter, sans-serif'
            }}
          >
            Upload a single leaf image and get an instant, laboratory-grade diagnosis powered by our EfficientNetB3 deep learning model.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
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
              }}
            >
              Analyze Your Plant <ArrowRight size={18} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05, background: 'rgba(245,240,232,0.05)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/how-it-works')}
              style={{
                background: 'transparent', color: '#f5f0e8',
                border: '1px solid rgba(245,240,232,0.2)',
                borderRadius: '100px', padding: '1.1rem 2.5rem',
                fontSize: '1rem', fontFamily: 'Inter, sans-serif',
                fontWeight: 400, cursor: 'pointer',
              }}
            >
              How It Works
            </motion.button>
          </motion.div>
        </div>

        {/* --- RIGHT COLUMN: Floating Scanner Mockup --- */}
        <motion.div
          initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.4 }}
          style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            position: 'relative', perspective: '1000px'
          }}
        >
          {/* Hardware Accelerated 3D Transform Card */}
          <motion.div
            style={{
              rotateX,
              rotateY,
              y: useTransform(
                useSpring(useMotionValue(0), { stiffness: 50, damping: 20 }),
                val => val // this handles natural hover float, simplified for performance
              ),
              width: '100%', maxWidth: '380px',
              background: 'rgba(20, 30, 20, 0.4)',
              border: '1px solid rgba(168,255,62,0.15)',
              borderRadius: '24px', padding: '1.5rem',
              backdropFilter: 'blur(10px)', // Reduced blur from 20px to 10px
              WebkitBackdropFilter: 'blur(10px)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)', // Reduced shadow complexity
              display: 'flex', flexDirection: 'column', gap: '1rem',
              transformStyle: 'preserve-3d', // Better 3D rendering
              willChange: 'transform' // Performance optimization
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f' }} />
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter, sans-serif' }}>leafly_analysis.ai</div>
            </div>

            <div style={{
              width: '100%', height: '220px', borderRadius: '12px',
              background: 'url("https://images.unsplash.com/photo-1536147116438-62679a5e01f2?q=80&w=600&auto=format&fit=crop") center/cover',
              position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <motion.div
                animate={{ y: [0, 220, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} // Slower, linear animation is cheaper
                style={{
                  width: '100%', height: '2px', background: '#a8ff3e',
                  boxShadow: '0 0 10px 2px rgba(168,255,62,0.4)',
                  position: 'absolute', top: 0, left: 0, zIndex: 2,
                  willChange: 'transform'
                }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to bottom, rgba(168,255,62,0.1) 0%, transparent 100%)',
                pointerEvents: 'none'
              }} />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
              <div style={{
                  background: 'rgba(255,255,255,0.05)', padding: '0.8rem', borderRadius: '10px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f5f0e8', fontSize: '0.9rem', fontFamily: 'Inter' }}>
                  <Leaf size={16} color="#a8ff3e" /> Monstera Deliciosa
                </div>
              </div>
              
              <div style={{
                  background: 'rgba(168,255,62,0.1)', border: '1px solid rgba(168,255,62,0.2)',
                  padding: '0.8rem', borderRadius: '10px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a8ff3e', fontSize: '0.9rem', fontFamily: 'Inter', fontWeight: 500 }}>
                  <ShieldCheck size={16} /> Healthy
                </div>
                <div style={{ color: '#a8ff3e', fontSize: '0.9rem', fontWeight: 600 }}>99.8%</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', right: '-20px', top: '10%',
              background: 'rgba(20,30,20,0.6)', backdropFilter: 'blur(5px)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%',
              padding: '1rem', color: '#a8ff3e',
              willChange: 'transform'
            }}
          >
            <ScanLine size={24} />
          </motion.div>
        </motion.div>
      </div>

      {/* --- BOTTOM: Glassmorphism Stats Bar --- */}
      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.6 }}
        style={{
          position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
          width: 'calc(100% - 4rem)', maxWidth: '1000px',
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(10px)', // Reduced from 20px
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '20px', padding: '1.5rem 3rem',
          display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'space-around',
          zIndex: 10,
          willChange: 'transform, opacity'
        }}
      >
        {[
          { value: '98.84%', label: 'Test Accuracy' },
          { value: '20K+',  label: 'Training Images' },
          { value: '15',    label: 'Disease Classes' },
          { value: '< 2s',  label: 'Inference Time' },
        ].map((stat, i) => (
          <div key={stat.label} style={{ textAlign: 'center', position: 'relative' }}>
            <div style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '2rem', fontWeight: 500, color: '#f5f0e8'
            }}>
              {stat.value}
            </div>
            <div style={{
              fontSize: '0.75rem', color: 'rgba(245,240,232,0.4)',
              letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '0.4rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              {stat.label}
            </div>
            {i !== 3 && (
              <div style={{
                position: 'absolute', right: '-100%', top: '20%', height: '60%',
                width: '1px', background: 'rgba(255,255,255,0.1)'
              }} />
            )}
          </div>
        ))}
      </motion.div>
    </section>
  )
}