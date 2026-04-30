import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Analyze from './pages/Analyze'
import HowItWorks from './pages/HowItWorks'
import Plants from './pages/Plants'
import About from './pages/About'

export default function App() {
  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <Navbar />
      <Routes>
        <Route path="/"              element={<Home />} />
        <Route path="/analyze"       element={<Analyze />} />
        <Route path="/how-it-works"  element={<HowItWorks />} />
        <Route path="/plants"        element={<Plants />} />
        <Route path="/about"         element={<About />} />
      </Routes>
      <Footer />
    </div>
  )
}