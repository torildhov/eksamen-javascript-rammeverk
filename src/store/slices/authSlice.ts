import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
  _id: string
  name: string
  email: string
  username: string
  role: 'admin' | 'user'
}


export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}


const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true
      state.error = null
    },
    loginSuccess: (state, action: PayloadAction<Partial<User>>) => {
      state.loading = false
      state.isAuthenticated = true
      state.user = action.payload as User
      state.error = null
    },
    loginFail: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.error = null
    }
  }
})

export const { loginStart, loginSuccess, loginFail, logout } = authSlice.actions
export default authSlice.reducer
