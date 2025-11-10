import { useParams, Link } from 'react-router-dom'
import { team } from '../data/team'

export default function MemberDetail() {
  const { memberId } = useParams()
  const member = team.find(m => m.id === memberId)

  if (!member) {
    return (
      <section className="py-16 bg-gradient-primary min-h-screen">
        <div className="container mx-auto px-4">
          <p className="mb-4 text-white text-center">Membro não encontrado.</p>
          <Link to="/team" className="block w-fit mx-auto bg-gradient-primary text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300">Voltar para Equipe</Link>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gradient-primary min-h-screen">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
          <div className="flex flex-col sm:flex-row gap-6 items-center">
            <img src={member.fotoUrl} className="w-32 h-32 rounded-full object-cover border-4 border-white/20" />
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-semibold text-white">{member.nome}</h2>
              <p className="text-white/80">RM {member.rm} • {member.turma}</p>
              <div className="flex gap-3 mt-3 justify-center sm:justify-start">
                {member.linkedin && <a className="bg-gradient-secondary text-white px-4 py-2 rounded-full font-semibold hover:shadow-lg transition-all duration-300" href={member.linkedin} target="_blank">LinkedIn</a>}
                {member.github && <a className="bg-gradient-secondary text-white px-4 py-2 rounded-full font-semibold hover:shadow-lg transition-all duration-300" href={member.github} target="_blank">GitHub</a>}
              </div>
            </div>
          </div>
          <Link to="/team" className="block w-fit mx-auto mt-6 bg-gradient-primary text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300">Voltar</Link>
        </div>
      </div>
    </section>
  )
}
