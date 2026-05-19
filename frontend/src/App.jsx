import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Analyze from './pages/Analyze'
import HowItWorks from './pages/HowItWorks'
import Plants from './pages/Plants'
import About from './pages/About'

import { AuthProvider } from './contexts/AuthContext'
import Login from './pages/Login'
import Signup from './pages/Signup'

function SEOUpdater() {
  const location = useLocation();
  
  useEffect(() => {
    const seoData = {
      '/': { title: 'Leafly | AI Plant Disease Detection', desc: 'Upload a photo of a plant leaf and get an instant, laboratory-grade disease diagnosis with treatment recommendations powered by AI.' },
      '/analyze': { title: 'Analyze Plant | Leafly', desc: 'Scan a leaf image with our EfficientNetB3 model for an instant disease diagnosis and actionable agricultural advice.' },
      '/how-it-works': { title: 'How It Works | Leafly', desc: 'Learn about the machine learning pipeline powering Leafly, from HSV segmentation to deep transfer learning.' },
      '/plants': { title: 'Plant Encyclopedia | Leafly', desc: 'Browse our comprehensive database of tomato, potato, and bell pepper diseases, including severities and treatments.' },
      '/about': { title: 'About Leafly | ML Project', desc: 'Discover the architecture and performance metrics behind Leafly, an undergraduate final-year project achieving 98.84% accuracy.' },
      '/login': { title: 'Log In | Leafly', desc: 'Log in to Leafly to save your plant analysis history.' },
      '/signup': { title: 'Sign Up | Leafly', desc: 'Create a Leafly account to start saving your plant analysis history.' },
    };
    
    const current = seoData[location.pathname] || { title: 'Leafly | AI Plant Disease Detection', desc: 'AI Plant Disease Detection' };
    
    document.title = current.title;
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", current.desc);
    }
  }, [location]);

  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <SEOUpdater />
        <Navbar />
        <Routes>
          <Route path="/"              element={<Home />} />
          <Route path="/analyze"       element={<Analyze />} />
          <Route path="/how-it-works"  element={<HowItWorks />} />
          <Route path="/plants"        element={<Plants />} />
          <Route path="/about"         element={<About />} />
          <Route path="/login"         element={<Login />} />
          <Route path="/signup"        element={<Signup />} />
        </Routes>
        <Footer />
      </div>
    </AuthProvider>
  )
}