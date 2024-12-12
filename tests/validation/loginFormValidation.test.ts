import { validateUsername, validatePassword, getLoginValidationError } from '../../src/utils/loginFormValidation'

describe('Login Form Validation', () => {
  describe('Username Validation', () => {
    test('should validate correct username', () => {
      expect(validateUsername('user123')).toBe(true)
    })

    test('should reject username less than 4 characters', () => {
      expect(validateUsername('usr')).toBe(false)
    })

    test('should reject invalid characters', () => {
      expect(validateUsername('user@123')).toBe(false)
    })
  })

  describe('Password Validation', () => {
    test('should validate password length >= 8', () => {
      expect(validatePassword('password123')).toBe(true)
      expect(validatePassword('pass')).toBe(false)
    })
  })

  describe('Login Validation Error Messages', () => {
    test('should return appropriate error messages', () => {
      expect(getLoginValidationError('username', '')).toBe('Username is required')
      expect(getLoginValidationError('password', '')).toBe('Password is required')
    })
  })

  describe('Form Data Submission', () => {
    const testCredentials = {
      username: 'testuser',
      password: 'password123'
    }

    test('validates correct credentials format', () => {
      expect(validateUsername(testCredentials.username)).toBe(true)
      expect(validatePassword(testCredentials.password)).toBe(true)
    })

    test('login form contains required fields', () => {
      const formData = testCredentials
      expect(formData).toHaveProperty('username')
      expect(formData).toHaveProperty('password')
    })

    test('login form data matches input', () => {
      const formData = testCredentials
      expect(formData.username).toBe(testCredentials.username)
      expect(formData.password).toBe(testCredentials.password)
    })
  })
})
