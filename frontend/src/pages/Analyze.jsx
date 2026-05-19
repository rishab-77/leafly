import { useState, useEffect } from 'react'
import axios from 'axios'
import UploadSection from '../components/UploadSection'
import ResultCard from '../components/ResultCard'
import StatsDashboard from '../components/StatsDashboard'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, ChevronRight, ScanLine } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../firebase'
import { collection, addDoc, getDocs, query, where, orderBy, limit, serverTimestamp } from 'firebase/firestore'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const compressImage = (file, maxWidth = 400) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const scale = Math.min(maxWidth / img.width, 1);
        const canvas = document.createElement('canvas');
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.6));
      };
    };
  });
};

export default function Analyze() {
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)
  const [error, setError]     = useState(null)
  
  const { currentUser } = useAuth()
  const [history, setHistory] = useState([])

  // Load history
  useEffect(() => {
    if (currentUser) {
      const fetchHistory = async () => {
        try {
          const q = query(
            collection(db, 'scans'), 
            where('userId', '==', currentUser.uid)
          );
          const querySnapshot = await getDocs(q);
          const historyData = querySnapshot.docs.map(doc => doc.data());
          
          // Sort by timestamp or id descending (newest first)
          historyData.sort((a, b) => b.id - a.id);
          
          setHistory(historyData.slice(0, 10));
        } catch(err) {
          console.error("Error fetching history:", err)
          setError("Failed to load history from Firebase: " + err.message)
        }
      };
      fetchHistory();
    } else {
      const saved = localStorage.getItem('leafly_history')
      setHistory(saved ? JSON.parse(saved) : [])
    }
  }, [currentUser])

  const handleAnalyze = async (file) => {
    setLoading(true)
    setError(null)
    setResult(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const thumbnailBase64 = await compressImage(file, 400);

      const res = await axios.post(`${API_BASE_URL}/predict`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setResult(res.data)
      
      // Save to history
      const newScan = {
        id: Date.now(),
        disease: res.data.disease,
        confidence: res.data.confidence,
        breakdown: res.data.breakdown || null,
        thumbnail: thumbnailBase64,
        date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })
      }
      
      if (currentUser) {
        try {
          await addDoc(collection(db, 'scans'), {
            ...newScan,
            userId: currentUser.uid,
            timestamp: serverTimestamp()
          });
          setHistory(prev => [newScan, ...prev].slice(0, 10));
        } catch(e) {
          console.error("Error adding to Firestore: ", e);
          throw new Error("Firebase save failed: " + e.message);
        }
      } else {
        setHistory(prev => {
          const updated = [newScan, ...prev].slice(0, 10)
          localStorage.setItem('leafly_history', JSON.stringify(updated))
          return updated
        })
      }

      setResult(res.data)
      
    } catch (err) {
      if (err.message && err.message.startsWith("Firebase save failed")) {
        setError(err.message);
        return;
      }
      
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

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1000, margin: '0 auto', paddingBottom: '4rem' }}>
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
              
              {/* --- Recent Scans History --- */}
              {history.length > 0 && !preview && (
                <div style={{ maxWidth: 800, margin: '0 auto' }}>
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                    style={{ maxWidth: 600, margin: '0 auto', padding: '0 2rem' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'rgba(245,240,232,0.5)' }}>
                      <Clock size={16} />
                      <span style={{ fontSize: '0.85rem', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Recent Scans</span>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {history.slice(0, 4).map((item) => (
                        <motion.div 
                          key={item.id}
                          whileHover={{ scale: 1.02, background: 'rgba(255,255,255,0.04)' }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setResult(item);
                            setPreview(item.thumbnail || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="%23a8ff3e" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round" style="background:%230a0f0a"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>');
                          }}
                          style={{
                          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
                          borderRadius: '12px', padding: '1rem 1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          backdropFilter: 'blur(10px)', cursor: 'pointer'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            {item.thumbnail ? (
                              <img src={item.thumbnail} alt="scan" style={{ width: 44, height: 44, borderRadius: '8px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }} />
                            ) : (
                              <div style={{ width: 44, height: 44, borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <ScanLine size={20} color="rgba(168,255,62,0.5)" />
                              </div>
                            )}
                            <div>
                              <p style={{ color: '#f5f0e8', fontSize: '0.95rem', fontFamily: 'Inter, sans-serif', fontWeight: 500, margin: '0 0 0.2rem 0' }}>
                                {item.disease.includes('·') ? item.disease.split('·')[1].trim() : item.disease}
                              </p>
                              <p style={{ color: 'rgba(245,240,232,0.4)', fontSize: '0.8rem', fontFamily: 'Inter, sans-serif', margin: 0 }}>
                                {item.date} • {item.confidence}% confident
                              </p>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                              width: 8, height: 8, borderRadius: '50%',
                              background: item.disease.toLowerCase().includes('healthy') ? '#a8ff3e' : '#ffc844'
                            }} />
                            <ChevronRight size={18} color="rgba(245,240,232,0.4)" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* --- Dashboard Statistics --- */}
                  <StatsDashboard history={history} />
                </div>
              )}
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