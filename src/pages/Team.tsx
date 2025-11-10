import { Link } from 'react-router-dom'
import { team } from '../data/team'

export default function Team() {
  return (
    <section className="py-16 team-section">
      <div className="container">
        <div className="section-title">
          <h2>Nossa Equipe</h2>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
          {team.map(m => (
            <div key={m.id} className="card text-center team-card">
              <img src={m.fotoUrl} alt={m.nome} className="w-28 h-28 object-cover rounded-full mx-auto" />
              <h3 className="mt-3 font-semibold">{m.nome}</h3>
              <div className="text-sm text-gray-600 mb-2">RM {m.rm} • {m.turma}</div>
              
              
              <Link to={`/team/${m.id}`} className="btn btn-primary mt-6">Ver Perfil</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
