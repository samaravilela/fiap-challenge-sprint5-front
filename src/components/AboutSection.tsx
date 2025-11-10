export default function AboutSection() {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-indigo-900/20"></div>
      
      <div className="container max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <span className="text-3xl">🎯</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Objetivos Estratégicos
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Transformando dados brutos em decisões inteligentes para melhorar o acesso à saúde
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full mt-4"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-3">
                <span className="text-3xl">🎯</span>
                Objetivo Primário
              </h3>
            <p className="text-lg text-white/90 leading-relaxed">
                <strong className="text-3xl text-blue-300">Reduzir absenteísmo em 40%</strong> em 6 meses através de lembretes automatizados e interface intuitiva.
            </p>
          </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Objetivos Secundários</h3>
              <ul className="space-y-3 text-white/90">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">✓</span>
                  <span>Tornar o processo de agendamento, cancelamento e remarcação mais ágil e acessível</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">✓</span>
                  <span>Fornecer informações médicas claras e compreensíveis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">✓</span>
                  <span>Otimizar a experiência de localização e acesso ao hospital</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">✓</span>
                  <span>Melhorar a eficiência interna com alocação inteligente de profissionais</span>
                </li>
              </ul>
            </div>
                </div>
                
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Impacto da Plataforma</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl p-6 border border-blue-400/30 text-center">
                  <div className="text-4xl mb-3">👥</div>
                  <h4 className="text-white font-semibold mb-2">Pacientes</h4>
                  <p className="text-white/80 text-sm">Mais segurança, acessibilidade e previsibilidade</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl p-6 border border-purple-400/30 text-center">
                  <div className="text-4xl mb-3">👨‍⚕️</div>
                  <h4 className="text-white font-semibold mb-2">Profissionais</h4>
                  <p className="text-white/80 text-sm">Otimizam tempo e reduzem consultas perdidas</p>
                </div>
                
                <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl p-6 border border-green-400/30 text-center col-span-2">
                  <div className="text-4xl mb-3">📊</div>
                  <h4 className="text-white font-semibold mb-2">Gestores Hospitalares</h4>
                  <p className="text-white/80 text-sm">Recebem relatórios analíticos para decisões estratégicas</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 mt-12">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Desafios que Resolvemos</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-xl p-6 border border-red-400/30">
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <span>📉</span> Alto Absenteísmo
              </h4>
              <p className="text-white/90 text-sm">
                Reduzimos faltas através de lembretes inteligentes, comunicação personalizada e análise preditiva.
              </p>
          </div>
            <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-xl p-6 border border-orange-400/30">
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <span>🔧</span> Dificuldades de Acesso
              </h4>
              <p className="text-white/90 text-sm">
                Interface simplificada em 3 passos, acessível para usuários de todas as idades e níveis tecnológicos.
              </p>
          </div>
          </div>
        </div>
      </div>
    </section>
  )
}
