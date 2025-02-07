import { store } from '../../src/store/store'
import { loginSuccess } from '../../src/store/slices/authSlice'

// Mocker API-konfigurasjon for testing
jest.mock('../../src/config/api.config', () => ({
  API_URL: 'https://crudapi.co.uk/api/v1',
  API_KEY: 'mpoFHffvbuyRgXjeK6FqT9f-dkp_BRdX5pdhJsMvT5CeUj_ibQ',
  BASE_URL: 'https://crudapi.co.uk/api/v1'
}))

// Tester for autorisasjonsoperasjoner
describe('Authorization Operations', () => {
  // Tester admin-tilgang
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

  // Tester vanlig bruker-rettigheter
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
