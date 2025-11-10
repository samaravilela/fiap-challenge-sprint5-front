const modules = [
  { 
    icon: '📅', 
    title: 'Agendamento Inteligente', 
    features: [
      'Interface simplificada em 3 passos',
      'Seleção de especialidades com explicações acessíveis',
      'Exibição de horários disponíveis com filtros',
      'Sugestões automáticas baseadas em histórico'
    ]
  },
  { 
    icon: '⚙️', 
    title: 'Gestão de Consultas', 
    features: [
      'Cancelamento com 1 clique',
      'Remarcação assistida com sugestões inteligentes',
      'Status em tempo real',
      'Notificações instantâneas'
    ]
  },
  { 
    icon: '🏥', 
    title: 'Informações Médicas', 
    features: [
      'Especialidades explicadas de forma simplificada',
      'Orientações pré-consulta e pré-exame',
      'Checklist interativo de preparo',
      'Orientações pós-consulta em formato acessível'
    ]
  },
  { 
    icon: '📍', 
    title: 'Localização e Acesso', 
    features: [
      'Rotas personalizadas via Google Maps',
      'Visualização 360° do hospital',
      'Estacionamento inteligente',
      'Informações sobre transporte público'
    ]
  },
  { 
    icon: '🤖', 
    title: 'Sistema de Recomendação', 
    features: [
      'Sugestões de horários baseadas em histórico',
      'Recomendações de especialidades por sintomas',
      'Análise preditiva de comparecimento',
      'Personalização por perfil do paciente'
    ]
  },
  { 
    icon: '💬', 
    title: 'Comunicação Personalizada', 
    features: [
      'Canal mais eficaz (WhatsApp, SMS, Email)',
      'Adaptação de linguagem por faixa etária',
      'Versão falada para idosos',
      'Lembretes automáticos inteligentes'
    ]
  }
]

export default function HowItWorks() {
  return (
    <section id="features" className="py-16">
      <div className="container">
        <div className="section-title">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Funcionalidades Principais</h2>
          <p className="text-lg text-white/90">Módulos inteligentes que transformam a gestão hospitalar</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {modules.map((module, index) => (
            <div key={index} className="card group hover:scale-105 transition-transform duration-300">
              <div className="text-5xl mb-4 text-center">{module.icon}</div>
              <h3 className="text-xl font-bold text-white mb-4 text-center">{module.title}</h3>
              <ul className="space-y-2">
                {module.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-white/90 text-sm">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
