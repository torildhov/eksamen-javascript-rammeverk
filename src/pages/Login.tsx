import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginStart, loginSuccess, loginFail } from '../store/slices/authSlice'
import { userService } from '../services/user.service'
import type { User } from '../store/slices/userSlice'

export function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(loginStart())
  
    try {
      const users = await userService.getAllUsers()
      const user = users.find((u: User) => u.username === credentials.username && u.password === credentials.password)
  
      if (user) {
        dispatch(loginSuccess(user))
        navigate('/dashboard')
      } else {
        dispatch(loginFail('Invalid credentials'))
      }
    } catch {
      dispatch(loginFail('Login failed'))
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="bg-gray-100 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900">Username</label>
            <input
              type="text"
              value={credentials.username}
              onChange={e => setCredentials(prev => ({ ...prev, username: e.target.value }))}
              className="mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:border-blue-500 bg-white text-gray-900"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-900">Password</label>
            <input
              type="password"
              value={credentials.password}
              onChange={e => setCredentials(prev => ({ ...prev, password: e.target.value }))}
              className="mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:border-blue-500 bg-white text-gray-900"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-semibold"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}
