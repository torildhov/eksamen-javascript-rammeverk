import { createSlice, PayloadAction, Action } from '@reduxjs/toolkit'
import { REHYDRATE } from 'redux-persist'

interface User {
  username: string
  name: string
  role: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

interface RehydrateAction extends Action {
  type: typeof REHYDRATE
  payload?: {
    auth: AuthState
  }
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
      console.log('Login started')
      state.loading = true
      state.error = null
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      console.log('Login successful:', action.payload)
      state.loading = false
      state.isAuthenticated = true
      state.user = action.payload
      state.error = null
      console.log('Current auth state:', state)
      console.log('LocalStorage after login:', localStorage.getItem('persist:root'))
    }
    
    
    ,
    loginFail: (state, action: PayloadAction<string>) => {
      console.log('Login failed:', action.payload)
      state.loading = false
      state.error = action.payload
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder.addCase(REHYDRATE, (state, action: RehydrateAction) => {
      if (action.payload?.auth) {
        return {
          ...state,
          ...action.payload.auth
        }
      }
      return state
    })
  }
})

export const { loginStart, loginSuccess, loginFail, logout } = authSlice.actions
export default authSlice.reducer

