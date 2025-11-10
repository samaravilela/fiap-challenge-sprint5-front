import { API_CONFIG } from '../config/api'
import type { Consulta, Paciente, Medico, Especialidade, Localizacao, ApiResponse, NovaConsultaPayload } from '../types'

/**
 * Classe para fazer requisições HTTP para a API Java
 */
class ApiService {
  private baseUrl: string

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL
  }

  /**
   * Método genérico para fazer requisições HTTP
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // Garante que não há barras duplicadas na URL
    const baseUrl = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
    const url = `${baseUrl}${cleanEndpoint}`
    
    // Log para debug (apenas em desenvolvimento)
    if (import.meta.env.DEV) {
      console.log(`[API] ${options.method || 'GET'} ${url}`)
      if (options.body) {
        try {
          console.log(`[API] Body:`, JSON.parse(options.body as string))
        } catch {
          console.log(`[API] Body (raw):`, options.body)
        }
      }
    }
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...API_CONFIG.DEFAULT_HEADERS,
        ...options.headers,
      },
    }

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT)

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      // Log resposta (apenas em desenvolvimento)
      if (import.meta.env.DEV) {
        console.log(`[API] Response Status: ${response.status} ${response.statusText}`)
      }

      let data: T | null = null
      let rawData: any = null
      const contentType = response.headers.get('content-type') || ''
      const responseText = await response.text()

      if (responseText) {
        if (contentType.includes('application/json')) {
          try {
            rawData = JSON.parse(responseText)
          } catch (parseError) {
            if (import.meta.env.DEV) {
              console.warn('[API] Falha ao fazer parse do JSON. Retornando texto bruto.', parseError)
            }
            rawData = responseText
          }
        } else {
          rawData = responseText
        }
      }

      if (rawData && typeof rawData === 'object' && 'body' in rawData) {
        data = rawData.body as T
      } else if (rawData !== null && rawData !== undefined && rawData !== '') {
        data = rawData as T
      }

      if (!response.ok) {
        // Tenta extrair mensagem de erro de diferentes formatos
        let errorMessage = `Erro ${response.status}: ${response.statusText}`
        
        // Usa rawData para ter acesso à estrutura completa do ResponseEntity
        const errorData = rawData || data
        
        if (errorData) {
          if (typeof errorData === 'string') {
            errorMessage = errorData
          } else if (typeof errorData === 'object') {
            // O backend Java retorna ResponseEntity com estrutura: { body, statusCode, message }
            if ('message' in errorData && errorData.message) {
              errorMessage = errorData.message
            } else if ('error' in errorData) {
              errorMessage = errorData.error
            } else if ('mensagem' in errorData) {
              errorMessage = errorData.mensagem
            } else if (Array.isArray(errorData) && errorData.length > 0) {
              errorMessage = String(errorData[0])
            } else {
              // Se não encontrar mensagem específica, tenta converter o objeto
              const dataStr = JSON.stringify(errorData)
              // Se o objeto tem estrutura ResponseEntity mas message está vazio, usa o statusText
              if (dataStr.includes('statusCode') && !dataStr.includes('message')) {
                errorMessage = `Erro ${response.status}: ${response.statusText}`
              } else {
                errorMessage = dataStr.length < 200 ? dataStr : `Erro ${response.status}: ${response.statusText}`
              }
            }
          }
        }
        
        return {
          data: null,
          status: response.status,
          message: errorMessage,
        }
      }

      return {
        data,
        status: response.status,
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return {
          data: null,
          status: 408,
          message: 'Timeout: A requisição demorou muito para responder',
        }
      }

      // Tratamento específico para "Failed to fetch" e erros de rede
      if (error.message === 'Failed to fetch' || error.name === 'TypeError' || error.message?.includes('fetch') || error.message?.includes('ERR_CONNECTION_REFUSED')) {
        return {
          data: null,
          status: 0,
          message: `❌ ERRO DE CONEXÃO: Não foi possível conectar ao backend.

🔧 SOLUÇÕES:
1. Verifique se o backend Java está rodando na porta 8080
2. Confirme que a URL está correta: ${url}
3. Verifique se não há firewall bloqueando a conexão
4. Teste acessando diretamente no navegador: ${url}

💡 Dica: Execute o backend Java antes de usar o frontend.`,
        }
      }

      return {
        data: null,
        status: 500,
        message: error.message || 'Erro ao conectar com o servidor',
      }
    }
  }

  // ========== CONSULTAS ==========

  /**
   * Lista todas as consultas
   */
  async listarConsultas(): Promise<ApiResponse<Consulta[]>> {
    return this.request<Consulta[]>('/consultas', {
      method: 'GET',
    })
  }

  /**
   * Busca consulta por ID
   */
  async buscarConsulta(id: number): Promise<ApiResponse<Consulta>> {
    return this.request<Consulta>(`/consultas/${id}`, {
      method: 'GET',
    })
  }

  /**
   * Cria nova consulta
   */
  async criarConsulta(consulta: NovaConsultaPayload): Promise<ApiResponse<Consulta>> {
    return this.request<Consulta>('/consultas', {
      method: 'POST',
      body: JSON.stringify(consulta),
    })
  }

  /**
   * Atualiza consulta
   */
  async atualizarConsulta(id: number, consulta: Consulta): Promise<ApiResponse<Consulta>> {
    return this.request<Consulta>(`/consultas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(consulta),
    })
  }

  /**
   * Deleta consulta
   */
  async deletarConsulta(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/consultas/${id}`, {
      method: 'DELETE',
    })
  }

  /**
   * Lista consultas por paciente
   */
  async listarConsultasPorPaciente(idPaciente: number): Promise<ApiResponse<Consulta[]>> {
    return this.request<Consulta[]>(`/consultas/paciente/${idPaciente}`, {
      method: 'GET',
    })
  }

  /**
   * Lista consultas por médico
   */
  async listarConsultasPorMedico(idMedico: number): Promise<ApiResponse<Consulta[]>> {
    return this.request<Consulta[]>(`/consultas/medico/${idMedico}`, {
      method: 'GET',
    })
  }

  /**
   * Lista consultas por status
   */
  async listarConsultasPorStatus(status: string): Promise<ApiResponse<Consulta[]>> {
    const statusEncoded = encodeURIComponent(status)
    return this.request<Consulta[]>(`/consultas/status/${statusEncoded}`, {
      method: 'GET',
    })
  }

  /**
   * Cancela consulta
   * O backend espera o motivo como texto/plain no body, não como query parameter
   */
  async cancelarConsulta(id: number, motivo: string): Promise<ApiResponse<string>> {
    const url = `${this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl}/consultas/${id}/cancelar`
    
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'text/plain',
          'Accept': 'application/json',
        },
        body: motivo,
      })

      if (import.meta.env.DEV) {
        console.log(`[API] PUT ${url}`)
        console.log(`[API] Response Status: ${response.status} ${response.statusText}`)
      }

      const contentType = response.headers.get('content-type') || ''
      const responseText = await response.text()
      let data: string | null = null

      if (response.ok) {
        if (contentType.includes('application/json')) {
          try {
            const jsonData = JSON.parse(responseText)
            data = typeof jsonData === 'string' ? jsonData : JSON.stringify(jsonData)
          } catch {
            data = responseText || 'Consulta cancelada com sucesso'
          }
        } else {
          data = responseText || 'Consulta cancelada com sucesso'
        }

        return {
          data,
          status: response.status,
        }
      }

      let errorMessage = `Erro ${response.status}: ${response.statusText}`
      if (responseText) {
        errorMessage = responseText
      }

      return {
        data: null,
        status: response.status,
        message: errorMessage,
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return {
          data: null,
          status: 408,
          message: 'Timeout: A requisição demorou muito para responder',
        }
      }

      if (error.message === 'Failed to fetch' || error.name === 'TypeError' || error.message?.includes('fetch') || error.message?.includes('ERR_CONNECTION_REFUSED')) {
        return {
          data: null,
          status: 0,
          message: `❌ ERRO DE CONEXÃO: Não foi possível conectar ao backend.

🔧 SOLUÇÕES:
1. Verifique se o backend Java está rodando na porta 8080
2. Confirme que a URL está correta: ${url}
3. Verifique se não há firewall bloqueando a conexão
4. Teste acessando diretamente no navegador: ${url}

💡 Dica: Execute o backend Java antes de usar o frontend.`,
        }
      }

      return {
        data: null,
        status: 500,
        message: error.message || 'Erro ao cancelar consulta',
      }
    }
  }

  // ========== PACIENTES ==========

  /**
   * Lista todos os pacientes
   */
  async listarPacientes(): Promise<ApiResponse<Paciente[]>> {
    return this.request<Paciente[]>('/pacientes', {
      method: 'GET',
    })
  }

  /**
   * Busca paciente por ID
   */
  async buscarPaciente(id: number): Promise<ApiResponse<Paciente>> {
    return this.request<Paciente>(`/pacientes/${id}`, {
      method: 'GET',
    })
  }

  /**
   * Cria novo paciente
   */
  async criarPaciente(paciente: Paciente): Promise<ApiResponse<Paciente>> {
    return this.request<Paciente>('/pacientes', {
      method: 'POST',
      body: JSON.stringify(paciente),
    })
  }

  /**
   * Atualiza paciente
   */
  async atualizarPaciente(id: number, paciente: Paciente): Promise<ApiResponse<Paciente>> {
    return this.request<Paciente>(`/pacientes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(paciente),
    })
  }

  /**
   * Busca pacientes por nome
   */
  async buscarPacientesPorNome(nome: string): Promise<ApiResponse<Paciente[]>> {
    return this.request<Paciente[]>(`/pacientes/buscar?nome=${encodeURIComponent(nome)}`, {
      method: 'GET',
    })
  }

  // ========== MÉDICOS ==========

  /**
   * Lista todos os médicos
   */
  async listarMedicos(): Promise<ApiResponse<Medico[]>> {
    return this.request<Medico[]>('/medicos', {
      method: 'GET',
    })
  }

  /**
   * Busca médico por ID
   */
  async buscarMedico(id: number): Promise<ApiResponse<Medico>> {
    return this.request<Medico>(`/medicos/${id}`, {
      method: 'GET',
    })
  }

  /**
   * Busca médico por CRM
   */
  async buscarMedicoPorCrm(crm: string): Promise<ApiResponse<Medico>> {
    return this.request<Medico>(`/medicos/crm/${crm}`, {
      method: 'GET',
    })
  }

  /**
   * Lista médicos por especialidade
   */
  async listarMedicosPorEspecialidade(idEspecialidade: number): Promise<ApiResponse<Medico[]>> {
    return this.request<Medico[]>(`/medicos/especialidade/${idEspecialidade}`, {
      method: 'GET',
    })
  }

  // ========== ESPECIALIDADES ==========

  /**
   * Lista todas as especialidades
   */
  async listarEspecialidades(): Promise<ApiResponse<Especialidade[]>> {
    return this.request<Especialidade[]>('/especialidades', {
      method: 'GET',
    })
  }

  /**
   * Busca especialidade por ID
   */
  async buscarEspecialidade(id: number): Promise<ApiResponse<Especialidade>> {
    return this.request<Especialidade>(`/especialidades/${id}`, {
      method: 'GET',
    })
  }

  /**
   * Cria nova especialidade
   */
  async criarEspecialidade(especialidade: Especialidade): Promise<ApiResponse<Especialidade>> {
    return this.request<Especialidade>('/especialidades', {
      method: 'POST',
      body: JSON.stringify(especialidade),
    })
  }

  /**
   * Atualiza especialidade
   */
  async atualizarEspecialidade(id: number, especialidade: Especialidade): Promise<ApiResponse<Especialidade>> {
    return this.request<Especialidade>(`/especialidades/${id}`, {
      method: 'PUT',
      body: JSON.stringify(especialidade),
    })
  }

  // ========== LOCALIZAÇÕES ==========

  /**
   * Lista todas as localizações
   */
  async listarLocalizacoes(): Promise<ApiResponse<Localizacao[]>> {
    return this.request<Localizacao[]>('/localizacoes', {
      method: 'GET',
    })
  }

  /**
   * Busca localização por ID
   */
  async buscarLocalizacao(id: number): Promise<ApiResponse<Localizacao>> {
    return this.request<Localizacao>(`/localizacoes/${id}`, {
      method: 'GET',
    })
  }
}

// Exporta uma instância singleton
export const apiService = new ApiService()

