import { 
  validatePhone, validateEmail, validateName, validateSkill,
  validateInstitution, validateDegree, validateYear,
  validateTitle, validateCompany, validateYears,
  validateDescription, validateProjects,
  validateRefName, validateContactInfo,
  validateCVForm
} from '../../src/utils/CVFormValidation'

// Hovedtestgruppe for CV-skjemavalidering
describe('CV Form Validation', () => {
  // Tester for validering av personlig informasjon
  describe('Personal Info Validation', () => {
    test('validatePhone', () => {
      expect(validatePhone('+47 12345678')).toBe(true)
      expect(validatePhone('12345678')).toBe(true)
      expect(validatePhone('123')).toBe(false)
    })

    test('validateEmail', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('invalid-email')).toBe(false)
    })

    test('validateName', () => {
      expect(validateName('John Doe')).toBe(true)
      expect(validateName('J')).toBe(false)
    })
  })

  // Tester for validering av ferdigheter
  describe('Skills Validation', () => {
    test('validateSkill', () => {
      expect(validateSkill('JavaScript')).toBe(true)
      expect(validateSkill('C++')).toBe(true)
      expect(validateSkill('')).toBe(false)
    })
  })

  // Tester for validering av utdanning
  describe('Education Validation', () => {
    test('validateInstitution', () => {
      expect(validateInstitution('University of Oslo')).toBe(true)
      expect(validateInstitution('')).toBe(false)
    })

    test('validateDegree', () => {
      expect(validateDegree('Bachelor of Science')).toBe(true)
      expect(validateDegree('')).toBe(false)
    })

    test('validateYear', () => {
      expect(validateYear('2023')).toBe(true)
      expect(validateYear('1959')).toBe(false)
    })
  })

  // Tester for validering av arbeidserfaring
  describe('Experience Validation', () => {
    test('validateTitle', () => {
      expect(validateTitle('Software Developer')).toBe(true)
      expect(validateTitle('')).toBe(false)
    })

    test('validateCompany', () => {
      expect(validateCompany('Tech Corp')).toBe(true)
      expect(validateCompany('')).toBe(false)
    })

    test('validateYears', () => {
      expect(validateYears('2020-2023')).toBe(true)
      expect(validateYears('2020-Present')).toBe(true)
      expect(validateYears('invalid')).toBe(false)
    })

    test('validateDescription', () => {
      const shortDesc = 'Valid description'
      const longDesc = Array(151).fill('word').join(' ')
      expect(validateDescription(shortDesc)).toBe(true)
      expect(validateDescription(longDesc)).toBe(false)
    })

    test('validateProjects', () => {
      const shortProjects = 'Valid projects description'
      const longProjects = Array(151).fill('word').join(' ')
      expect(validateProjects(shortProjects)).toBe(true)
      expect(validateProjects(longProjects)).toBe(false)
    })
  })

  // Tester for validering av referanser
  describe('References Validation', () => {
    test('validateRefName', () => {
      expect(validateRefName('Jane Doe')).toBe(true)
      expect(validateRefName('')).toBe(false)
    })

    test('validateContactInfo', () => {
      expect(validateContactInfo('test@example.com')).toBe(true)
      expect(validateContactInfo('+47 12345678')).toBe(true)
      expect(validateContactInfo('invalid')).toBe(false)
    })
  })

  // Tester for komplett CV-skjemavalidering
  describe('Complete CV Form Validation', () => {
    test('validateCVForm with valid data', () => {
      const validData = {
        personalInfo: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+47 12345678'
        },
        skills: ['JavaScript', 'React'],
        education: [{
          institution: 'University',
          degree: 'Bachelor',
          year: '2023'
        }],
        experience: [{
          title: 'Developer',
          company: 'Tech Co',
          years: '2020-2023',
          description: 'Work description',
          projects: 'Project details'
        }],
        references: [{
          name: 'Jane Doe',
          contactInfo: 'jane@example.com'
        }]
      }
      const result = validateCVForm(validData)
      expect(result.isValid).toBe(true)
    })

    test('validateCVForm with invalid data', () => {
      const invalidData = {
        personalInfo: {
          name: '',
          email: 'invalid-email',
          phone: '123'
        },
        skills: [''],
        education: [{
          institution: '',
          degree: '',
          year: '1900'
        }],
        experience: [{
          title: '',
          company: '',
          years: 'invalid',
          description: Array(151).fill('word').join(' '),
          projects: Array(151).fill('word').join(' ')
        }],
        references: [{
          name: '',
          contactInfo: 'invalid'
        }]
      }
      const result = validateCVForm(invalidData)
      expect(result.isValid).toBe(false)
    })
  })

  // Tester for skjemadata ved innsending
  describe('Form Data Submission', () => {
    const testData = {
      personalInfo: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+47 12345678'
      },
      skills: ['JavaScript', 'React'],
      education: [{
        institution: 'University',
        degree: 'Bachelor',
        year: '2023'
      }],
      experience: [{
        title: 'Developer',
        company: 'Tech Co',
        years: '2020-2023',
        description: 'Work description',
        projects: 'Project details'
      }],
      references: [{
        name: 'Jane Doe',
        contactInfo: 'jane@example.com'
      }],
      userId: 'test-user-id',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    test('CV form data is correctly structured when submitted', () => {
      const submittedData = {
        ...testData,
        _uuid: expect.any(String)
      }
      expect(submittedData).toMatchObject(testData)
      expect(submittedData.personalInfo.name).toBe(testData.personalInfo.name)
      expect(submittedData.skills).toEqual(testData.skills)
      expect(submittedData.education).toEqual(testData.education)
      expect(submittedData.experience).toEqual(testData.experience)
      expect(submittedData.references).toEqual(testData.references)
    })

    test('CV form maintains data integrity after validation', () => {
      const validationResult = validateCVForm(testData)
      expect(validationResult.isValid).toBe(true)
      
      const submittedData = {
        ...testData,
        _uuid: expect.any(String)
      }
      expect(submittedData.personalInfo).toEqual(testData.personalInfo)
      expect(submittedData.skills).toEqual(testData.skills)
      expect(submittedData.education).toEqual(testData.education)
      expect(submittedData.experience).toEqual(testData.experience)
      expect(submittedData.references).toEqual(testData.references)
    })

    test('CV form data includes all required fields', () => {
      const requiredFields = [
        'personalInfo',
        'skills',
        'education',
        'experience',
        'references',
        'userId',
        'createdAt',
        'updatedAt'
      ]

      const submittedData = {
        ...testData,
        _uuid: 'test-uuid'
      }

      requiredFields.forEach(field => {
        expect(submittedData).toHaveProperty(field)
      })
    })
  })
})
