import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import FormField from "../components/FormField"
import Button from "../components/Button"
import { apiService } from "../services/api"
import type { Especialidade, NovaConsultaPayload, Medico, Localizacao } from "../types"

type FormValues = {
  name: string
  cpf: string
  phone: string
  specialty: string
  medico: string
  unidade: string
  date: string
  time: string
  message: string
}

export default function Contact() {
  const navigate = useNavigate()
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([])
  const [medicos, setMedicos] = useState<Medico[]>([])
  const [localizacoes, setLocalizacoes] = useState<Localizacao[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<FormValues>()

  // Carrega dados iniciais
  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [espRes, medRes, locRes] = await Promise.all([
          apiService.listarEspecialidades(),
          apiService.listarMedicos(),
          apiService.listarLocalizacoes(),
        ])
        if (espRes.data) setEspecialidades(espRes.data)
        if (medRes.data) setMedicos(medRes.data)
        if (locRes.data) setLocalizacoes(locRes.data)
      } catch (err) {
        console.error("Erro ao carregar dados:", err)
      } finally {
        setLoading(false)
      }
    }

    carregarDados()
  }, [])

  const onSubmit = async (data: FormValues) => {
    setError(null)
    
    try {
      // 1. Buscar ou criar paciente
      const pacientesRes = await apiService.buscarPacientesPorNome(data.name)
      let pacienteId: number

      if (pacientesRes.data && pacientesRes.data.length > 0) {
        // Paciente já existe
        pacienteId = pacientesRes.data[0].idPaciente!
      } else {
        // Criar novo paciente
        // Data de nascimento padrão: 30 anos atrás (para passar na validação)
        const dataNascimento = new Date()
        dataNascimento.setFullYear(dataNascimento.getFullYear() - 30)
        const dataNascimentoStr = dataNascimento.toISOString().split('T')[0]
        
        const novoPaciente = {
          nomeCompleto: data.name,
          dataNascimento: dataNascimentoStr,
          genero: 'O' as const,
          telefone: data.phone,
        }
        const pacienteCriado = await apiService.criarPaciente(novoPaciente)
        if (!pacienteCriado.data || !pacienteCriado.data.idPaciente) {
          // Mostra a mensagem de erro real da API
          const errorMessage = pacienteCriado.message || "Erro ao criar paciente"
          throw new Error(errorMessage)
        }
        pacienteId = pacienteCriado.data.idPaciente
      }

      // 2. Buscar ou criar especialidade
      let especialidadeId: number
      const especialidadeSelecionada = especialidades.find(
        (esp) => esp.idEspecialidade === Number(data.specialty)
      )

      if (!especialidadeSelecionada?.idEspecialidade) {
        throw new Error("Selecione uma especialidade válida.")
      }

      especialidadeId = especialidadeSelecionada.idEspecialidade

      // 3. Criar consulta
      // Formato de data/hora para o backend Java (LocalDateTime)
      const dataHora = new Date(`${data.date}T${data.time}:00`)
      // Garantir que está no formato ISO correto (sem timezone offset)
      const dataHoraISO = dataHora.toISOString().replace('Z', '')
      
      const consulta: NovaConsultaPayload = {
        idPaciente: pacienteId,
        idEspecialidade: especialidadeId,
        dataHora: dataHoraISO,
        duracaoMinutos: 30,
        status: 'Agendada' as const,
        observacoes: data.message,
        prioridade: 'Normal' as const,
      }

      const consultaRes = await apiService.criarConsulta(consulta)

      if (consultaRes.data) {
        alert("✅ Consulta agendada com sucesso!")
        reset()
        navigate("/consultas")
      } else {
        const errorMsg = consultaRes.message || "Erro ao agendar consulta"
        throw new Error(errorMsg)
      }
    } catch (err: any) {
      // Mostra mensagem de erro mais detalhada
      let errorMessage = err.message || "Erro ao agendar consulta. Tente novamente."
      
      // Melhorar mensagens de erro comuns
      if (errorMessage.includes('conectar') || errorMessage.includes('Failed to fetch')) {
        errorMessage = "❌ Não foi possível conectar ao servidor. Verifique se o backend está rodando."
      } else if (errorMessage.includes('400') || errorMessage.includes('BAD_REQUEST')) {
        errorMessage = "❌ Dados inválidos. Verifique os campos preenchidos."
      } else if (errorMessage.includes('422')) {
        errorMessage = "❌ Regra de negócio violada. " + (err.message || "Verifique os dados informados.")
      }
      
      setError(errorMessage)
      console.error("Erro ao agendar:", err)
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
        <h2 className="text-4xl font-bold text-white mb-4">Agende sua Consulta</h2>
        <p className="text-white/80 text-lg">
          Preencha o formulário abaixo e receba a confirmação rapidamente.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-2xl mx-auto"
      >
        {/* Nome */}
        <FormField label="Nome Completo" error={errors.name} required>
          <input
            type="text"
            {...register("name", { required: "Digite seu nome completo" })}
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

        {/* Telefone */}
        <FormField label="Telefone" error={errors.phone} required>
          <input
            type="tel"
            {...register("phone", { required: "Digite seu telefone" })}
            className="w-full p-4 border border-white/30 rounded-xl bg-white/10 text-white placeholder-white/60 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-all duration-300"
            placeholder="(11) 90000-0000"
          />
        </FormField>

        {/* Especialidade */}
        <FormField label="Especialidade Médica" error={errors.specialty} required>
          <select
            {...register("specialty", { required: "Selecione a especialidade" })}
            className="w-full p-4 border border-white/30 rounded-xl bg-white/10 text-white focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-all duration-300"
            disabled={especialidades.length === 0}
          >
            <option value="" className="bg-gray-800">
              {especialidades.length === 0 ? "Carregando especialidades..." : "Selecione..."}
            </option>
            {especialidades.map((esp) => (
              <option key={esp.idEspecialidade} value={esp.idEspecialidade} className="bg-gray-800">
                {esp.nomeEspecialidade}
              </option>
            ))}
          </select>
        </FormField>

        {/* Médico */}
        <FormField label="Médico" required>
          <select
            {...register("medico")}
            className="w-full p-4 border border-white/30 rounded-xl bg-white/10 text-white focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-all duration-300"
            disabled={medicos.length === 0}
          >
            <option value="" className="bg-gray-800">
              {medicos.length === 0 ? "Carregando médicos..." : "Selecione..."}
            </option>
            {medicos.map((medico) => (
              <option key={medico.idMedico} value={medico.idMedico} className="bg-gray-800">
                {medico.nomeCompleto}
              </option>
            ))}
          </select>
        </FormField>

        {/* Unidade */}
        <FormField label="Unidade" required>
          <select
            {...register("unidade")}
            className="w-full p-4 border border-white/30 rounded-xl bg-white/10 text-white focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-all duration-300"
            disabled={localizacoes.length === 0}
          >
            <option value="" className="bg-gray-800">
              {localizacoes.length === 0 ? "Carregando unidades..." : "Selecione..."}
            </option>
            {localizacoes.map((loc) => (
              <option key={loc.idLocalizacao} value={loc.idLocalizacao} className="bg-gray-800">
                {loc.nomeUnidade}
              </option>
            ))}
          </select>
        </FormField>

        {/* Data */}
        <FormField label="Data" error={errors.date} required>
          <input
            type="date"
            {...register("date", { required: "Escolha uma data" })}
            className="w-full p-4 border border-white/30 rounded-xl bg-white/10 text-white placeholder-white/60 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-all duration-300"
          />
        </FormField>

        {/* Hora */}
        <FormField label="Hora" error={errors.time} required>
          <select
            {...register("time", { required: "Selecione um horário" })}
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

        {/* Mensagem */}
        <FormField label="Mensagem" error={errors.message} required>
          <textarea
            {...register("message", { required: "Digite sua mensagem" })}
            className="w-full p-4 border border-white/30 rounded-xl bg-white/10 text-white placeholder-white/60 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-all duration-300 min-h-[120px] resize-vertical"
            rows={4}
            placeholder="Descreva seu problema ou dúvida"
          />
        </FormField>

        {/* Mensagem de erro */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 whitespace-pre-line">
            <p className="font-semibold mb-2">❌ Erro ao processar solicitação:</p>
            <p className="text-sm">{error}</p>
            {error.includes('conectar ao servidor') && (
              <div className="mt-3 p-3 bg-red-600/30 rounded-lg text-xs">
                <p className="font-semibold mb-1">💡 Dicas para resolver:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Verifique se o backend Java está rodando</li>
                  <li>Confirme a URL da API no arquivo .env</li>
                  <li>Verifique o console do navegador (F12) para mais detalhes</li>
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Botão */}
        <Button
          type="submit"
          variant="success"
          size="lg"
          disabled={isSubmitting || loading}
          className="w-full"
        >
          {isSubmitting ? "Enviando..." : "Agendar Consulta"}
        </Button>
      </form>
    </section>
  )
}
