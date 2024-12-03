import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer, { AuthState } from './slices/authSlice'
import usersReducer from './slices/userSlice'

export interface RootState {
  auth: AuthState
  users: ReturnType<typeof usersReducer>
}

const persistConfig = {
  key: 'root',
  storage,
  transforms: [
    {
      in: (state: AuthState) => {
        console.log('Transform in:', state)
        return state
      },
      out: (state: AuthState) => {
        console.log('Transform out:', state)
        return JSON.parse(JSON.stringify(state))
      }
    }
  ]
}

const persistedAuthReducer = persistReducer<AuthState>(persistConfig, authReducer)

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    users: usersReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
})

export const persistor = persistStore(store)
export type AppDispatch = typeof store.dispatch

