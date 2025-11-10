import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { apiService } from '../services/api'
import type { Consulta, Paciente, Medico, Especialidade, Localizacao } from '../types'

type ConnectionStatus = 'checking' | 'connected' | 'disconnected'

type Feedback =
  | { type: 'success'; message: string }
  | { type: 'error'; message: string }

const pad = (value: number) => String(value).padStart(2, '0')

const construirDataHoraSemTimezone = (ano = 1970, mes = 1, dia = 1, hora = 0, minuto = 0, segundo = 0) => {
  return `${ano}-${pad(mes)}-${pad(dia)}T${pad(hora)}:${pad(minuto)}:${pad(segundo)}`
}

const normalizarConsulta = (consulta: any): Consulta => {
  const { dataHora } = consulta
  let dataHoraNormalizada = dataHora as string

  if (Array.isArray(dataHora)) {
    const [ano, mes, dia, hora = 0, minuto = 0, segundo = 0] = dataHora
    dataHoraNormalizada = construirDataHoraSemTimezone(ano, mes || 1, dia || 1, hora, minuto, segundo)
  } else if (typeof dataHora === 'string' && dataHora.endsWith('Z')) {
    dataHoraNormalizada = dataHora.replace('Z', '')
  }

  return {
    ...consulta,
    dataHora: dataHoraNormalizada,
  }
}

export default function Consultas() {
  const [consultas, setConsultas] = useState<Consulta[]>([])
  const [loadingConsultas, setLoadingConsultas] = useState(true)
  const [auxLoading, setAuxLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [auxError, setAuxError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('checking')
  const [statusFilter, setStatusFilter] = useState<'all' | 'Agendada' | 'Cancelada' | 'Realizada'>('all')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null)
  const [pacientesMap, setPacientesMap] = useState<Record<number, Paciente>>({})
  const [medicosMap, setMedicosMap] = useState<Record<number, Medico>>({})
  const [especialidadesMap, setEspecialidadesMap] = useState<Record<number, Especialidade>>({})
  const [localizacoesMap, setLocalizacoesMap] = useState<Record<number, Localizacao>>({})

  const carregarConsultas = async (status: typeof statusFilter = 'all') => {
    setLoadingConsultas(true)
    setConnectionStatus('checking')
    setError(null)
    try {
      const response =
        status === 'all'
          ? await apiService.listarConsultas()
          : await apiService.listarConsultasPorStatus(status)

      if (response.data !== null) {
        const dadosNormalizados = Array.isArray(response.data)
          ? response.data.map((item) => normalizarConsulta(item))
          : []
        setConsultas(dadosNormalizados)
        setConnectionStatus('connected')
        if (response.message) {
          setError(null)
        }
      } else {
        console.error('[Consultas] Falha ao carregar consultas:', response.message)
        setConsultas([])
        setError('Sistema fora do ar. Tente novamente mais tarde.')
        setConnectionStatus('disconnected')
      }
    } catch (err: any) {
      console.error('[Consultas] Erro ao conectar com o servidor:', err)
      setConsultas([])
      setError('Sistema fora do ar. Tente novamente mais tarde.')
      setConnectionStatus('disconnected')
    } finally {
      setLoadingConsultas(false)
      setIsRefreshing(false)
    }
  }

  const carregarDadosAuxiliares = async () => {
    setAuxLoading(true)
    setAuxError(null)
    try {
      const mensagensErro: string[] = []

      const pacientesRes = await apiService.listarPacientes()

      if (pacientesRes.data) {
        const map = Object.fromEntries(
          pacientesRes.data
            .filter((item): item is Paciente & { idPaciente: number } => item.idPaciente !== undefined)
            .map((item) => [item.idPaciente!, item])
        ) as Record<number, Paciente>
        setPacientesMap(map)
      } else if (pacientesRes.message) {
        mensagensErro.push(pacientesRes.message)
      }

      const medicosRes = await apiService.listarMedicos()

      if (medicosRes.data) {
        const map = Object.fromEntries(
          medicosRes.data
            .filter((item): item is Medico & { idMedico: number } => item.idMedico !== undefined)
            .map((item) => [item.idMedico!, item])
        ) as Record<number, Medico>
        setMedicosMap(map)
      } else if (medicosRes.message) {
        mensagensErro.push(medicosRes.message)
      }

      const especialidadesRes = await apiService.listarEspecialidades()

      if (especialidadesRes.data) {
        const map = Object.fromEntries(
          especialidadesRes.data
            .filter((item): item is Especialidade & { idEspecialidade: number } => item.idEspecialidade !== undefined)
            .map((item) => [item.idEspecialidade!, item])
        ) as Record<number, Especialidade>
        setEspecialidadesMap(map)
      } else if (especialidadesRes.message) {
        mensagensErro.push(especialidadesRes.message)
      }

      const localizacoesRes = await apiService.listarLocalizacoes()

      if (localizacoesRes.data) {
        const map = Object.fromEntries(
          localizacoesRes.data
            .filter((item): item is Localizacao & { idLocalizacao: number } => item.idLocalizacao !== undefined)
            .map((item) => [item.idLocalizacao!, item])
        ) as Record<number, Localizacao>
        setLocalizacoesMap(map)
      } else if (localizacoesRes.message) {
        mensagensErro.push(localizacoesRes.message)
      }

      if (mensagensErro.length > 0) {
        console.warn('[Consultas] Problemas ao carregar dados auxiliares:', mensagensErro.join(' '))
        setAuxError('Sistema fora do ar. Tente novamente mais tarde.')
      }
    } catch (err: any) {
      console.error('[Consultas] Erro ao carregar dados auxiliares:', err)
      setAuxError('Sistema fora do ar. Tente novamente mais tarde.')
    } finally {
      setAuxLoading(false)
    }
  }

  useEffect(() => {
    carregarConsultas()
    carregarDadosAuxiliares()
  }, [])

  useEffect(() => {
    if (!feedback) return
    const timeout = setTimeout(() => setFeedback(null), 6000)
    return () => clearTimeout(timeout)
  }, [feedback])

  const formatarDataHora = (dataHora: string) => {
    const date = new Date(dataHora)
    if (Number.isNaN(date.getTime())) {
      return {
        data: dataHora.slice(0, 10),
        hora: dataHora.slice(11, 16),
      }
    }
    return {
      data: date.toLocaleDateString('pt-BR'),
      hora: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Agendada':
        return 'bg-blue-500/20 text-blue-200 border-blue-500/50'
      case 'Cancelada':
        return 'bg-red-500/20 text-red-200 border-red-500/50'
      case 'Realizada':
        return 'bg-green-500/20 text-green-200 border-green-500/50'
      default:
        return 'bg-gray-500/20 text-gray-200 border-gray-500/50'
    }
  }

  const consultasOrdenadas = useMemo(
    () =>
      [...consultas].sort((a, b) => {
        const dataA = new Date(a.dataHora).getTime()
        const dataB = new Date(b.dataHora).getTime()
        return dataB - dataA
      }),
    [consultas]
  )

  const refreshConsultas = async () => {
    setIsRefreshing(true)
    await carregarConsultas(statusFilter)
  }

  const handleFiltroStatus = (novoStatus: typeof statusFilter) => {
    setStatusFilter(novoStatus)
    carregarConsultas(novoStatus)
  }

  const handleCancelarConsulta = async (consulta: Consulta) => {
    if (!consulta.idConsulta) {
      setFeedback({ type: 'error', message: 'Não foi possível identificar a consulta selecionada.' })
      return
    }
    const motivo = window.prompt('Informe o motivo do cancelamento:')
    if (!motivo) {
      return
    }
    setActionLoadingId(consulta.idConsulta)
    try {
      const response = await apiService.cancelarConsulta(consulta.idConsulta, motivo)
      if (response.data !== null) {
        setConsultas((prev) =>
          prev.map((item) =>
            item.idConsulta === consulta.idConsulta
              ? { ...item, status: 'Cancelada', observacoes: motivo }
              : item
          )
        )
        setFeedback({ type: 'success', message: response.data || 'Consulta cancelada com sucesso.' })
      } else {
        setFeedback({
          type: 'error',
          message: response.message || 'Não foi possível cancelar a consulta. Tente novamente.',
        })
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'Erro ao cancelar consulta.',
      })
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleMarcarRealizada = async (consulta: Consulta) => {
    if (!consulta.idConsulta) {
      setFeedback({ type: 'error', message: 'Não foi possível identificar a consulta selecionada.' })
      return
    }

    const confirmacao = window.confirm('Deseja marcar esta consulta como realizada?')
    if (!confirmacao) return

    setActionLoadingId(consulta.idConsulta)
    try {
      const payload: Consulta = {
        ...consulta,
        status: 'Realizada',
        dataHora: consulta.dataHora.includes('T') ? consulta.dataHora : `${consulta.dataHora}T00:00:00`,
      }

      const response = await apiService.atualizarConsulta(consulta.idConsulta, payload)
      if (response.data) {
        setConsultas((prev) =>
          prev.map((item) =>
            item.idConsulta === consulta.idConsulta ? { ...item, status: 'Realizada' } : item
          )
        )
        setFeedback({ type: 'success', message: 'Consulta marcada como realizada.' })
      } else {
        setFeedback({
          type: 'error',
          message: response.message || 'Não foi possível atualizar o status da consulta.',
        })
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'Erro ao atualizar a consulta.',
      })
    } finally {
      setActionLoadingId(null)
    }
  }

  const obterPacienteNome = (id: number) => pacientesMap[id]?.nomeCompleto || `Paciente #${id}`
  const obterMedicoNome = (id: number) => medicosMap[id]?.nomeCompleto || `Médico #${id}`
  const obterEspecialidadeNome = (id: number) =>
    especialidadesMap[id]?.nomeEspecialidade || `Especialidade #${id}`
  const obterUnidadeNome = (id: number) => localizacoesMap[id]?.nomeUnidade || `Unidade #${id}`

  useEffect(() => {
    const carregarDetalhesFaltantes = async () => {
      const idsPacientes = Array.from(
        new Set(
          consultas
            .map((consulta) => consulta.idPaciente)
            .filter((id) => id !== undefined && !pacientesMap[id])
        )
      )

      if (idsPacientes.length > 0) {
        const resultados = await Promise.allSettled(idsPacientes.map((id) => apiService.buscarPaciente(id)))
        setPacientesMap((prev) => {
          const novo = { ...prev }
          resultados.forEach((resultado, index) => {
            if (resultado.status === 'fulfilled' && resultado.value.data?.idPaciente) {
              novo[resultado.value.data.idPaciente] = resultado.value.data
            }
          })
          return novo
        })
      }

      const idsMedicos = Array.from(
        new Set(
          consultas
            .map((consulta) => consulta.idMedico)
            .filter((id) => id !== undefined && !medicosMap[id])
        )
      )

      if (idsMedicos.length > 0) {
        const resultados = await Promise.allSettled(idsMedicos.map((id) => apiService.buscarMedico(id)))
        setMedicosMap((prev) => {
          const novo = { ...prev }
          resultados.forEach((resultado) => {
            if (resultado.status === 'fulfilled' && resultado.value.data?.idMedico) {
              novo[resultado.value.data.idMedico] = resultado.value.data
            }
          })
          return novo
        })
      }

      const idsEspecialidades = Array.from(
        new Set(
          consultas
            .map((consulta) => consulta.idEspecialidade)
            .filter((id) => id !== undefined && !especialidadesMap[id])
        )
      )

      if (idsEspecialidades.length > 0) {
        const resultados = await Promise.allSettled(
          idsEspecialidades.map((id) => apiService.buscarEspecialidade(id))
        )
        setEspecialidadesMap((prev) => {
          const novo = { ...prev }
          resultados.forEach((resultado) => {
            if (resultado.status === 'fulfilled' && resultado.value.data?.idEspecialidade) {
              novo[resultado.value.data.idEspecialidade] = resultado.value.data
            }
          })
          return novo
        })
      }

      const idsLocalizacoes = Array.from(
        new Set(
          consultas
            .map((consulta) => consulta.idLocalizacao)
            .filter((id) => id !== undefined && !localizacoesMap[id])
        )
      )

      if (idsLocalizacoes.length > 0) {
        const resultados = await Promise.allSettled(
          idsLocalizacoes.map((id) => apiService.buscarLocalizacao(id))
        )
        setLocalizacoesMap((prev) => {
          const novo = { ...prev }
          resultados.forEach((resultado) => {
            if (resultado.status === 'fulfilled' && resultado.value.data?.idLocalizacao) {
              novo[resultado.value.data.idLocalizacao] = resultado.value.data
            }
          })
          return novo
        })
      }
    }

    if (consultas.length > 0) {
      carregarDetalhesFaltantes()
    }
  }, [consultas])

  return (
    <section className="py-12 px-4 max-w-6xl mx-auto min-h-screen">
      <div className="text-right mb-6">
        <Link to="/" className="inline-block px-4 py-2 border border-white bg-transparent text-white rounded-lg hover:bg-white/10 transition-colors mr-9">
          Voltar
        </Link>
      </div>

      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-white mb-4">Consultas</h2>
        <p className="text-white/80 text-lg mb-4">Gerencie as consultas médicas integradas à API da Sprint 5.</p>

        <div className="flex flex-col md:flex-row gap-4 justify-center items-center text-white/80 text-sm">
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-blue-400" />
            <span>Agendadas</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-green-400" />
            <span>Realizadas</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-red-400" />
            <span>Canceladas</span>
          </div>
        </div>
      </div>

      {/* Ações rápidas */}
      <div className="grid gap-6 md:grid-cols-1 mb-10">
        <Link to="/contact" className="block bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-colors">
          <h3 className="text-2xl font-semibold text-white mb-2">Agendar Consulta</h3>
          <p className="text-white/70">Marque uma nova consulta rapidamente.</p>
        </Link>
      </div>

      {/* Lista de consultas */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-white mb-6">Todas as Consultas</h3>

        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="flex flex-1 gap-3 items-center">
            <label className="text-white/80 text-sm uppercase tracking-wide">Status</label>
            <select
              className="flex-1 max-w-[220px] px-3 py-2 border border-white/30 rounded-lg bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-secondary/40"
              value={statusFilter}
              onChange={(event) => handleFiltroStatus(event.target.value as typeof statusFilter)}
              disabled={loadingConsultas}
            >
              <option value="all" className="bg-gray-900">Todas</option>
              <option value="Agendada" className="bg-gray-900">Agendadas</option>
              <option value="Realizada" className="bg-gray-900">Realizadas</option>
              <option value="Cancelada" className="bg-gray-900">Canceladas</option>
            </select>
          </div>

          <button
            type="button"
            onClick={refreshConsultas}
            disabled={loadingConsultas || isRefreshing}
            className="self-start md:self-center px-4 py-2 text-sm font-medium rounded-lg bg-secondary text-white hover:bg-secondary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRefreshing ? 'Atualizando...' : 'Atualizar lista'}
          </button>
        </div>

        {feedback && (
          <div
            className={`mb-6 p-4 rounded-xl border ${
              feedback.type === 'success'
                ? 'bg-green-500/20 border-green-500/50 text-green-200'
                : 'bg-red-500/20 border-red-500/50 text-red-200'
            }`}
          >
            {feedback.message}
          </div>
        )}

        {auxError && (
          <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-xl text-yellow-200">
            {auxError}
          </div>
        )}

        {(loadingConsultas || auxLoading) && (
          <div className="text-center py-12">
            <p className="text-white/70">Carregando consultas...</p>
          </div>
        )}

        {error && !loadingConsultas && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200">
            {error}
          </div>
        )}

        {!loadingConsultas && !error && consultas.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/70 text-lg">Nenhuma consulta encontrada.</p>
            <Link
              to="/contact"
              className="mt-4 inline-block px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/80 transition-colors"
            >
              Agendar Primeira Consulta
            </Link>
          </div>
        )}

        {!loadingConsultas && !error && consultas.length > 0 && (
          <div className="space-y-4">
            {consultasOrdenadas.map((consulta) => {
              const { data, hora } = formatarDataHora(consulta.dataHora)
              return (
                <div
                  key={consulta.idConsulta}
                  className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(consulta.status)}`}>
                          {consulta.status}
                        </span>
                        {consulta.prioridade && (
                          <span className="text-white/60 text-sm">
                            Prioridade: {consulta.prioridade}
                          </span>
                        )}
                      </div>
                      <p className="text-white font-semibold text-lg mb-1">
                        Consulta #{consulta.idConsulta}
                      </p>
                      <p className="text-white/70 mb-2">
                        <span className="font-medium">Data:</span> {data} às {hora}
                      </p>
                      <div className="grid md:grid-cols-2 gap-2 text-white/70 text-sm">
                        <p>
                          <span className="font-medium text-white/80">Paciente:</span>{' '}
                          {obterPacienteNome(consulta.idPaciente)}
                        </p>
                        <p>
                          <span className="font-medium text-white/80">Médico:</span>{' '}
                          {obterMedicoNome(consulta.idMedico)}
                        </p>
                        <p>
                          <span className="font-medium text-white/80">Especialidade:</span>{' '}
                          {obterEspecialidadeNome(consulta.idEspecialidade)}
                        </p>
                        <p>
                          <span className="font-medium text-white/80">Unidade:</span>{' '}
                          {obterUnidadeNome(consulta.idLocalizacao)}
                        </p>
                        <p>
                          <span className="font-medium text-white/80">Duração:</span>{' '}
                          {consulta.duracaoMinutos} minutos
                        </p>
                        <p>
                          <span className="font-medium text-white/80">Prioridade:</span>{' '}
                          {consulta.prioridade || 'Não informada'}
                        </p>
                      </div>
                      {consulta.observacoes && (
                        <p className="text-white/60 text-sm mt-3 whitespace-pre-line">
                          {consulta.observacoes}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      {consulta.status === 'Agendada' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleMarcarRealizada(consulta)}
                            disabled={actionLoadingId === consulta.idConsulta}
                            className="px-4 py-2 rounded-lg bg-green-500/80 hover:bg-green-500 text-white text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {actionLoadingId === consulta.idConsulta ? 'Atualizando...' : 'Marcar como realizada'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCancelarConsulta(consulta)}
                            disabled={actionLoadingId === consulta.idConsulta}
                            className="px-4 py-2 rounded-lg bg-red-500/80 hover:bg-red-500 text-white text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {actionLoadingId === consulta.idConsulta ? 'Processando...' : 'Cancelar consulta'}
                          </button>
                          <Link
                            to="/reschedule"
                            className="px-4 py-2 rounded-lg bg-blue-500/70 hover:bg-blue-500 text-white text-sm font-medium text-center transition"
                          >
                            Remarcar consulta
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}


