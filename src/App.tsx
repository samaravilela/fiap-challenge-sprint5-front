import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Features from './pages/Features'
import SolutionsPage from './pages/SolutionsPage'
import Contact from './pages/Contact'
import Reschedule from './pages/Reschedule'
import Cancel from './pages/Cancel'
import Consultas from './pages/Consultas'
import Team from './pages/Team'
import MemberDetail from './pages/MemberDetail'
import ChatFAQ from './components/ChatFAQ'

export default function App() {
  const location = useLocation()

  useEffect(() => {
    const titles: Record<string, string> = {
      '/': 'EaseHC — Início',
      '/about': 'Sobre Nós — EaseHC',
      '/consultas': 'Consultas — EaseHC',
      '/contact': 'Agendar Consulta — EaseHC',
      '/reschedule': 'Remarcar Consulta — EaseHC',
      '/cancel': 'Cancelar Consulta — EaseHC',
      '/team': 'Equipe — EaseHC',
      '/faq': 'FAQ — EaseHC',
      '/features': 'Funcionalidades — EaseHC',
      '/solutions': 'Soluções — EaseHC',
      '/test-connection': 'Teste de Conexão — EaseHC'
    }
    document.title = titles[location.pathname] ?? 'EaseHC'
  }, [location.pathname])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/consultas" element={<Consultas />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/features" element={<Features />} />
          <Route path="/solutions" element={<SolutionsPage />} />
          <Route path="/reschedule" element={<Reschedule />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/team" element={<Team />} />
          <Route path="/team/:memberId" element={<MemberDetail />} />
          <Route path="/faq" element={<ChatFAQ />} />
          <Route path="*" element={<div className="container py-16">Página não encontrada.</div>} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
