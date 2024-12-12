import { userService } from '../../src/services/user.service'
import { store } from '../../src/store/store'
import { loginStart, loginSuccess, loginFail } from '../../src/store/slices/authSlice'
import type { User } from '../../src/store/slices/userSlice'
import fetchMock from 'jest-fetch-mock'

describe('Login Operations', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
    store.dispatch({ type: 'auth/logout' })
  })

  const mockCredentials = {
    username: 'testuser',
    password: 'TestPass123!'
  }

  test('should login successfully with valid credentials', async () => {
    const mockUser = {
      _uuid: '123',
      username: 'testuser',
      password: 'TestPass123!',
      name: 'Test User',
      role: 'user',
      email: 'test@example.com'
    }

    fetchMock.mockResponseOnce(JSON.stringify({ 
      items: [mockUser] 
    }))

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

    const state = store.getState()
    expect(state.auth.isAuthenticated).toBe(true)
    expect(state.auth.user).toEqual(mockUser)
  })

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

    const state = store.getState()
    expect(state.auth.isAuthenticated).toBe(false)
    expect(state.auth.error).toBe('Invalid credentials')
  })

  test('should set loading state during login process', () => {
    store.dispatch(loginStart())
    const state = store.getState()
    expect(state.auth.loading).toBe(true)
  })
})
