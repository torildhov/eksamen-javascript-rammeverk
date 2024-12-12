import { userService } from '../../src/services/user.service'
import fetchMock from 'jest-fetch-mock'

beforeEach(() => {
  fetchMock.resetMocks()
})

const mockUser = {
  name: 'Test User',
  email: 'test@example.com',
  username: 'testuser',
  password: 'TestPass123!',
  role: 'user' as const
}

describe('User CRUD Operations', () => {
  let createdUserId: string

  describe('Create User', () => {
    test('should create new user', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ items: [] }))
        
        const mockResponse = { ...mockUser, _uuid: '123' }
        fetchMock.mockResponseOnce(JSON.stringify({ 
          items: [mockResponse] 
        }), { 
          status: 201,
          headers: { 'Content-Type': 'application/json' }
        })
      
        const result = await userService.createUser(mockUser)
        expect(result).toBeTruthy()
        expect(result._uuid).toBeDefined()
        expect(result.name).toBe(mockUser.name)
        createdUserId = result._uuid
      })

    test('should fail with duplicate username', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ error: 'Username exists' }), { 
        status: 400 
      })
      
      const result = await userService.createUser(mockUser)
      expect(result).toBeNull()
    })
  })

  describe('Read Users', () => {
    test('should fetch all users', async () => {
      const mockUsers = [
        { ...mockUser, _uuid: '123' },
        { ...mockUser, _uuid: '456', username: 'testuser2' }
      ]
      fetchMock.mockResponseOnce(JSON.stringify({ items: mockUsers }))
      
      const result = await userService.getAllUsers()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe('Update User', () => {
    test('should update existing user', async () => {
      const updateData = {
        name: 'Updated Name'
      }
      const mockResponse = { 
        ...mockUser, 
        _uuid: createdUserId,
        name: 'Updated Name'
      }
      fetchMock.mockResponseOnce(JSON.stringify(mockResponse))

      const result = await userService.updateUser(createdUserId, updateData)
      expect(result).toBeTruthy()
      expect(result.name).toBe('Updated Name')
    })

    test('should fail with invalid ID', async () => {
      fetchMock.mockResponseOnce('', { status: 404 })
      
      const result = await userService.updateUser('invalid-id', { name: 'Test' })
      expect(result).toBeNull()
    })
  })

  describe('Delete User', () => {
    test('should delete existing user', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ success: true }))
      
      const result = await userService.deleteUser(createdUserId)
      expect(result).toBeTruthy()
    })

    test('should fail with invalid ID', async () => {
      fetchMock.mockResponseOnce('', { status: 404 })
      
      const result = await userService.deleteUser('invalid-id')
      expect(result).toBeNull()
    })
  })
})
