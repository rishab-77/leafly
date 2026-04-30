import { motion } from 'framer-motion'
import { Upload, Cpu, FlaskConical } from 'lucide-react'

const steps = [
  { icon: Upload,       num: '01', title: 'Upload',   desc: 'Drag and drop a close-up photo of the affected leaf. JPG or PNG.' },
  { icon: Cpu,          num: '02', title: 'Analyse',  desc: 'EfficientNetB3 processes the image through 11M trained parameters.' },
  { icon: FlaskConical, num: '03', title: 'Diagnose', desc: 'Receive the disease name, confidence score, and treatment advice.' },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" style={{ padding: '6rem 2rem', maxWidth: 900, margin: '0 auto' }}>
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
        }}>Process</p>
        <h2 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 300, color: 'var(--ivory)'
        }}>
          How it works
        </h2>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        {steps.map((step, i) => (
          <motion.div
            key={step.num}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.6 }}
            style={{
              background: 'var(--glass)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius)',
              padding: '2rem',
              backdropFilter: 'blur(10px)',
              position: 'relative', overflow: 'hidden'
            }}
          >
            <div style={{
              position: 'absolute', top: '-10px', right: '-5px',
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '5rem', fontWeight: 300,
              color: 'rgba(168,255,62,0.04)',
              lineHeight: 1, userSelect: 'none'
            }}>
              {step.num}
            </div>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'rgba(168,255,62,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '1.2rem'
            }}>
              <step.icon size={20} color="var(--lime)" />
            </div>
            <h3 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '1.3rem', fontWeight: 400,
              color: 'var(--ivory)', marginBottom: '0.6rem'
            }}>
              {step.title}
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'rgba(245,240,232,0.5)', lineHeight: 1.7 }}>
              {step.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}