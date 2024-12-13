import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { userService } from '../../services/user.service'

// Definerer brukertype med alle nødvendige felt
export interface User {
  _uuid?: string
  name: string
  email: string
  username: string
  password: string
  role: 'admin' | 'user'
}

// Definerer tilstandstype for brukerhåndtering
export interface UsersState {
  users: User[]
  loading: boolean
  error: string | null
}

// Initial tilstand for user-slice
export const initialState: UsersState = {
  users: [],
  loading: false,
  error: null
}

// Asynkron thunk for å hente alle brukere
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await userService.getAllUsers()
  return response
})

// Asynkron thunk for å opprette ny bruker
export const createUser = createAsyncThunk('users/createUser', async (userData: Omit<User, '_uuid'>) => {
  const response = await userService.createUser(userData)
  return response
})

// Asynkron thunk for å slette bruker
export const deleteUser = createAsyncThunk('users/deleteUser', async (id: string) => {
  await userService.deleteUser(id)
  return id
})

// Asynkron thunk for å oppdatere bruker
export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, userData }: { id: string, userData: Partial<User> }) => {
    const response = await userService.updateUser(id, userData)
    return response
  }
)

// Oppretter user-slice med reducers for tilstandshåndtering
const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  // Håndterer tilstandsendringer for asynkrone operasjoner
  extraReducers: (builder) => {
    builder
      // Håndterer henting av brukere
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch users'
      })
      
      // Håndterer opprettelse av bruker
      .addCase(createUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false
        state.users.push(action.payload)
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to create user'
      })
      
      // Håndterer sletting av bruker
      .addCase(deleteUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false
        state.users = state.users.filter(user => user._uuid !== action.payload)
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to delete user'
      })

      // Håndterer oppdatering av bruker
      .addCase(updateUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false
        const index = state.users.findIndex(user => user._uuid === action.payload._uuid)
        if (index !== -1) {
          state.users[index] = action.payload
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to update user'
      })
  }
})

export default usersSlice.reducer
