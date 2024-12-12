import fetchMock from 'jest-fetch-mock'
import { API_URL } from '../../src/config/api.config'
import { userService } from '../../src/services/user.service'
import { cvService } from '../../src/services/cv.service'

beforeEach(() => {
  fetchMock.resetMocks()
})

describe('API Calls', () => {
  describe('Endpoint Testing', () => {
    test('should call correct user endpoint', async () => {
      await userService.getAllUsers()
      expect(fetchMock).toHaveBeenCalledWith(
        `${API_URL}/users`,
        expect.any(Object)
      )
    })

    test('should call correct CV endpoint', async () => {
      await cvService.getAllCVs()
      expect(fetchMock).toHaveBeenCalledWith(
        `${API_URL}/cvs`,
        expect.any(Object)
      )
    })
  })

  describe('Headers Testing', () => {
    test('should include correct headers', async () => {
      await userService.getAllUsers()
      expect(fetchMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
            'Authorization': expect.any(String)
          }
        })
      )
    })
  })

  describe('Response Handling', () => {
    test('should handle successful response', async () => {
      const mockData = { items: [{ id: 1, name: 'Test' }] }
      fetchMock.mockResponseOnce(JSON.stringify(mockData))
      
      const result = await userService.getAllUsers()
      expect(result).toEqual(mockData.items)
    })

    test('should handle error response', async () => {
      fetchMock.mockResponseOnce('', { status: 403 })
      
      const result = await userService.getAllUsers()
      expect(result).toEqual([])
    })
  })
})
