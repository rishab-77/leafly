import { motion } from 'framer-motion'
import { Cpu, Database, Layers, ExternalLink, Code2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const techStack = [
  { name: 'EfficientNetB3',  role: 'Classification Model',  detail: 'Pretrained on ImageNet, fine-tuned on PlantVillage' },
  { name: 'PyTorch 2.2',     role: 'Deep Learning Framework', detail: 'Transfer learning + two-phase training' },
  { name: 'FastAPI', role: 'Backend API',                    detail: 'POST /predict endpoint, fast inference time' },
  { name: 'React + Vite',    role: 'Frontend',               detail: 'Framer Motion animations, React Router pages' },
  { name: 'PlantVillage',    role: 'Dataset',                detail: '20,637 images · 15 classes · 70/15/15 split' },
]

export default function About() {
  const navigate = useNavigate()

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '4rem 2rem' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '4rem' }}
        >
          <p style={{
            color: 'var(--lime)', fontSize: '0.8rem',
            letterSpacing: '0.15em', textTransform: 'uppercase',
            marginBottom: '0.8rem', fontWeight: 500
          }}>
            The Project
          </p>
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
            fontWeight: 300, color: 'var(--ivory)', marginBottom: '1.5rem'
          }}>
            About Leafly
          </h1>
          <p style={{
            fontSize: '1rem', color: 'rgba(245,240,232,0.55)',
            lineHeight: 1.8, maxWidth: 620
          }}>
            Leafly is an AI-powered plant disease detection system built as part of an
            undergraduate final year project. It uses deep learning and transfer learning
            to classify plant diseases from leaf photographs with 91.8% test accuracy.
          </p>
        </motion.div>

        {/* Model performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: '4rem' }}
        >
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '1.6rem', fontWeight: 300,
            color: 'var(--ivory)', marginBottom: '1.5rem'
          }}>
            Model Performance
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {[
              { value: '92.4%', label: 'Phase 1 Val Acc', sub: 'Head training only' },
              { value: '99.5%', label: 'Phase 2 Val Acc', sub: 'After fine-tuning' },
              { value: '91.8%', label: 'Test Accuracy',   sub: 'Truly unseen data' },
            ].map(stat => (
              <div key={stat.label} style={{
                background: 'var(--glass)',
                border: '1px solid var(--glass-border)',
                borderRadius: 12, padding: '1.5rem',
                textAlign: 'center', backdropFilter: 'blur(10px)'
              }}>
                <div style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '2rem', color: 'var(--lime)',
                  fontWeight: 300, marginBottom: '0.25rem'
                }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--ivory)', marginBottom: '0.25rem' }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(245,240,232,0.35)' }}>
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tech stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: '4rem' }}
        >
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '1.6rem', fontWeight: 300,
            color: 'var(--ivory)', marginBottom: '1.5rem'
          }}>
            Tech Stack
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {techStack.map((tech, i) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                style={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--glass)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 12, padding: '1rem 1.25rem',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <div>
                  <span style={{ color: 'var(--ivory)', fontWeight: 500, fontSize: '0.9rem' }}>
                    {tech.name}
                  </span>
                  <span style={{
                    color: 'rgba(245,240,232,0.35)', fontSize: '0.8rem', marginLeft: '0.75rem'
                  }}>
                    {tech.role}
                  </span>
                </div>
                <span style={{ fontSize: '0.78rem', color: 'rgba(245,240,232,0.4)', textAlign: 'right', maxWidth: 220 }}>
                  {tech.detail}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
        >
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(168,255,62,0.25)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/analyze')}
            style={{
              background: 'var(--lime)', color: 'var(--forest)',
              border: 'none', borderRadius: '100px',
              padding: '0.9rem 2rem', fontSize: '0.95rem',
              fontFamily: 'DM Sans, sans-serif', fontWeight: 500,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}
          >
            Try Leafly
            <ExternalLink size={15} />
          </motion.button>
          
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => window.open('https://github.com/rishab-77/leafly', '_blank')}
              style={{
                background: 'transparent', color: 'var(--ivory)',
                border: '1px solid rgba(245,240,232,0.2)',
                borderRadius: '100px', padding: '0.9rem 2rem',
                fontSize: '0.95rem', fontFamily: 'DM Sans, sans-serif',
                fontWeight: 300, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.5rem'
              }}
            >
              <Code2 size={16} />
              View on GitHub
            </motion.button>
        </motion.div>
      </div>
    </div>
  )
}