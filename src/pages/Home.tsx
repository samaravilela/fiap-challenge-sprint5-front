import Hero from '../components/Hero'
import AboutSection from '../components/AboutSection'
import FeaturesSection from '../components/FeaturesSection'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <>
      <Hero />
      <AboutSection />
      <FeaturesSection />
      
      {/* Call to Action Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-purple-600/30 to-indigo-600/30"></div>
        <div className="container max-w-4xl mx-auto relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Pronto para transformar sua experiência em saúde?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Comece agora mesmo a agendar suas consultas de forma simples, rápida e inteligente. 
            Nossa plataforma está pronta para cuidar de você.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/consultas" 
              className="btn btn-primary px-8 py-4 text-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Agendar Minha Consulta
            </Link>
            <Link 
              to="/solutions" 
              className="btn btn-secondary px-8 py-4 text-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Ver Todas as Soluções
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
