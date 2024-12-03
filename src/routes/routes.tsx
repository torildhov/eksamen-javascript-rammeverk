import { createBrowserRouter, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../store/store'
import App from '../App'
import { Login } from '../pages/Login'
import { Dashboard } from '../pages/Dashboard'
import { CVList } from '../pages/CVList'
import { CVDetail } from '../pages/CVDetail'
import { UserManagement } from '../pages/UserManagement'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)
  return isAuthenticated ? children : <Navigate to="/" />
}

const AdminRoute = () => {
  const { user } = useSelector((state: RootState) => state.auth)
  return user?.role === 'admin' ? <UserManagement /> : <Navigate to="/dashboard" />
}

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: '/',
        element: <Login />
      },
      {
        path: '/dashboard',
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
        children: [
          {
            path: 'cvs',
            element: <CVList />
          },
          {
            path: 'cvs/:id',
            element: <CVDetail />
          },
          {
            path: 'users',
            element: <AdminRoute />
          }
        ]
      }
    ]
  }
])
