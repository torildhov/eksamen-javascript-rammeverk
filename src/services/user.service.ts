import { API_URL, API_KEY } from '../config/api.config'

interface User {
  _uuid?: string
  name: string
  email: string
  username: string
  password: string
  role: 'admin' | 'user'
}

type SanitizedUser = Omit<User, 'password'>;


const sanitizeUserForLog = (user: User): SanitizedUser => {
  const { name, email, username, role, _uuid } = user;
  return { name, email, username, role, _uuid };
};

export const userService = {
  async getAllUsers() {
    try {
      const response = await fetch(`${API_URL}/users`, {
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
        const sanitizedUsers = data.items?.map(sanitizeUserForLog) || []
        console.log('200 OK: Users retrieved successfully:', sanitizedUsers)
        return data.items || []
      }
      
      return []
    } catch (error) {
      console.log('Error fetching users:', error)
      return []
    }
  },

  async createUser(userData: Omit<User, '_uuid'>) {
    try {
      const users = await this.getAllUsers()
      const userExists = users.some((user: User) => 
        user.username === userData.username
      )
      
      if (userExists) {
        console.log('400 Bad Request: Username already exists')
        return null
      }
  
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify([userData])
      })
  
      if (response.status === 201) {
        const data = await response.json()
        const user = data.items?.[0]
        if (user) {
          console.log('201 Created: User created successfully:', 
            sanitizeUserForLog(user))
          return user
        }
      }
  
      return null
    } catch (error) {
      console.log('Error creating user:', error)
      return null
    }
  },

  async updateUser(id: string, userData: Partial<User>) {
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify(userData)
      })

      if (response.status === 404) {
        console.log('404 Not Found: User not found')
        return null
      }

      if (response.status === 403) {
        console.log('403 Forbidden: Insufficient permissions')
        return null
      }

      if (response.status === 200) {
        const data = await response.json()
        console.log('200 OK: User updated successfully:', sanitizeUserForLog(data))
        return data
      }

      return null
    } catch (error) {
      console.log('Error updating user:', error)
      return null
    }
  },

  async deleteUser(id: string) {
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        }
      })

      if (response.status === 404) {
        console.log('404 Not Found: User not found')
        return null
      }

      if (response.status === 403) {
        console.log('403 Forbidden: Insufficient permissions')
        return null
      }

      if (response.status === 200) {
        console.log('200 OK: User deleted successfully')
        return { message: 'User deleted' }
      }

      return null
    } catch (error) {
      console.log('Error deleting user:', error)
      return null
    }
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