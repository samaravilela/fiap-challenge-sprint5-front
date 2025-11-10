export default function FeaturesSection() {
  const features = [
    {
      icon: '🎯',
      title: 'Redução de Absenteísmo',
      description: 'Meta de 40% de redução em 6 meses através de lembretes automatizados e interface intuitiva',
      stat: '40%'
    },
    {
      icon: '⚡',
      title: 'Agendamento em 3 Passos',
      description: 'Interface simplificada projetada para usuários com baixa familiaridade tecnológica',
      stat: '3'
    },
    {
      icon: '🔔',
      title: 'Lembretes Inteligentes',
      description: 'Notificações automáticas por WhatsApp, SMS e email antes das consultas',
      stat: '24/7'
    },
    {
      icon: '📊',
      title: 'Análise Preditiva',
      description: 'Identificação de horários com maior risco de faltas para agendamento estratégico',
      stat: 'IA'
    },
    {
      icon: '🗺️',
      title: 'Localização Inteligente',
      description: 'Rotas personalizadas, visualização 360° e informações de estacionamento',
      stat: '100%'
    },
    {
      icon: '💡',
      title: 'Recomendações Personalizadas',
      description: 'Sugestões de horários e especialidades baseadas no histórico do paciente',
      stat: 'IA'
    }
  ]

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20"></div>
      
      <div className="container max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl mb-6 shadow-lg">
            <span className="text-3xl">✨</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Diferenciais da Plataforma
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Tecnologia de ponta aliada à simplicidade para transformar o acesso à saúde
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-600 mx-auto rounded-full mt-4"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{feature.icon}</div>
                <div className="text-3xl font-bold text-blue-300">{feature.stat}</div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-white/90 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Otimização de Recursos Hospitalares</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">⏰</div>
              <h4 className="text-white font-semibold mb-2">Identificação de Horários</h4>
              <p className="text-white/80 text-sm">
                Identificação de horários com maior risco de faltas para agendamento estratégico
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">📈</div>
              <h4 className="text-white font-semibold mb-2">Previsão de Demanda</h4>
              <p className="text-white/80 text-sm">
                Previsão de demanda por especialidade para alocação inteligente de médicos
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🏢</div>
              <h4 className="text-white font-semibold mb-2">Redução de Desperdício</h4>
              <p className="text-white/80 text-sm">
                Redução de desperdício de infraestrutura (salas e equipamentos)
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

