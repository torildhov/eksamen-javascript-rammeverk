import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer, { AuthState } from './slices/authSlice'
import usersReducer from './slices/userSlice'
import cvReducer from './slices/cvSlice'

// Definerer root state type for hele applikasjonen
export interface RootState {
  auth: AuthState
  users: ReturnType<typeof usersReducer>
  cv: ReturnType<typeof cvReducer>
}

// Konfigurasjon for Redux Persist
const persistConfig = {
  key: 'root',
  storage,
  // Transformerer data ved lagring og henting
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

// Setter opp persistent auth reducer
const persistedAuthReducer = persistReducer<AuthState>(persistConfig, authReducer)

// Konfigurerer og oppretter Redux store
export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    users: usersReducer,
    cv: cvReducer
  },
  // Konfigurerer middleware for å håndtere Redux Persist actions
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
})

// Oppretter Redux Persist-lagring
export const persistor = persistStore(store)
// Eksporterer dispatch type for typesikkerhet
export type AppDispatch = typeof store.dispatch

