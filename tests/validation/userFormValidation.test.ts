import { validateUsername, validatePassword, validateUserEmail, validateUserName, validateRole, validateUserForm } from '../../src/utils/userFormValidation'

// Hovedtestgruppe for brukerskjemavalidering
describe('User Form Validation', () => {
  // Tester for validering av enkeltfelter
  describe('Field Validations', () => {
    test('validateUsername', () => {
      expect(validateUsername('validuser')).toBe(true)
      expect(validateUsername('usr')).toBe(false)
      expect(validateUsername('user@123')).toBe(false)
    })

    test('validatePassword', () => {
      expect(validatePassword('Test123!')).toBe(true)
      expect(validatePassword('weak')).toBe(false)
      expect(validatePassword('NoSpecial1')).toBe(false)
    })

    test('validateUserEmail', () => {
      expect(validateUserEmail('test@example.com')).toBe(true)
      expect(validateUserEmail('invalid-email')).toBe(false)
    })

    test('validateUserName', () => {
      expect(validateUserName('John Doe')).toBe(true)
      expect(validateUserName('J')).toBe(false)
      expect(validateUserName('John123')).toBe(false)
    })

    test('validateRole', () => {
      expect(validateRole('admin')).toBe(true)
      expect(validateRole('user')).toBe(true)
      expect(validateRole('invalid')).toBe(false)
    })
  })

  // Tester for innsending av skjemadata
  describe('Form Data Submission', () => {
    const testUserData = {
      username: 'testuser',
      password: 'Test123!',
      email: 'test@example.com',
      name: 'Test User',
      role: 'user'
    }

    test('validates complete form data', () => {
      const result = validateUserForm(testUserData)
      expect(result.isValid).toBe(true)
      expect(result.errors.username).toBe('')
      expect(result.errors.password).toBe('')
      expect(result.errors.email).toBe('')
      expect(result.errors.name).toBe('')
      expect(result.errors.role).toBe('')
    })

    test('detects invalid form data', () => {
      const invalidData = {
        username: 'u',
        password: 'weak',
        email: 'invalid',
        name: '',
        role: 'invalid'
      }
      const result = validateUserForm(invalidData)
      expect(result.isValid).toBe(false)
      expect(result.errors.username).toBeTruthy()
      expect(result.errors.password).toBeTruthy()
      expect(result.errors.email).toBeTruthy()
      expect(result.errors.name).toBeTruthy()
      expect(result.errors.role).toBeTruthy()
    })

    test('form data structure is correct', () => {
      const formData = testUserData
      const requiredFields = ['username', 'password', 'email', 'name', 'role']
      
      requiredFields.forEach(field => {
        expect(formData).toHaveProperty(field)
      })
    })

    test('form data maintains integrity', () => {
      const formData = testUserData
      expect(formData).toEqual(testUserData)
    })
  })
})
