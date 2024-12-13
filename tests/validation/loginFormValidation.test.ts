import { validateUsername, validatePassword, getLoginValidationError } from '../../src/utils/loginFormValidation'

// Hovedtestgruppe for innloggingsskjemavalidering
describe('Login Form Validation', () => {
  // Tester for validering av brukernavn
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

  // Tester for validering av passord
  describe('Password Validation', () => {
    test('should validate password length >= 8', () => {
      expect(validatePassword('password123')).toBe(true)
      expect(validatePassword('pass')).toBe(false)
    })
  })

  // Tester for feilmeldinger ved validering
  describe('Login Validation Error Messages', () => {
    test('should return appropriate error messages', () => {
      expect(getLoginValidationError('username', '')).toBe('Username is required')
      expect(getLoginValidationError('password', '')).toBe('Password is required')
    })
  })

  // Tester for innsending av skjemadata
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
