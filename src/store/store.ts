import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import usersReducer, { User } from './slices/userSlice'
import type { AuthState } from './slices/authSlice'

export interface RootState {
  auth: AuthState
  users: {
    users: User[]
    loading: boolean
    error: string | null
  }
}
export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer
  }
})

export type AppDispatch = typeof store.dispatch
