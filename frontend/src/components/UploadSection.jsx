import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, ImageIcon, Loader2, AlertCircle, ScanLine } from 'lucide-react'

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
    <section style={{ padding: '4rem 2rem', maxWidth: 600, margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        {/* Dropzone */}
        <AnimatePresence mode="wait">
          {!preview ? (
            <motion.div
              key="dropzone"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              {...getRootProps()}
              style={{
                border: `2px dashed ${isDragActive ? '#a8ff3e' : 'rgba(255,255,255,0.2)'}`,
                borderRadius: '24px',
                padding: '4rem 2rem',
                textAlign: 'center', cursor: 'pointer',
                background: isDragActive ? 'rgba(168,255,62,0.05)' : 'rgba(255,255,255,0.02)',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
                boxShadow: isDragActive ? '0 0 30px rgba(168,255,62,0.1)' : '0 10px 30px rgba(0,0,0,0.2)',
              }}
            >
              <input {...getInputProps()} />
              <motion.div
                animate={{ scale: isDragActive ? 1.1 : 1, rotate: isDragActive ? 5 : 0 }}
                style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  boxShadow: 'inset 0 0 20px rgba(255,255,255,0.05)'
                }}
              >
                {isDragActive
                  ? <ImageIcon size={32} color="#a8ff3e" />
                  : <Upload size={32} color="rgba(245,240,232,0.8)" />
                }
              </motion.div>
              <p style={{ color: '#f5f0e8', fontSize: '1.2rem', fontFamily: 'Inter, sans-serif', fontWeight: 500, marginBottom: '0.5rem' }}>
                {isDragActive ? 'Drop image to scan' : 'Drag & drop a leaf image'}
              </p>
              <p style={{ color: 'rgba(245,240,232,0.4)', fontSize: '0.9rem', fontFamily: 'Inter, sans-serif' }}>
                or click to browse your files (JPG, PNG)
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                borderRadius: '24px',
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(168,255,62,0.3)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(168,255,62,0.1)',
                position: 'relative'
              }}
            >
              <div style={{ position: 'relative', height: '350px' }}>
                <img
                  src={preview} alt="Leaf preview"
                  style={{
                    width: '100%', height: '100%',
                    objectFit: 'cover', display: 'block'
                  }}
                />
                
                {/* --- Laser Scanning Animation (Visible when loading) --- */}
                <AnimatePresence>
                  {loading && (
                    <motion.div
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
                    >
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,15,10,0.4)' }} />
                      <motion.div
                        animate={{ y: [0, 350, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        style={{
                          width: '100%', height: '2px', background: '#a8ff3e',
                          boxShadow: '0 0 15px 4px rgba(168,255,62,0.5)',
                          position: 'absolute', top: 0, left: 0, zIndex: 2
                        }}
                      />
                      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 3, color: '#a8ff3e', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                         <ScanLine size={48} />
                         <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', letterSpacing: '0.1em', fontWeight: 600 }}>ANALYZING...</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!loading && (
                   <button
                     onClick={handleReset}
                     style={{
                       position: 'absolute', top: 16, right: 16,
                       background: 'rgba(10,15,10,0.6)', backdropFilter: 'blur(10px)',
                       border: '1px solid rgba(255,255,255,0.2)',
                       color: '#f5f0e8', borderRadius: '100px',
                       padding: '0.5rem 1.2rem', fontSize: '0.85rem',
                       cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                       transition: 'background 0.2s'
                     }}
                   >
                     Change Image
                   </button>
                )}
              </div>
              
              {!loading && (
                <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ color: 'rgba(245,240,232,0.4)', fontSize: '0.85rem', marginBottom: '0.2rem', fontFamily: 'Inter, sans-serif' }}>
                      Ready to analyze
                    </p>
                    {file && (
                      <p style={{ color: '#f5f0e8', fontSize: '0.95rem', fontFamily: 'Inter, sans-serif', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px' }}>
                        {file.name}
                      </p>
                    )}
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAnalyze}
                    style={{
                      background: 'linear-gradient(135deg, #a8ff3e 0%, #8ae62e 100%)',
                      color: '#0a0f0a', borderRadius: '100px', border: 'none',
                      padding: '0.8rem 2rem', fontSize: '0.95rem',
                      fontFamily: 'Inter, sans-serif', fontWeight: 600,
                      cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                      boxShadow: '0 10px 20px rgba(168,255,62,0.2)'
                    }}
                  >
                    Analyze <ScanLine size={16} />
                  </motion.button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                background: 'rgba(255,77,77,0.05)', backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,77,77,0.3)',
                borderRadius: '16px', padding: '1.2rem', marginTop: '1.5rem'
              }}
            >
              <AlertCircle size={24} color="#ff4d4d" style={{ flexShrink: 0 }} />
              <p style={{ color: '#ff4d4d', fontSize: '0.95rem', lineHeight: 1.5, fontFamily: 'Inter, sans-serif', margin: 0 }}>{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </section>
  )
}