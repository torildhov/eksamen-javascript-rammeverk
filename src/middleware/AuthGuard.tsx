import { useSelector } from 'react-redux'
import { Navigate, useLocation, Outlet } from 'react-router-dom'
import type { RootState } from '../store/store'

// Beskyttelseskomponent for autentiserte ruter
export function AuthGuard() {
  // Henter autentiseringsstatus fra Redux store
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)
  // Henter nåværende lokasjon for redirect-funksjonalitet
  const location = useLocation()

  // Omdirigerer til hovedsiden hvis bruker ikke er autentisert
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  // Rendrer beskyttet innhold hvis bruker er autentisert
  return <Outlet />
}
