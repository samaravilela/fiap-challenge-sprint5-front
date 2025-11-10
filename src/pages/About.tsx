import { Link } from 'react-router-dom'

export default function About() {
  return (
    <section className="py-20 px-4 relative overflow-hidden min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-indigo-900/20"></div>
      
      <div className="container max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <span className="text-3xl">🏥</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Sobre a Empresa
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Text content */}
          <div className="space-y-6">
            <p className="text-lg text-white/90 leading-relaxed">
              Somos uma equipe dedicada a transformar a forma como pacientes se conectam com os serviços de saúde.
              Nossa empresa nasceu com o propósito de tornar o agendamento de consultas mais simples, rápido e acessível, 
              oferecendo uma experiência moderna e intuitiva para todos os públicos.
            </p>
            
            <p className="text-lg text-white/90 leading-relaxed">
              Acreditamos que a tecnologia deve aproximar as pessoas dos cuidados médicos, e não afastá-las.
              Por isso, desenvolvemos uma plataforma prática e segura, que facilita agendamentos, cancelamentos, 
              remarcações e fornece todas as informações necessárias — desde especialidades médicas até orientações 
              pré e pós-exames.
            </p>
            
            <p className="text-lg text-white/90 leading-relaxed">
              Com foco em inclusão digital e eficiência, buscamos reduzir as faltas às consultas e melhorar a 
              comunicação entre pacientes e o Hospital das Clínicas.
              Nosso compromisso é garantir que cada usuário tenha uma jornada simples, clara e sem complicações.
            </p>
          </div>

          {/* Visual elements */}
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl p-6 border border-blue-400/30">
                  <div className="text-3xl mb-3">⚡</div>
                  <h3 className="text-white font-semibold mb-2">Rapidez</h3>
                  <p className="text-white/80 text-sm">Agendamentos em segundos</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl p-6 border border-purple-400/30">
                  <div className="text-3xl mb-3">🔒</div>
                  <h3 className="text-white font-semibold mb-2">Segurança</h3>
                  <p className="text-white/80 text-sm">Dados protegidos</p>
                </div>
                
                <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl p-6 border border-green-400/30">
                  <div className="text-3xl mb-3">📱</div>
                  <h3 className="text-white font-semibold mb-2">Acessibilidade</h3>
                  <p className="text-white/80 text-sm">Interface intuitiva</p>
                </div>
                
                <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-2xl p-6 border border-orange-400/30">
                  <div className="text-3xl mb-3">🤝</div>
                  <h3 className="text-white font-semibold mb-2">Suporte</h3>
                  <p className="text-white/80 text-sm">Atendimento 24/7</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission and Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
            <div className="text-4xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold text-white mb-4">Nossa Missão</h2>
            <p className="text-white/90 leading-relaxed">
              Reduzir significativamente o absenteísmo através de lembretes inteligentes, comunicação personalizada 
              e análise preditiva, simplificando o acesso à saúde e permitindo que pacientes de diversos perfis 
              agendem, cancelem ou remarquem consultas sem barreiras.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
            <div className="text-4xl mb-4">👁️</div>
            <h2 className="text-2xl font-bold text-white mb-4">Nossa Visão</h2>
            <p className="text-white/90 leading-relaxed">
              Ser a plataforma de referência em gestão hospitalar inteligente, transformando dados brutos em 
              decisões estratégicas que impactam diretamente na qualidade do atendimento e na sustentabilidade 
              financeira das instituições de saúde.
            </p>
          </div>
        </div>

        {/* Stats section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
            <div className="text-5xl font-bold text-white mb-2">1000+</div>
            <div className="text-white/80 text-lg">Pacientes Atendidos</div>
          </div>
          <div className="text-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
            <div className="text-5xl font-bold text-white mb-2">99%</div>
            <div className="text-white/80 text-lg">Satisfação</div>
          </div>
          <div className="text-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
            <div className="text-5xl font-bold text-white mb-2">24h</div>
            <div className="text-white/80 text-lg">Disponibilidade</div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-3xl p-12 border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-4">
            Quer saber mais sobre nossa equipe?
          </h2>
          <p className="text-white/90 mb-6 text-lg">
            Conheça os profissionais por trás da EaseHC
          </p>
          <Link 
            to="/team" 
            className="btn btn-primary px-8 py-4 text-lg font-semibold hover:opacity-90 transition-opacity inline-block"
          >
            Conhecer Nossa Equipe
          </Link>
        </div>
      </div>
    </section>
  )
}

