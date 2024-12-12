import { cvService } from '../../src/services/cv.service'
import fetchMock from 'jest-fetch-mock'

jest.mock('../../src/config/api.config', () => ({
  API_URL: 'https://crudapi.co.uk/api/v1',
  API_KEY: 'mpoFHffvbuyRgXjeK6FqT9f-dkp_BRdX5pdhJsMvT5CeUj_ibQ',
  BASE_URL: 'https://crudapi.co.uk/api/v1'
}))

beforeEach(() => {
  fetchMock.resetMocks()
})

const mockCV = {
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
    name: 'Reference Person',
    contactInfo: 'ref@example.com'
  }],
  userId: 'test-user-id',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

describe('CV CRUD Operations', () => {
  let createdCVId: string

  describe('Create CV', () => {
    test('should create new CV', async () => {
      const mockResponse = { ...mockCV, _uuid: '123' }
      fetchMock.mockResponseOnce(JSON.stringify({ 
        items: [mockResponse] 
      }), { 
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      })
  
      const result = await cvService.createCV(mockCV)
      expect(result).toBeTruthy()
      expect(result._uuid).toBeDefined()
      expect(result.personalInfo).toEqual(mockCV.personalInfo)
      createdCVId = result._uuid
    })

    test('should fail with invalid data', async () => {
      const invalidCV = { ...mockCV, personalInfo: { name: '', email: '', phone: '' } }
      fetchMock.mockResponseOnce(JSON.stringify({ error: 'Invalid data' }), { status: 400 })
      
      const result = await cvService.createCV(invalidCV)
      expect(result).toBeNull()
    })
  })

  describe('Read CV', () => {
    test('should fetch all CVs', async () => {
      const mockCVs = [
        { ...mockCV, _uuid: '123' },
        { ...mockCV, _uuid: '456' }
      ]
      fetchMock.mockResponseOnce(JSON.stringify({ items: mockCVs }))
      
      const result = await cvService.getAllCVs()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe('Update CV', () => {
    test('should update existing CV', async () => {
      const updateData = {
        personalInfo: {
          ...mockCV.personalInfo,
          name: 'Updated Name'
        }
      }
      const mockResponse = { 
        ...mockCV, 
        _uuid: createdCVId,
        personalInfo: { ...mockCV.personalInfo, name: 'Updated Name' }
      }
      fetchMock.mockResponseOnce(JSON.stringify(mockResponse))

      const result = await cvService.updateCV(createdCVId, updateData)
      expect(result).toBeTruthy()
      expect(result.personalInfo.name).toBe('Updated Name')
    })

    test('should fail with invalid ID', async () => {
      fetchMock.mockResponseOnce('', { status: 404 })
      
      const result = await cvService.updateCV('invalid-id', mockCV)
      expect(result).toBeNull()
    })
  })

  describe('Delete CV', () => {
    test('should delete existing CV', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ success: true }), { status: 200 })
      
      const result = await cvService.deleteCV(createdCVId)
      expect(result).toBeTruthy()
    })

    test('should fail with invalid ID', async () => {
      fetchMock.mockResponseOnce('', { status: 404 })
      
      const result = await cvService.deleteCV('invalid-id')
      expect(result).toBeNull()
    })
  })
}) 