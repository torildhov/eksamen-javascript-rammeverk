// Importerer API-konfigurasjon fra config-filen
import { API_KEY, BASE_URL } from '../config/api.config'

// Sjekker at API-nøkkel er tilgjengelig før applikasjonen starter
if (!API_KEY) {
  throw new Error('API key not found in environment variables')
}

// Eksporterer ferdig formatert API-URL for bruk i applikasjonen
export const API_URL = `${BASE_URL}`
