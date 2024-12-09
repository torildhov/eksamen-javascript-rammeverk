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
      
      if (response.status === 403) {
        console.log('403 Access forbidden: Insufficient permissions')
        return []
      }
      
      if (response.status === 200) {
        const data = await response.json()
        console.log('200 OK: CVs retrieved successfully:', data.items)
        return data.items || []
      }
      
      return []
    } catch (error) {
      console.log('Error fetching CVs:', error)
      return []
    }
  }
,

async createCV(cvData: Omit<CV, '_uuid'>) {
  try {
    const response = await fetch(`${API_URL}/cvs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify([cvData])
    })

    if (response.status === 400) {
      console.log('400 Bad Request: Invalid CV data')
      return null
    }

    if (response.status === 201) {
      const data = await response.json()
      console.log('201 Created: CV created successfully:', data.items?.[0])
      return data.items?.[0] || data[0]
    }

    return null
  } catch (error) {
    console.log('Error creating CV:', error)
    return null
  }
},

async updateCV(id: string, cvData: Partial<CV>) {
  try {
    const response = await fetch(`${API_URL}/cvs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(cvData)
    })

    if (response.status === 404) {
      console.log('404 Not Found: CV not found')
      return null
    }

    if (response.status === 403) {
      console.log('403 Forbidden: Insufficient permissions')
      return null
    }

    if (response.status === 200) {
      const data = await response.json()
      console.log('200 OK: CV updated successfully:', data)
      return data
    }

    return null
  } catch (error) {
    console.log('Error updating CV:', error)
    return null
  }
},

async deleteCV(id: string) {
  try {
    const response = await fetch(`${API_URL}/cvs/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      }
    })

    if (response.status === 404) {
      console.log('404 Not Found: CV not found')
      return null
    }

    if (response.status === 403) {
      console.log('403 Forbidden: Insufficient permissions')
      return null
    }

    if (response.status === 200) {
      console.log('200 OK: CV deleted successfully')
      return { message: 'CV deleted' }
    }

    return null
  } catch (error) {
    console.log('Error deleting CV:', error)
    return null
  }
}
}
