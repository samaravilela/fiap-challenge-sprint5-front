const solutions = [
  {
    icon: '🏥',
    title: 'Agendamento Online',
    description: 'Agende suas consultas e exames de forma rápida e segura, 24 horas por dia.'
  },
  {
    icon: '📅',
    title: 'Remarcação Fácil',
    description: 'Altere seus horários sem complicação, diretamente pela plataforma.'
  },
  {
    icon: '❌',
    title: 'Cancelamento Rápido',
    description: 'Cancele suas consultas quando necessário, com confirmação imediata.'
  },
  {
    icon: '🔔',
    title: 'Lembretes Automáticos',
    description: 'Receba notificações por SMS e email antes de suas consultas.'
  },
  {
    icon: '📍',
    title: 'Localização Inteligente',
    description: 'Encontre facilmente a localização da sua consulta com mapas integrados.'
  },
  {
    icon: '📊',
    title: 'Histórico Completo',
    description: 'Acompanhe todo seu histórico médico e de consultas em um só lugar.'
  }
]

export default function Solutions() {
  return (
    <section id="solutions" className="solutions">
      <div className="container">
        <div className="solution-cards">
          {solutions.map((solution, index) => (
            <div key={index} className="solution-card">
              <div className="solution-icon">{solution.icon}</div>
              <h3>{solution.title}</h3>
              <p>{solution.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
