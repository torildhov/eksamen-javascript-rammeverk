import { userService } from '../../src/services/user.service'
import { store } from '../../src/store/store'
import { loginStart, loginSuccess, loginFail } from '../../src/store/slices/authSlice'
import type { User } from '../../src/store/slices/userSlice'
import fetchMock from 'jest-fetch-mock'

// Mocker API-konfigurasjon for testing
jest.mock('../../src/config/api.config', () => ({
  API_URL: 'https://crudapi.co.uk/api/v1',
  API_KEY: 'mpoFHffvbuyRgXjeK6FqT9f-dkp_BRdX5pdhJsMvT5CeUj_ibQ',
  BASE_URL: 'https://crudapi.co.uk/api/v1'
}))

// Tester for innloggingsoperasjoner
describe('Login Operations', () => {
  // Nullstiller mock og auth-tilstand før hver test
  beforeEach(() => {
    fetchMock.resetMocks()
    store.dispatch({ type: 'auth/logout' })
  })

  // Test-brukerdata
  const mockCredentials = {
    username: 'testuser',
    password: 'TestPass123!'
  }

  // Tester vellykket innlogging
  test('should login successfully with valid credentials', async () => {
    const mockUser = {
      _uuid: '123',
      username: 'testuser',
      password: 'TestPass123!',
      name: 'Test User',
      role: 'user',
      email: 'test@example.com'
    }

    // Setter opp mock-respons
    fetchMock.mockResponseOnce(JSON.stringify({ 
      items: [mockUser] 
    }))

    // Utfører innloggingssekvens
    store.dispatch(loginStart())
    const users = await userService.getAllUsers()
    const user = users.find((u: User) => 
      u.username === mockCredentials.username && 
      u.password === mockCredentials.password
    )

    if (user) {
      store.dispatch(loginSuccess(user))
    } else {
      store.dispatch(loginFail('Invalid credentials'))
    }

    // Verifiserer innloggingstilstand
    const state = store.getState()
    expect(state.auth.isAuthenticated).toBe(true)
    expect(state.auth.user).toEqual(mockUser)
  })

  // Tester mislykket innlogging
  test('should fail with invalid credentials', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ items: [] }))

    store.dispatch(loginStart())
    const users = await userService.getAllUsers()
    const user = users.find((u: User) => 
      u.username === 'wronguser' && 
      u.password === 'wrongpass'
    )

    if (user) {
      store.dispatch(loginSuccess(user))
    } else {
      store.dispatch(loginFail('Invalid credentials'))
    }

    // Verifiserer feilhåndtering
    const state = store.getState()
    expect(state.auth.isAuthenticated).toBe(false)
    expect(state.auth.error).toBe('Invalid credentials')
  })

  // Tester lastestatus under innlogging
  test('should set loading state during login process', () => {
    store.dispatch(loginStart())
    const state = store.getState()
    expect(state.auth.loading).toBe(true)
  })
})
