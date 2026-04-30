import { useState } from 'react'
import axios from 'axios'
import UploadSection from '../components/UploadSection'
import ResultCard from '../components/ResultCard'
import { motion } from 'framer-motion'

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
      const res = await axios.post('http://127.0.0.1:8000/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setResult(res.data)
    } catch {
      setError('Analysis failed. Make sure the Leafly API is running on port 8000.')
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
    <div style={{ paddingTop: '80px', minHeight: '100vh' }}>
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', padding: '4rem 2rem 0' }}
      >
        <p style={{
          color: 'var(--lime)', fontSize: '0.8rem',
          letterSpacing: '0.15em', textTransform: 'uppercase',
          marginBottom: '0.8rem', fontWeight: 500
        }}>
          Diagnosis Tool
        </p>
        <h1 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
          fontWeight: 300, color: 'var(--ivory)'
        }}>
          Analyze your plant
        </h1>
        <p style={{
          color: 'rgba(245,240,232,0.45)', fontSize: '0.95rem',
          marginTop: '0.75rem', maxWidth: 420, margin: '0.75rem auto 0'
        }}>
          Upload a close-up photo of a single leaf for best results.
        </p>
      </motion.div>

      <UploadSection
        onAnalyze={handleAnalyze}
        loading={loading}
        preview={preview}
        setPreview={setPreview}
        error={error}
      />

      {result && (
        <ResultCard result={result} preview={preview} onReset={handleReset} />
      )}
    </div>
  )
}