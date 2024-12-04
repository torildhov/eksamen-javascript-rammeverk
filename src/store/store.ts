import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer, { AuthState } from './slices/authSlice'
import usersReducer from './slices/userSlice'
import cvReducer from './slices/cvSlice'

export interface RootState {
  auth: AuthState
  users: ReturnType<typeof usersReducer>
  cv: ReturnType<typeof cvReducer>
}

const persistConfig = {
  key: 'root',
  storage,
  transforms: [
    {
      in: (state: AuthState) => {
        return state
      },
      out: (state: AuthState) => {
        return JSON.parse(JSON.stringify(state))
      }
    }
  ]
}

const persistedAuthReducer = persistReducer<AuthState>(persistConfig, authReducer)

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    users: usersReducer,
    cv: cvReducer
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
