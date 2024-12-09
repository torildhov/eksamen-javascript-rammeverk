export const validateUsername = (username: string) => {
    return username.length >= 4 && /^[a-zA-Z0-9_-]+$/.test(username)
  }
  
  export const validatePassword = (password: string) => {
    return password.length >= 8
  }
  
  export const getLoginValidationError = (field: 'username' | 'password', value: string) => {
    switch (field) {
      case 'username':
        if (!value) return 'Username is required'
        return ''
      case 'password':
        if (!value) return 'Password is required'
        return ''
      default:
        return ''
    }
  }
  
  
  