/**
 * Configuração da API
 * Define a URL base do backend Java
 */
export const API_CONFIG = {
  // URL base da API Java
  // Ajuste conforme necessário (ex: http://localhost:8080/api)
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  
  // Timeout para requisições (em milissegundos)
  TIMEOUT: 30000,
  
  // Headers padrão
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
}

