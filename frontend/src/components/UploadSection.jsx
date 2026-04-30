import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, ImageIcon, Loader2, AlertCircle } from 'lucide-react'

export default function UploadSection({ onAnalyze, loading, preview, setPreview, error }) {
  const [file, setFile] = useState(null)

  const onDrop = useCallback((accepted) => {
    if (!accepted.length) return
    const f = accepted[0]
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }, [setPreview])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png'] },
    multiple: false
  })

  const handleAnalyze = () => file && onAnalyze(file)

  const handleReset = () => { setFile(null); setPreview(null) }

  return (
    <section style={{ padding: '6rem 2rem', maxWidth: 760, margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{
            color: 'var(--lime)', fontSize: '0.8rem',
            letterSpacing: '0.15em', textTransform: 'uppercase',
            marginBottom: '0.8rem', fontWeight: 500
          }}>
            Instant Diagnosis
          </p>
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 300,
            color: 'var(--ivory)'
          }}>
            Upload a leaf image
          </h2>
        </div>

        {/* Dropzone */}
        <AnimatePresence mode="wait">
          {!preview ? (
            <motion.div
              key="dropzone"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              {...getRootProps()}
              style={{
                border: `2px dashed ${isDragActive ? 'var(--lime)' : 'rgba(168,255,62,0.2)'}`,
                borderRadius: 'var(--radius)',
                padding: '4rem 2rem',
                textAlign: 'center', cursor: 'pointer',
                background: isDragActive ? 'rgba(168,255,62,0.04)' : 'var(--glass)',
                transition: 'all 0.2s',
                backdropFilter: 'blur(10px)',
              }}
            >
              <input {...getInputProps()} />
              <motion.div
                animate={{ scale: isDragActive ? 1.1 : 1 }}
                style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'rgba(168,255,62,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.5rem'
                }}
              >
                {isDragActive
                  ? <ImageIcon size={28} color="var(--lime)" />
                  : <Upload size={28} color="var(--lime)" />
                }
              </motion.div>
              <p style={{ color: 'var(--ivory)', fontSize: '1rem', marginBottom: '0.5rem' }}>
                {isDragActive ? 'Drop it here' : 'Drag & drop a leaf image'}
              </p>
              <p style={{ color: 'rgba(245,240,232,0.4)', fontSize: '0.85rem' }}>
                or click to browse · JPG, PNG supported
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{
                borderRadius: 'var(--radius)',
                overflow: 'hidden',
                background: 'var(--glass)',
                border: '1px solid var(--glass-border)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div style={{ position: 'relative' }}>
                <img
                  src={preview} alt="Leaf preview"
                  style={{
                    width: '100%', maxHeight: 380,
                    objectFit: 'cover', display: 'block'
                  }}
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(10,26,15,0.8) 0%, transparent 50%)'
                }} />
                <button
                  onClick={handleReset}
                  style={{
                    position: 'absolute', top: 12, right: 12,
                    background: 'rgba(10,26,15,0.8)',
                    border: '1px solid rgba(245,240,232,0.2)',
                    color: 'var(--ivory)', borderRadius: '100px',
                    padding: '0.4rem 1rem', fontSize: '0.8rem',
                    cursor: 'pointer', fontFamily: 'DM Sans, sans-serif'
                  }}
                >
                  Change
                </button>
              </div>
              <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                <p style={{ color: 'rgba(245,240,232,0.5)', fontSize: '0.85rem' }}>
                  Ready to analyze
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                background: 'rgba(255,77,77,0.08)',
                border: '1px solid rgba(255,77,77,0.2)',
                borderRadius: 12, padding: '1rem 1.25rem', marginTop: '1rem'
              }}
            >
              <AlertCircle size={18} color="#ff4d4d" />
              <p style={{ color: '#ff4d4d', fontSize: '0.9rem' }}>{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Analyze button */}
        <AnimatePresence>
          {preview && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginTop: '1.5rem', textAlign: 'center' }}
            >
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(168,255,62,0.25)' }}
                whileTap={{ scale: 0.97 }}
                onClick={handleAnalyze}
                disabled={loading}
                style={{
                  background: loading ? 'rgba(168,255,62,0.4)' : 'var(--lime)',
                  color: 'var(--forest)', border: 'none',
                  borderRadius: '100px', padding: '1rem 3rem',
                  fontSize: '1rem', fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                  transition: 'background 0.2s'
                }}
              >
                {loading && (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                    <Loader2 size={18} />
                  </motion.div>
                )}
                {loading ? 'Analyzing…' : 'Analyze Disease'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}