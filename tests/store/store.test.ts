import { store } from '../../src/store/store'
import { loginSuccess, logout } from '../../src/store/slices/authSlice'
import { createCV, deleteCV } from '../../src/store/slices/cvSlice'
import { createUser, deleteUser } from '../../src/store/slices/userSlice'
import fetchMock from 'jest-fetch-mock'

jest.mock('../../src/config/api.config', () => ({
  API_URL: 'https://crudapi.co.uk/api/v1',
  API_KEY: 'mpoFHffvbuyRgXjeK6FqT9f-dkp_BRdX5pdhJsMvT5CeUj_ibQ',
  BASE_URL: 'https://crudapi.co.uk/api/v1'
}))

beforeEach(() => {
  fetchMock.resetMocks()
  store.dispatch(logout())
})

describe('Redux Store Operations', () => {
  describe('Auth State', () => {
    test('should handle authentication state', () => {
      const mockUser = {
        _uuid: '123',
        username: 'testuser',
        name: 'Test User',
        role: 'user',
        email: 'test@example.com'
      }

      store.dispatch(loginSuccess(mockUser))
      let state = store.getState()
      expect(state.auth.isAuthenticated).toBe(true)
      expect(state.auth.user).toEqual(mockUser)
      
      store.dispatch(logout())
      state = store.getState()
      expect(state.auth.isAuthenticated).toBe(false)
      expect(state.auth.user).toBeNull()
    })
  })

  describe('CV State', () => {
    test('should handle CV state changes', async () => {
      const mockCV = {
        userId: '123',
        personalInfo: {
          name: 'Test User',
          email: 'test@example.com',
          phone: '12345678'
        },
        skills: ['JavaScript'],
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      fetchMock.mockResponseOnce(JSON.stringify({ 
        items: [{ ...mockCV, _uuid: '123' }] 
      }))

      const createAction = await store.dispatch(createCV(mockCV))
      expect(store.getState().cv.cvs.length).toBeGreaterThan(0)

      if (createAction.payload?._uuid) {
        fetchMock.mockResponseOnce(JSON.stringify({ success: true }))
        
        await store.dispatch(deleteCV(createAction.payload._uuid))
        expect(store.getState().cv.cvs).toHaveLength(0)
      }
    })
  })

  describe('User State', () => {
    test('should handle user state changes', async () => {
      const mockUser = {
        name: 'Test User',
        email: 'test@example.com',
        username: 'testuser',
        password: 'TestPass123!',
        role: 'user' as const
      }

      fetchMock.mockResponseOnce(JSON.stringify({ 
        items: [{ ...mockUser, _uuid: '123' }] 
      }))

      const createAction = await store.dispatch(createUser(mockUser))
      expect(store.getState().users.users.length).toBeGreaterThan(0)

      if (createAction.payload?._uuid) {
        fetchMock.mockResponseOnce(JSON.stringify({ success: true }))
        
        await store.dispatch(deleteUser(createAction.payload._uuid))
        expect(store.getState().users.users).toHaveLength(0)
      }
    })
  })
})
