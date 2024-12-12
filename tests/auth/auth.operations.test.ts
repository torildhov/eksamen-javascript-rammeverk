import { store } from '../../src/store/store'
import { loginSuccess } from '../../src/store/slices/authSlice'

describe('Authorization Operations', () => {
  test('admin should have access to user management', () => {
    store.dispatch(loginSuccess({
      _uuid: '123',
      username: 'admin',
      name: 'Admin User',
      role: 'admin',
      email: 'admin@example.com' 
    }))

    const state = store.getState()
    expect(state.auth.user?.role).toBe('admin')
  })

  test('regular user should not have admin privileges', () => {
    store.dispatch(loginSuccess({
      _uuid: '456',
      username: 'user',
      name: 'Regular User',
      role: 'user',
      email: 'user@example.com' 
    }))

    const state = store.getState()
    expect(state.auth.user?.role).not.toBe('admin')
  })
})

