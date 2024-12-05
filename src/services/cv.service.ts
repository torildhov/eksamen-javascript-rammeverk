import { API_URL, API_KEY } from '../config/api.config'
import type { CV } from '../store/slices/cvSlice'

export const cvService = {
  async getAllCVs() {
    try {
      const response = await fetch(`${API_URL}/cvs`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        }
      })
      
      console.log('Get CVs Response Status:', response.status)
      
      if (response.status === 403) {
        console.log('Access forbidden: Insufficient permissions')
        return []
      }
      
      if (response.status === 200) {
        const data = await response.json()
        console.log('CVs retrieved successfully:', data.items)
        return data.items || []
      }
      
      return []
    } catch (error) {
      console.log('Error fetching CVs:', error)
      return []
    }
  },

  async createCV(cvData: Omit<CV, '_uuid'>) {
    const response = await fetch(`${API_URL}/cvs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify([cvData])
    })
    const data = await response.json()
    return data.items?.[0] || data[0]
  },

  async deleteCV(id: string) {
    const response = await fetch(`${API_URL}/cvs/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      }
    })
    return response.json()
  },

  async updateCV(id: string, cvData: Partial<CV>) {
    const response = await fetch(`${API_URL}/cvs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(cvData)
    })
    return response.json()
  }
}
