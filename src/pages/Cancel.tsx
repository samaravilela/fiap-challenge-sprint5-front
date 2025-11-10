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
  motivo: string
  confirma: boolean
}

export default function Cancel() {
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

      // 3. Buscar consulta pela data e hora informadas
      const dataHoraConsulta = new Date(`${data.data}T${data.hora}:00`)
      const consulta = consultasRes.data.find(c => {
        const consultaDataHora = new Date(c.dataHora)
        return consultaDataHora.toDateString() === dataHoraConsulta.toDateString() &&
               consultaDataHora.getHours() === dataHoraConsulta.getHours() &&
               c.status === 'Agendada'
      })
      
      if (!consulta || !consulta.idConsulta) {
        throw new Error("Consulta não encontrada ou já cancelada/realizada.")
      }

      // 4. Cancelar consulta
      const cancelRes = await apiService.cancelarConsulta(consulta.idConsulta, data.motivo)

      if (cancelRes.status === 200 || cancelRes.status === 204 || cancelRes.data) {
        alert(`✅ Cancelamento confirmado para ${data.data} às ${data.hora}.`)
        reset()
        navigate("/consultas")
      } else {
        throw new Error(cancelRes.message || "Erro ao cancelar consulta")
      }
    } catch (err: any) {
      let errorMessage = err.message || "Erro ao cancelar consulta. Tente novamente."
      
      // Melhorar mensagens de erro comuns
      if (errorMessage.includes('conectar') || errorMessage.includes('Failed to fetch')) {
        errorMessage = "❌ Não foi possível conectar ao servidor. Verifique se o backend está rodando."
      } else if (errorMessage.includes('não encontrado') || errorMessage.includes('NOT_FOUND')) {
        errorMessage = "❌ Consulta não encontrada. Verifique os dados informados."
      } else if (errorMessage.includes('422')) {
        errorMessage = "❌ Não é possível cancelar esta consulta. " + (err.message || "Verifique o status da consulta.")
      }
      
      setError(errorMessage)
      console.error("Erro ao cancelar:", err)
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
        <h2 className="text-4xl font-bold text-white mb-4">Cancelar Consulta</h2>
        <p className="text-white/80 text-lg">
          Preencha o formulário para cancelar sua consulta.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-2xl mx-auto"
      >
        {/* Nome */}
        <FormField label="Nome Completo" error={errors.nome} required>
          <input
            type="text"
            {...register("nome", { required: "Digite seu nome completo" })}
            className="w-full p-4 border border-white/30 rounded-xl bg-white/10 text-white placeholder-white/60 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-all duration-300"
            placeholder="Digite seu nome completo"
          />
        </FormField>

        {/* CPF */}
        <FormField label="CPF" error={errors.cpf} required>
          <input
            type="text"
            {...register("cpf", {
              required: "Digite seu CPF",
              pattern: { value: /^\d{11}$/, message: "Digite apenas 11 números" }
            })}
            className="w-full p-4 border border-white/30 rounded-xl bg-white/10 text-white placeholder-white/60 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-all duration-300"
            placeholder="00000000000"
          />
        </FormField>

        {/* Data */}
        <FormField label="Data da Consulta" error={errors.data} required>
          <input
            type="date"
            {...register("data", { required: "Escolha uma data" })}
            className="w-full p-4 border border-white/30 rounded-xl bg-white/10 text-white placeholder-white/60 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-all duration-300"
          />
        </FormField>

        {/* Hora */}
        <FormField label="Horário" error={errors.hora} required>
          <select
            {...register("hora", { required: "Selecione um horário" })}
            className="w-full p-4 border border-white/30 rounded-xl bg-white/10 text-white focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-all duration-300"
          >
            <option value="" className="bg-gray-800">Selecione...</option>
            <option value="08:00" className="bg-gray-800">08:00</option>
            <option value="09:00" className="bg-gray-800">09:00</option>
            <option value="10:00" className="bg-gray-800">10:00</option>
            <option value="11:00" className="bg-gray-800">11:00</option>
            <option value="13:00" className="bg-gray-800">13:00</option>
            <option value="14:00" className="bg-gray-800">14:00</option>
            <option value="15:00" className="bg-gray-800">15:00</option>
            <option value="16:00" className="bg-gray-800">16:00</option>
          </select>
        </FormField>

        {/* Motivo */}
        <FormField label="Motivo do Cancelamento" error={errors.motivo} required>
          <textarea
            {...register("motivo", { required: "Descreva o motivo do cancelamento" })}
            className="w-full p-4 border border-white/30 rounded-xl bg-white/10 text-white placeholder-white/60 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-all duration-300 min-h-[120px] resize-vertical"
            rows={4}
            placeholder="Descreva o motivo do cancelamento..."
          />
        </FormField>

        {/* Confirmação */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              {...register("confirma", { required: "Confirme para cancelar" })}
              className="w-5 h-5 text-secondary bg-white/10 border-white/30 rounded focus:ring-secondary/30 focus:ring-2"
            />
            <label className="text-white font-medium">
              Confirmo que desejo cancelar esta consulta
            </label>
          </div>
          {errors.confirma && (
            <p className="text-red-400 text-sm mt-2">{errors.confirma.message}</p>
          )}
        </div>

        {/* Mensagem de erro */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200">
            {error}
          </div>
        )}

        {/* Botão */}
        <Button
          type="submit"
          variant="danger"
          size="lg"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Processando..." : "Confirmar Cancelamento"}
        </Button>
      </form>
    </section>
  )
}
