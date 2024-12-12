import { useSelector } from 'react-redux'
import { Navigate, useLocation, Outlet } from 'react-router-dom'
import type { RootState } from '../store/store'

export function AuthGuard() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  return <Outlet />
}
