// Importerer nødvendige testverktøy og tjenester
import fetchMock from 'jest-fetch-mock'
import { API_URL, API_KEY } from '../config/test.config'
import { userService } from '../../src/services/user.service'
import { cvService } from '../../src/services/cv.service'

// Mocker API-konfigurasjon for testing
jest.mock('../../src/config/api.config', () => ({
  API_URL: 'https://crudapi.co.uk/api/v1',
  API_KEY: 'mpoFHffvbuyRgXjeK6FqT9f-dkp_BRdX5pdhJsMvT5CeUj_ibQ',
  BASE_URL: 'https://crudapi.co.uk/api/v1'
}))

// Nullstiller mock før hver test
beforeEach(() => {
  fetchMock.resetMocks()
})

describe('API Calls', () => {
  // Tester for endepunkter
  describe('Endpoint Testing', () => {
    // Tester bruker-endepunkt
    test('should call correct user endpoint', async () => {
      await userService.getAllUsers()
      expect(fetchMock).toHaveBeenCalledWith(
        `${API_URL}/users`,
        expect.any(Object)
      )
    })

    // Tester CV-endepunkt
    test('should call correct CV endpoint', async () => {
      await cvService.getAllCVs()
      expect(fetchMock).toHaveBeenCalledWith(
        `${API_URL}/cvs`,
        expect.any(Object)
      )
    })
  })

  // Tester for HTTP-headers
  describe('Headers Testing', () => {
    test('should include correct headers', async () => {
      await userService.getAllUsers()
      expect(fetchMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
          }
        })
      )
    })
  })

  // Tester for responshåndtering
  describe('Response Handling', () => {
    // Tester vellykket respons
    test('should handle successful response', async () => {
      const mockData = { items: [{ id: 1, name: 'Test' }] }
      fetchMock.mockResponseOnce(JSON.stringify(mockData))
      
      const result = await userService.getAllUsers()
      expect(result).toEqual(mockData.items)
    })

    // Tester feilrespons
    test('should handle error response', async () => {
      fetchMock.mockResponseOnce('', { status: 403 })
      
      const result = await userService.getAllUsers()
      expect(result).toEqual([])
    })
  })
})
