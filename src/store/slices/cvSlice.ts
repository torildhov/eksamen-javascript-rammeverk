import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { cvService } from '../../services/cv.service'

// Definerer typer for CV-strukturen
export interface Education {
  institution: string
  degree: string
  year: string
}

export interface Experience {
  title: string
  company: string
  years: string
  description: string
  projects: string
}

export interface Reference {
  name: string
  contactInfo: string
}

// Hovedtype for CV med all nødvendig informasjon
export interface CV {
  _uuid?: string
  userId: string
  createdAt: string
  updatedAt: string
  personalInfo: {
    name: string
    email: string
    phone: string
  }
  skills: string[]
  education: Education[]
  experience: {
    title: string
    company: string
    years: string
    description: string
    projects: string
  }[]
  references: {
    name: string
    contactInfo: string
  }[]
}

// Definerer tilstandstype for CV-håndtering
export interface CVState {
  cvs: CV[]
  loading: boolean
  error: string | null
}

// Initial tilstand for CV-slice
export const initialState: CVState = {
  cvs: [],
  loading: false,
  error: null
}

// Asynkron thunk for å hente alle CVer
export const fetchCVs = createAsyncThunk('cvs/fetchCVs', async () => {
  const response = await cvService.getAllCVs()
  return response
})

// Asynkron thunk for å opprette ny CV
export const createCV = createAsyncThunk('cvs/createCV', async (cvData: Omit<CV, '_uuid'>) => {
  const response = await cvService.createCV(cvData)
  return response
})

// Asynkron thunk for å slette CV
export const deleteCV = createAsyncThunk('cvs/deleteCV', async (id: string) => {
  await cvService.deleteCV(id)
  return id
})

// Asynkron thunk for å oppdatere CV
export const updateCV = createAsyncThunk(
  'cvs/updateCV',
  async ({ id, cvData }: { id: string, cvData: Partial<CV> }) => {
    const dataWithTimestamp = {
      ...cvData,
      updatedAt: new Date().toISOString()
    }
    const response = await cvService.updateCV(id, dataWithTimestamp)
    return response
  }
)

// Oppretter CV-slice med reducers for tilstandshåndtering
const cvSlice = createSlice({
  name: 'cv',
  initialState,
  reducers: {},
  // Håndterer tilstandsendringer for asynkrone operasjoner
  extraReducers: (builder) => {
    builder
      // Håndterer henting av CVer
      .addCase(fetchCVs.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCVs.fulfilled, (state, action) => {
        state.loading = false
        state.cvs = action.payload
      })
      .addCase(fetchCVs.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch CVs'
      })
      
      // Håndterer opprettelse av CV
      .addCase(createCV.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createCV.fulfilled, (state, action) => {
        state.loading = false
        state.cvs.push(action.payload)
      })
      .addCase(createCV.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to create CV'
      })
      
      // Håndterer sletting av CV
      .addCase(deleteCV.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteCV.fulfilled, (state, action) => {
        state.loading = false
        state.cvs = state.cvs.filter(cv => cv._uuid !== action.payload)
      })
      .addCase(deleteCV.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to delete CV'
      })

      // Håndterer oppdatering av CV
      .addCase(updateCV.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateCV.fulfilled, (state, action) => {
        state.loading = false
        const index = state.cvs.findIndex(cv => cv._uuid === action.payload._uuid)
        if (index !== -1) {
          state.cvs[index] = action.payload
        }
      })
      .addCase(updateCV.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to update CV'
      })
  }
})

export default cvSlice.reducer
