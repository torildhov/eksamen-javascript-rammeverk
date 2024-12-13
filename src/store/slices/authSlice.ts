// Importerer nødvendige Redux Toolkit funksjoner og REHYDRATE for å beholde innloggingstatus
import { createSlice, PayloadAction, Action } from '@reduxjs/toolkit'
import { REHYDRATE } from 'redux-persist'

// Definerer brukertype for autentisering
export interface User {
  _uuid: string
  username: string
  name: string
  role: string
  email: string
}

// Definerer tilstandstype for autentisering
export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

// Interface for rehydrering av tilstand
interface RehydrateAction extends Action {
  type: typeof REHYDRATE
  payload?: {
    auth: AuthState
  }
}

// Initial tilstand for auth-slice
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
}

// Oppretter auth-slice med reducers for ulike autentiseringshandlinger
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Starter innloggingsprosessen
    loginStart: (state) => {
      state.loading = true
      state.error = null
    },
    // Håndterer vellykket innlogging
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.loading = false
      state.isAuthenticated = true
      state.user = action.payload
      state.error = null
    },
    // Håndterer mislykket innlogging
    loginFail: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },
    // Håndterer utlogging
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.error = null
    }
  },
  // Ekstra reducers for å håndtere rehydrering av tilstand
  //Når en bruker refresher siden vil redux-persist hente tilstand fra localStorage,
  //sende en rehydrate handling med den lagrede dataen og gjenoppdrette brukerens
  //innloggingsstatus - alså den holdes logget inn/ut etter refreshing
  //Dokumentasjon: https://github.com/rt2zz/redux-persist
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

// Eksporterer actions og reducer
export const { loginStart, loginSuccess, loginFail, logout } = authSlice.actions
export default authSlice.reducer
