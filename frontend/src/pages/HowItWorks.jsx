import { motion } from 'framer-motion'
import { Upload, Cpu, FlaskConical, Brain, Database, Layers } from 'lucide-react'
import { useState, useEffect } from 'react'

const steps = [
  { icon: Upload,       num: '01', title: 'Upload Image',         desc: 'Drag and drop or click to upload a close-up photo of the affected leaf. We process JPG and PNG formats.' },
  { icon: Cpu,          num: '02', title: 'Preprocessing',        desc: 'The image is segmented, resized to 224×224 pixels, and contrast-enhanced using CLAHE to match training conditions.' },
  { icon: Brain,        num: '03', title: 'Deep Feature Extraction',desc: 'The image passes through 11 million trained parameters of EfficientNetB3, extracting deep visual patterns.' },
  { icon: Layers,       num: '04', title: 'Classification Head',  desc: 'A custom classification head maps the extracted high-level features to one of 15 distinct plant disease classes.' },
  { icon: FlaskConical, num: '05', title: 'Softmax Activation',   desc: 'Softmax converts raw neural scores to confident probabilities. The highest probability becomes the prediction.' },
  { icon: Database,     num: '06', title: 'Instant Diagnosis',    desc: 'The disease name, confidence score, and treatment recommendation are returned to you in under 2 seconds.' },
]

export default function HowItWorks() {
  const [hoveredStep, setHoveredStep] = useState(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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
        position: 'fixed', top: '20%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '80vw', height: '80vw',
        background: 'radial-gradient(circle, rgba(168,255,62,0.05) 0%, transparent 60%)',
        pointerEvents: 'none', zIndex: 0
      }} />

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '4rem 2rem', position: 'relative', zIndex: 10 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '6rem' }}
        >
          <p style={{
            color: '#a8ff3e', fontSize: '0.85rem',
            letterSpacing: '0.15em', textTransform: 'uppercase',
            marginBottom: '0.8rem', fontWeight: 600
          }}>
            Under The Hood
          </p>
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 400, color: '#f5f0e8', marginBottom: '1.2rem'
          }}>
            The Machine Learning Pipeline
          </h1>
          <p style={{
            color: 'rgba(245,240,232,0.6)', fontSize: '1.1rem', fontFamily: 'Inter, sans-serif',
            maxWidth: 600, margin: '0 auto', lineHeight: 1.6
          }}>
            Trace the journey of your leaf image from pixel data to a highly accurate diagnosis through our deep transfer learning architecture.
          </p>
        </motion.div>

        {/* Timeline Container */}
        <div style={{ position: 'relative', paddingBottom: '4rem' }}>
          
          {/* Central Glowing Line (Desktop Only) */}
          {!isMobile && (
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: '100%' }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              style={{
                position: 'absolute', top: 0, bottom: 0, left: '50%', transform: 'translateX(-50%)',
                width: '2px', background: 'linear-gradient(to bottom, rgba(168,255,62,0.1), #a8ff3e, rgba(168,255,62,0.1))',
                boxShadow: '0 0 15px rgba(168,255,62,0.4)',
                zIndex: 0
              }} 
            />
          )}

          {/* Timeline Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '2rem' : '4rem' }}>
            {steps.map((step, i) => {
              const isEven = i % 2 === 0;
              const isHovered = hoveredStep === i;
              const isFaded = hoveredStep !== null && hoveredStep !== i;

              return (
                <motion.div
                  key={step.num}
                  onMouseEnter={() => setHoveredStep(i)}
                  onMouseLeave={() => setHoveredStep(null)}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.5 }}
                  style={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : (isEven ? 'row' : 'row-reverse'),
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: isMobile ? '1rem' : '4rem',
                    position: 'relative',
                    opacity: isFaded ? 0.3 : 1,
                    transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    willChange: 'transform, opacity'
                  }}
                >
                  {/* Content Box */}
                  <div style={{
                    flex: 1, width: '100%',
                    display: 'flex', justifyContent: isMobile ? 'center' : (isEven ? 'flex-end' : 'flex-start'),
                    textAlign: isMobile ? 'center' : (isEven ? 'right' : 'left')
                  }}>
                    <div style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: '20px', padding: '2rem',
                      backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
                      maxWidth: '400px',
                      boxShadow: isHovered ? '0 20px 40px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(168,255,62,0.3)' : '0 10px 30px rgba(0,0,0,0.2)',
                      transition: 'all 0.3s ease'
                    }}>
                      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : (isEven ? 'row-reverse' : 'row'), alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <span style={{
                          fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', fontWeight: 600,
                          color: '#a8ff3e', background: 'rgba(168,255,62,0.1)',
                          padding: '0.3rem 0.8rem', borderRadius: '100px'
                        }}>
                          STEP {step.num}
                        </span>
                        <h3 style={{
                          fontFamily: 'Cormorant Garamond, serif',
                          fontSize: '1.5rem', fontWeight: 400, color: '#f5f0e8', margin: 0
                        }}>
                          {step.title}
                        </h3>
                      </div>
                      <p style={{ fontSize: '0.95rem', color: 'rgba(245,240,232,0.6)', lineHeight: 1.6, fontFamily: 'Inter, sans-serif', margin: 0 }}>
                        {step.desc}
                      </p>
                    </div>
                  </div>

                  {/* Center Node */}
                  {!isMobile && (
                    <div style={{
                      position: 'relative', width: '60px', height: '60px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      zIndex: 2
                    }}>
                      <motion.div
                        animate={isHovered ? { scale: [1, 1.2, 1], rotate: [0, 180, 360] } : {}}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        style={{
                          position: 'absolute', inset: 0, borderRadius: '50%',
                          border: `2px dashed ${isHovered ? '#a8ff3e' : 'rgba(168,255,62,0.3)'}`,
                          willChange: 'transform'
                        }}
                      />
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '50%',
                        background: '#0a0f0a', border: `2px solid ${isHovered ? '#a8ff3e' : 'rgba(255,255,255,0.2)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: isHovered ? '0 0 20px rgba(168,255,62,0.5)' : 'none',
                        transition: 'all 0.3s ease'
                      }}>
                        <step.icon size={18} color={isHovered ? '#a8ff3e' : 'rgba(245,240,232,0.5)'} />
                      </div>
                    </div>
                  )}

                  {/* Empty space for alternating layout */}
                  {!isMobile && <div style={{ flex: 1 }} />}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Model stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            marginTop: '2rem',
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {[
            { value: 'EfficientNetB3', label: 'Architecture' },
            { value: '11M',            label: 'Parameters' },
            { value: '98.84%',         label: 'Test Accuracy' },
            { value: '224×224',        label: 'Input Size' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '20px', padding: '2rem',
              textAlign: 'center', backdropFilter: 'blur(10px)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '1.8rem', color: '#a8ff3e',
                fontWeight: 400, marginBottom: '0.5rem'
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '0.75rem', color: 'rgba(245,240,232,0.5)',
                letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif'
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}