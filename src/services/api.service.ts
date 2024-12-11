import { API_KEY, BASE_URL } from '../config/api.config'

if (!API_KEY) {
  throw new Error('API key not found in environment variables')
}

export const API_URL = `${BASE_URL}`
