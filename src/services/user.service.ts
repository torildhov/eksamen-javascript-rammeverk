import { API_URL, API_KEY } from '../config/api.config'

interface User {
  _uuid?: string
  name: string
  email: string
  username: string
  password: string
  role: 'admin' | 'user'
}

export const userService = {
    async getAllUsers() {
        try {
          const response = await fetch(`${API_URL}/users`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${API_KEY}`
            }
          })
          
          console.log('Get Users Response Status:', response.status)
          
          if (response.status === 403) {
            console.log('Access forbidden: Insufficient permissions')
            return []
          }
          
          if (response.status === 200) {
            const data = await response.json()
            console.log('Users retrieved successfully:', data.items)
            return data.items || []
          }
          
          return []
        } catch (error) {
          console.log('Error fetching users:', error)
          return []
        }
      }
      
  ,

  async createUser(userData: Omit<User, '_uuid'>) {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify([userData]) // Wrap userData in array
    })
    const data = await response.json()
    console.log('Create user response:', data)
    return data.items?.[0] || data[0] // Return the first created user
  }
  
  
  
  
  ,

  async deleteUser(id: string) {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      }
    })
    return response.json()
  },

  async updateUser(id: string, userData: Partial<User>) {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(userData)
    })
    return response.json()
  },

  async initializeAdminUser() {
    const users = await this.getAllUsers()
    const adminExists = Array.isArray(users) && users.some(user => user.username === 'admin')
    
    if (!adminExists) {
      await this.createUser({
        username: 'admin',
        password: 'admin',
        name: 'Administrator',
        email: 'admin@example.com',
        role: 'admin'
      })
    }
  }
}
