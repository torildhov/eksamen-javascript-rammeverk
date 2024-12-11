export const validateUsername = (username: string) => {
    return username.length >= 4 && /^[a-zA-Z0-9_-]+$/.test(username)
  }
  
  export const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
    return passwordRegex.test(password)
  }  
  
  export const validateUserEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  
  export const validateUserName = (name: string) => {
    return name.length >= 2 && /^[a-zA-ZæøåÆØÅ\s-]+$/.test(name)
  }
  
  export const validateRole = (role: string) => {
    return ['admin', 'user'].includes(role)
  }
  
  export const validateUserForm = (formData: {
    username: string
    password: string
    email: string
    name: string
    role: string
  }) => {
    return {
      isValid: validateUsername(formData.username) &&
               validatePassword(formData.password) &&
               validateUserEmail(formData.email) &&
               validateUserName(formData.name) &&
               validateRole(formData.role),
      errors: {
        username: !validateUsername(formData.username) ? 
          'Username must be at least 4 characters and contain only letters, numbers, underscores or hyphens' : '',
        password: !validatePassword(formData.password) ? 
          'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character' : '',
        email: !validateUserEmail(formData.email) ? 
          'Please enter a valid email address (e.g., user@example.com)' : '',
        name: !validateUserName(formData.name) ? 
          'Name must be at least 2 characters and contain only letters, spaces, or hyphens' : '',
        role: !validateRole(formData.role) ? 
          'Role must be either "admin" or "user"' : ''
      }
    }
  }  