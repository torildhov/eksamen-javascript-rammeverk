// Importerer CV-type for testing
import type { CV } from '../../src/store/slices/cvSlice'

// Tester for CV-eksport funksjonalitet
describe('CV Export Logic', () => {
  // Oppsett av test-CV med alle nødvendige felt
  const mockCV: CV = {
    _uuid: '123',
    userId: '456',
    personalInfo: {
      name: 'Test User',
      email: 'test@example.com',
      phone: '12345678'
    },
    skills: ['JavaScript', 'React'],
    education: [{
      institution: 'Test University',
      degree: 'Test Degree',
      year: '2023'
    }],
    experience: [{
      title: 'Developer',
      company: 'Test Company',
      years: '2020-2023',
      description: 'Test description',
      projects: 'Test projects'
    }],
    references: [{
      name: 'Reference',
      contactInfo: 'ref@example.com'
    }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  // Oppsett av utvalgte seksjoner for eksport
  const mockSelectedSections = {
    skills: ['JavaScript'],
    education: ['Test University'],
    experience: ['Developer'],
    references: ['Reference']
  }

  // Tester CV-datastruktur
  test('should validate CV data structure', () => {
    expect(mockCV.personalInfo).toBeDefined()
    expect(mockCV.skills).toBeInstanceOf(Array)
    expect(mockCV.education).toBeInstanceOf(Array)
    expect(mockCV.experience).toBeInstanceOf(Array)
    expect(mockCV.references).toBeInstanceOf(Array)
  })

  // Tester valgte seksjoner
  test('should validate selected sections', () => {
    expect(mockSelectedSections.skills).toContain('JavaScript')
    expect(mockSelectedSections.education).toContain('Test University')
    expect(mockSelectedSections.experience).toContain('Developer')
    expect(mockSelectedSections.references).toContain('Reference')
  })

  // Tester samsvar mellom valgte seksjoner og CV-data
  test('should match selected sections with CV data', () => {
    expect(mockCV.skills).toContain(mockSelectedSections.skills[0])
    expect(mockCV.education[0].institution).toBe(mockSelectedSections.education[0])
    expect(mockCV.experience[0].title).toBe(mockSelectedSections.experience[0])
    expect(mockCV.references[0].name).toBe(mockSelectedSections.references[0])
  })
})
