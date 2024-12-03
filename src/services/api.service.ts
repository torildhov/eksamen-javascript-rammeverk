export const API_KEY = import.meta.env.VITE_API_KEY
export const BASE_URL = 'https://crudapi.co.uk/api/v1'

if (!API_KEY) {
  throw new Error('API key not found in environment variables')
}

export const API_URL = `${BASE_URL}/${API_KEY}`
