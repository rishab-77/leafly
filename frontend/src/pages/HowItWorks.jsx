import { motion } from 'framer-motion'
import { Upload, Cpu, FlaskConical, Brain, Database, Layers } from 'lucide-react'

const steps = [
  { icon: Upload,       num: '01', title: 'Upload a Leaf Image',       desc: 'Drag and drop or click to upload a close-up photo of the affected leaf. JPG or PNG supported.' },
  { icon: Cpu,          num: '02', title: 'Image Preprocessing',       desc: 'The image is resized to 224×224 pixels and normalized using ImageNet statistics to match training conditions.' },
  { icon: Brain,        num: '03', title: 'EfficientNetB3 Inference',  desc: 'The image passes through 11 million trained parameters of EfficientNetB3, extracting deep visual features.' },
  { icon: Layers,       num: '04', title: 'Classification Head',       desc: 'A custom classification head maps the extracted features to one of 15 plant disease classes.' },
  { icon: FlaskConical, num: '05', title: 'Softmax + Confidence',      desc: 'Softmax converts raw scores to probabilities. The highest probability class becomes the prediction.' },
  { icon: Database,     num: '06', title: 'Result + Treatment',        desc: 'The disease name, confidence score, and treatment recommendation are returned to you instantly.' },
]

export default function HowItWorks() {
  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '4rem 2rem' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '5rem' }}
        >
          <p style={{
            color: 'var(--lime)', fontSize: '0.8rem',
            letterSpacing: '0.15em', textTransform: 'uppercase',
            marginBottom: '0.8rem', fontWeight: 500
          }}>
            Under The Hood
          </p>
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
            fontWeight: 300, color: 'var(--ivory)', marginBottom: '1rem'
          }}>
            How Leafly works
          </h1>
          <p style={{
            color: 'rgba(245,240,232,0.45)', fontSize: '0.95rem',
            maxWidth: 500, margin: '0 auto', lineHeight: 1.7
          }}>
            From raw image to diagnosis — a full walkthrough of the
            EfficientNetB3 transfer learning pipeline.
          </p>
        </motion.div>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              style={{
                display: 'grid', gridTemplateColumns: '60px 1fr',
                gap: '1.5rem', alignItems: 'start',
                background: 'var(--glass)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius)',
                padding: '1.75rem',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: 'rgba(168,255,62,0.08)',
                border: '1px solid rgba(168,255,62,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                <step.icon size={22} color="var(--lime)" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '0.75rem', color: 'var(--lime)',
                    letterSpacing: '0.15em'
                  }}>
                    {step.num}
                  </span>
                  <h3 style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '1.25rem', fontWeight: 400, color: 'var(--ivory)'
                  }}>
                    {step.title}
                  </h3>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'rgba(245,240,232,0.5)', lineHeight: 1.7 }}>
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Model stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            marginTop: '4rem',
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1rem'
          }}
        >
          {[
            { value: 'EfficientNetB3', label: 'Architecture' },
            { value: '11M',            label: 'Parameters' },
            { value: '91.8%',          label: 'Test Accuracy' },
            { value: '224×224',        label: 'Input Size' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: 'var(--glass)',
              border: '1px solid var(--glass-border)',
              borderRadius: 12, padding: '1.5rem',
              textAlign: 'center', backdropFilter: 'blur(10px)'
            }}>
              <div style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '1.4rem', color: 'var(--lime)',
                fontWeight: 300, marginBottom: '0.3rem'
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '0.75rem', color: 'rgba(245,240,232,0.4)',
                letterSpacing: '0.08em', textTransform: 'uppercase'
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