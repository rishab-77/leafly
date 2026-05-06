import { useState } from 'react'
import axios from 'axios'
import UploadSection from '../components/UploadSection'
import ResultCard from '../components/ResultCard'
import { motion, AnimatePresence } from 'framer-motion'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export default function Analyze() {
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)
  const [error, setError]     = useState(null)

  const handleAnalyze = async (file) => {
    setLoading(true)
    setError(null)
    setResult(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await axios.post(`${API_BASE_URL}/predict`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setResult(res.data)
    } catch (err) {
      const statusCode = err?.response?.status
      const backendMessage = err?.response?.data?.detail

      if (!err?.response) {
        setError(
          `Cannot reach Leafly API at ${API_BASE_URL}. Start the backend and verify VITE_API_URL in frontend/.env, then restart Vite.`
        )
      } else if (backendMessage) {
        setError(`Analysis failed (${statusCode ?? 'error'}): ${backendMessage}`)
      } else {
        setError(
          `Analysis failed with status ${statusCode ?? 'unknown'}. Make sure the Leafly API is running and VITE_API_URL is configured correctly.`
        )
      }
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setPreview(null)
    setError(null)
  }

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
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '100vw', height: '100vw',
        background: 'radial-gradient(circle, rgba(168,255,62,0.03) 0%, transparent 50%)',
        pointerEvents: 'none', zIndex: 0
      }} />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1000, margin: '0 auto' }}>
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', padding: '4rem 2rem 0' }}
        >
          <p style={{
            color: '#a8ff3e', fontSize: '0.85rem',
            letterSpacing: '0.15em', textTransform: 'uppercase',
            marginBottom: '0.8rem', fontWeight: 600
          }}>
            Diagnosis Tool
          </p>
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 400, color: '#f5f0e8', marginBottom: '1.2rem'
          }}>
            Analyze your plant
          </h1>
          <p style={{
            color: 'rgba(245,240,232,0.6)', fontSize: '1.1rem', fontFamily: 'Inter, sans-serif',
            maxWidth: 500, margin: '0 auto', lineHeight: 1.6
          }}>
            Upload a close-up photo of a single leaf to get a diagnosis powered by EfficientNet-B3.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <UploadSection
                onAnalyze={handleAnalyze}
                loading={loading}
                preview={preview}
                setPreview={setPreview}
                error={error}
              />
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
              <ResultCard result={result} preview={preview} onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}