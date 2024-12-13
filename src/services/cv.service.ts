import { API_URL, API_KEY } from '../config/api.config'
import type { CV } from '../store/slices/cvSlice'

// Objekt som inneholder alle CV-relaterte API-tjenester
export const cvService = {
  // Henter alle CVer fra API-et
  async getAllCVs() {
    try {
      const response = await fetch(`${API_URL}/cvs`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        }
      })
      
      // Håndterer manglende tilgangsrettigheter
      if (response.status === 403) {
        console.log('403 Access forbidden: Insufficient permissions')
        return []
      }
      
      // Håndterer vellykket respons
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
  },

  // Oppretter ny CV
  async createCV(cvData: Omit<CV, '_uuid'>) {
    try {
      // Forbereder payload med bruker-referanser
      const payload = {
        ...cvData,
        _user: cvData.userId,
        _owner: cvData.userId 
      };

      const response = await fetch(`${API_URL}/cvs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify([payload])
      });

      // Håndterer vellykket opprettelse
      if (response.status === 201) {
        const data = await response.json();
        const createdCV = data.items?.[0];
        if (createdCV) {
          createdCV.userId = cvData.userId;
          console.log('201 Created: CV created successfully:', createdCV);
          return createdCV;
        }
      }
      return null;
    } catch (error) {
      console.log('Error creating CV:', error);
      return null;
    }
  },

  // Oppdaterer eksisterende CV
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

      // Håndterer ulike responskoder
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

  // Sletter CV
  async deleteCV(id: string) {
    try {
      const response = await fetch(`${API_URL}/cvs/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        }
      })

      // Håndterer ulike responskoder
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