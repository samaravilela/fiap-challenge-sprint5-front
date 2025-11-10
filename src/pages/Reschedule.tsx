import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import FormField from '../components/FormField'
import Button from '../components/Button'
import { apiService } from '../services/api'

type FormData = {
  nome: string
  cpf: string
  data: string
  hora: string
  motivo?: string
}

export default function Reschedule() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>()
  
  const onSubmit = async (data: FormData) => {
    setError(null)
    
    try {
      // 1. Buscar paciente por nome
      const pacientesRes = await apiService.buscarPacientesPorNome(data.nome)
      
      if (!pacientesRes.data || pacientesRes.data.length === 0) {
        throw new Error("Paciente não encontrado. Verifique o nome informado.")
      }

      const paciente = pacientesRes.data[0]
      if (!paciente.idPaciente) {
        throw new Error("Erro ao identificar paciente")
      }

      // 2. Buscar consultas do paciente
      const consultasRes = await apiService.listarConsultasPorPaciente(paciente.idPaciente)
      
      if (!consultasRes.data || consultasRes.data.length === 0) {
        throw new Error("Nenhuma consulta encontrada para este paciente.")
      }

      // 3. Buscar consulta mais próxima ou agendada
      const consulta = consultasRes.data.find(c => c.status === 'Agendada') || consultasRes.data[0]
      
      if (!consulta.idConsulta) {
        throw new Error("Erro ao identificar consulta")
      }

      // 4. Atualizar consulta com nova data/hora
      const novaDataHora = new Date(`${data.data}T${data.hora}:00`)
      // Formato ISO sem timezone para o backend Java
      const dataHoraISO = novaDataHora.toISOString().replace('Z', '')
      
      const consultaAtualizada = {
        ...consulta,
        dataHora: dataHoraISO,
        observacoes: data.motivo ? `${consulta.observacoes || ''}\nMotivo da remarcação: ${data.motivo}` : consulta.observacoes,
      }

      const updateRes = await apiService.atualizarConsulta(consulta.idConsulta, consultaAtualizada)

      if (updateRes.data) {
        alert(`✅ Remarcação realizada com sucesso para ${data.data} às ${data.hora}.`)
        reset()
        navigate("/consultas")
      } else {
        throw new Error(updateRes.message || "Erro ao remarcar consulta")
      }
    } catch (err: any) {
      let errorMessage = err.message || "Erro ao remarcar consulta. Tente novamente."
      
      // Melhorar mensagens de erro comuns
      if (errorMessage.includes('conectar') || errorMessage.includes('Failed to fetch')) {
        errorMessage = "❌ Não foi possível conectar ao servidor. Verifique se o backend está rodando."
      } else if (errorMessage.includes('não encontrado') || errorMessage.includes('NOT_FOUND')) {
        errorMessage = "❌ Consulta não encontrada. Verifique os dados informados."
      } else if (errorMessage.includes('400') || errorMessage.includes('BAD_REQUEST')) {
        errorMessage = "❌ Dados inválidos. Verifique a data e horário informados."
      }
      
      setError(errorMessage)
      console.error("Erro ao remarcar:", err)
    }
  }

  return (
    <section className="py-12 px-4 max-w-3xl mx-auto min-h-screen">
        <div className="text-right mb-6">
          <Link to="/consultas" className="inline-block px-4 py-2 border border-white bg-transparent text-white rounded-lg hover:bg-white/10 transition-colors mr-9">
            Voltar
          </Link>
        </div>
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-4">Remarcar Consulta</h2>
          <p className="text-white/80 text-lg">
            Preencha o formulário para reagendar.
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-2xl mx-auto">
          <FormField label="Nome Completo" error={errors.nome} required>
            <input 
              className="w-full p-4 border border-white/30 rounded-xl bg-white/10 text-white placeholder-white/60 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-all duration-300"
              placeholder="Digite seu nome completo"
              {...register('nome', { required: 'Informe seu nome' })}
            />
          </FormField>

          <FormField label="CPF" error={errors.cpf} required>
            <input 
              className="w-full p-4 border border-white/30 rounded-xl bg-white/10 text-white placeholder-white/60 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-all duration-300"
              placeholder="00000000000"
              {...register('cpf', { required: 'Informe o CPF' })}
            />
          </FormField>

          <FormField label="Nova data" error={errors.data} required>
            <input 
              type="date" 
              className="w-full p-4 border border-white/30 rounded-xl bg-white/10 text-white focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-all duration-300"
              {...register('data', { required: 'Informe a data' })}
            />
          </FormField>

          <FormField label="Novo horário" error={errors.hora} required>
            <select 
              className="w-full p-4 border border-white/30 rounded-xl bg-white/10 text-white focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-all duration-300"
              {...register('hora', { required: 'Selecione um horário' })}
            >
              <option value="" className="bg-gray-800">Selecione</option>
              {['08:00','09:00','10:00','11:00','13:00','14:00','15:00','16:00'].map(h => (
                <option key={h} value={h} className="bg-gray-800">{h}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Motivo (opcional)">
            <textarea 
              className="w-full p-4 border border-white/30 rounded-xl bg-white/10 text-white placeholder-white/60 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-all duration-300 min-h-[120px] resize-vertical"
              {...register('motivo')} 
              placeholder="Informe o motivo da remarcação (opcional)"
            />
          </FormField>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="success"
            size="lg"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Processando..." : "Solicitar Remarcação"}
          </Button>
        </form>
    </section>
  )
}
