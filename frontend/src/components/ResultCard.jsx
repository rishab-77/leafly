import { motion } from 'framer-motion'
import { 
  Download, Share2, AlertTriangle, ShieldCheck, 
  Sprout, Info, BarChart3, PieChart as PieIcon 
} from 'lucide-react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { DISEASES } from '../data/diseases'

const COLORS = ['#a8ff3e', '#8ae62e', '#ffc844', '#ff4d4d', '#00d1ff', '#9d50bb']

export default function ResultCard({ result, preview, onReset }) {
  const diseaseInfo = DISEASES[result.disease] || {
    name: result.disease,
    description: 'Unknown plant condition detected. Please consult an expert.',
    treatment: 'No specific treatment available in our database.',
    severity: 'Unknown'
  }

  // Prepare data for the Pie Chart (Top 5 predictions)
  const chartData = result.breakdown?.slice(0, 5).map(item => ({
    name: item.name,
    value: item.value
  })) || []

  // Remaining percentage for "Others"
  const topSum = chartData.reduce((acc, curr) => acc + curr.value, 0)
  if (topSum < 99.9 && result.breakdown?.length > 5) {
    chartData.push({ name: 'Other', value: Math.max(0, Math.round((100 - topSum) * 10) / 10) })
  }

  const handleDownloadPDF = async () => {
    const element = document.getElementById('diagnosis-report')
    const canvas = await html2canvas(element, {
      backgroundColor: '#0a0f0a',
      scale: 2,
    })
    
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgProps = pdf.getImageProperties(imgData)
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    pdf.save(`leafly-report-${Date.now()}.pdf`)
  }

  const handleShare = async () => {
    const shareData = {
      title: 'Leafly Diagnosis',
      text: `Leafly detected ${diseaseInfo.name} with ${result.confidence}% confidence. Treatment: ${diseaseInfo.treatment}`,
      url: window.location.href
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(shareData.text)
        alert('Diagnosis copied to clipboard!')
      }
    } catch (err) {
      console.error('Error sharing:', err)
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', padding: '0 1rem' }}>
      <div id="diagnosis-report" style={{ 
        background: 'rgba(255,255,255,0.02)',
        borderRadius: '32px',
        border: '1px solid rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        overflow: 'hidden',
        boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
        padding: '2rem'
      }}>
        {/* --- Header / Bento Layout --- */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          
          {/* Left: Image Preview */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            style={{ borderRadius: '20px', overflow: 'hidden', height: '100%', minHeight: 300, position: 'relative' }}
          >
            <img src={preview} alt="Scanned leaf" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ 
              position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem',
              background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'
            }}>
              <p style={{ color: '#a8ff3e', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.2rem' }}>Condition Found</p>
              <h2 style={{ color: '#f5f0e8', fontSize: '1.8rem', fontFamily: 'Cormorant Garamond, serif', margin: 0 }}>{diseaseInfo.name}</h2>
            </div>
          </motion.div>

          {/* Right: Confidence & Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Confidence Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              style={{ background: 'rgba(168,255,62,0.05)', borderRadius: '24px', padding: '1.5rem', border: '1px solid rgba(168,255,62,0.1)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ color: 'rgba(245,240,232,0.6)', fontSize: '0.9rem', fontWeight: 500 }}>AI Confidence</span>
                <ShieldCheck size={20} color="#a8ff3e" />
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span style={{ fontSize: '3rem', fontWeight: 300, color: '#a8ff3e', fontFamily: 'Cormorant Garamond, serif' }}>{result.confidence}</span>
                <span style={{ fontSize: '1.2rem', color: '#a8ff3e', opacity: 0.6 }}>%</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', marginTop: '1rem', overflow: 'hidden' }}>
                <motion.div 
                  initial={{ width: 0 }} animate={{ width: `${result.confidence}%` }}
                  style={{ height: '100%', background: '#a8ff3e', boxShadow: '0 0 10px rgba(168,255,62,0.5)' }} 
                />
              </div>
            </motion.div>

            {/* Severity Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '24px', padding: '1.5rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#f5f0e8' }}>
                <AlertTriangle size={18} color={diseaseInfo.severity === 'Critical' ? '#ff4d4d' : '#ffc844'} />
                <span style={{ fontWeight: 600 }}>Severity: {diseaseInfo.severity}</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* --- Analysis Breakdown (Pie Chart) --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ 
            marginTop: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', 
            padding: '2rem', border: '1px solid rgba(255,255,255,0.05)' 
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'rgba(245,240,232,0.6)' }}>
            <PieIcon size={18} />
            <span style={{ fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Probability Breakdown</span>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'center' }}>
            <div style={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%" cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    animationDuration={1500}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ background: '#0a0f0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#f5f0e8' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {chartData.map((item, i) => (
                <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS[i % COLORS.length] }} />
                    <span style={{ color: 'rgba(245,240,232,0.7)', fontSize: '0.9rem' }}>{item.name}</span>
                  </div>
                  <span style={{ color: '#f5f0e8', fontWeight: 600, fontSize: '0.9rem' }}>{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* --- Treatment & Description --- */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '24px', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#a8ff3e' }}>
              <Info size={20} />
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'Cormorant Garamond, serif' }}>Description</h3>
            </div>
            <p style={{ color: 'rgba(245,240,232,0.7)', lineHeight: 1.6, margin: 0 }}>{diseaseInfo.description}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            style={{ background: 'rgba(168,255,62,0.03)', borderRadius: '24px', padding: '2rem', border: '1px solid rgba(168,255,62,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#a8ff3e' }}>
              <Sprout size={20} />
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'Cormorant Garamond, serif' }}>Treatment Plan</h3>
            </div>
            <p style={{ color: 'rgba(245,240,232,0.7)', lineHeight: 1.6, margin: 0 }}>{diseaseInfo.treatment}</p>
          </motion.div>
        </div>
      </div>

      {/* --- Action Buttons --- */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'center' }}>
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={onReset}
          style={{ 
            padding: '1rem 2rem', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.1)',
            background: 'transparent', color: '#f5f0e8', cursor: 'pointer', fontWeight: 600
          }}
        >
          Scan Another
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={handleDownloadPDF}
          style={{ 
            padding: '1rem 2rem', borderRadius: '100px', border: 'none',
            background: '#a8ff3e', color: '#0a0f0a', cursor: 'pointer', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}
        >
          <Download size={18} /> Download PDF
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={handleShare}
          style={{ 
            padding: '1rem 2rem', borderRadius: '100px', border: '1px solid #a8ff3e30',
            background: 'rgba(168,255,62,0.1)', color: '#a8ff3e', cursor: 'pointer', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}
        >
          <Share2 size={18} /> Share Results
        </motion.button>
      </div>
    </div>
  )
}