export type Member = {
  id: string
  nome: string
  rm: string
  turma: string
  fotoUrl: string
  linkedin?: string
  github?: string
}

// Tipos correspondentes aos DTOs do Java
export type Paciente = {
  idPaciente?: number
  nomeCompleto: string
  dataNascimento: string // ISO date string
  genero: 'F' | 'M' | 'O'
  telefone: string
  tipoSanguineo?: string
  alergias?: string
}

export type Medico = {
  idMedico?: number
  nomeCompleto: string
  crm: string
  telefone: string
  email: string
}

export type Especialidade = {
  idEspecialidade?: number
  nomeEspecialidade: string
  areaMedica: string
  tempoMedioConsulta: number
}

export type Localizacao = {
  idLocalizacao?: number
  nomeUnidade: string
  endereco: string
  estado: string
  cidade: string
  pais: string
  horarioFuncionamento: string
  telefone: string
}

export type Consulta = {
  idConsulta?: number
  idPaciente: number
  idMedico: number
  idLocalizacao: number
  idEspecialidade: number
  dataHora: string // ISO datetime string
  duracaoMinutos: number
  status: 'Agendada' | 'Cancelada' | 'Realizada'
  observacoes?: string
  prioridade?: 'Alta' | 'Baixa' | 'Normal'
}

export type NovaConsultaPayload = Omit<Consulta, 'idConsulta' | 'idMedico' | 'idLocalizacao'>

export type ApiResponse<T> = {
  data: T | null
  status: number
  message?: string
}