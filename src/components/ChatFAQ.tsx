import { useState } from 'react'

const faqs = [
  {
    q: 'Como posso marcar uma consulta de forma rápida e online?',
    a: (
      <div>
        <p>Você pode agendar em poucos cliques:</p>
        <ol className="list-decimal ml-6">
          <li>Acesse nosso sistema de agendamento</li>
          <li>Selecione a especialidade</li>
          <li>Escolha médico e horário</li>
          <li>Confirme seus dados</li>
          <li>Receba a confirmação por e-mail/SMS</li>
        </ol>
      </div>
    )
  },
  {
    q: 'Preciso cancelar ou remarcar minha consulta. Como fazer isso sem precisar ligar?',
    a: (
      <div>
        <p>É simples:</p>
        <ul className="list-disc ml-6">
          <li>Pelo link do agendamento</li>
          <li>No aplicativo (menu “Minhas Consultas”)</li>
          <li>Via WhatsApp</li>
        </ul>
      </div>
    )
  },
  {
    q: 'Quais são os preparos necessários antes do meu exame ou consulta?',
    a: (
      <ul className="list-disc ml-6">
        <li><b>Exames de sangue:</b> Jejum de 8 horas</li>
        <li><b>Consultas:</b> Leve exames anteriores e lista de medicamentos</li>
        <li><b>Avaliações:</b> Use roupas confortáveis</li>
      </ul>
    )
  }
]

export default function ChatFAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Perguntas Frequentes</h2>
          <p className="text-white/80 text-lg">Tire suas dúvidas no formato de conversa</p>
        </div>

        <div className="mt-8 space-y-3 max-w-4xl mx-auto">
          {faqs.map((item, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 cursor-pointer hover:bg-white/15 transition-all duration-300" onClick={() => setOpen(open === idx ? null : idx)}>
              <div className="font-semibold text-white text-lg">{item.q}</div>
              {open === idx && <div className="mt-3 text-white/90">{item.a}</div>}
            </div>
          ))}
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mt-6 max-w-4xl mx-auto">
          <p className="text-white">Não encontrou sua dúvida? <a className="text-white/100 underline font-bold hover:text-white/80" href="/contact"> Fale conosco</a>!</p>
        </div>
      </div>
    </section>
  )
}
