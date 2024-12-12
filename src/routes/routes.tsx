import { createBrowserRouter } from 'react-router-dom'
import { Login } from '../pages/Login'
import { Dashboard } from '../pages/Dashboard'
import { CVManagement } from '../pages/CVManagement'
import { CVDetail } from '../pages/CVDetail'
import { UserManagement } from '../pages/UserManagement'
import App from '../App'
import { ErrorPage } from '../pages/ErrorPage'
import { AuthGuard } from '../middleware/AuthGuard'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Login />
      },
      {
        element: <AuthGuard />,
        children: [
          {
            path: '/dashboard',
            element: <Dashboard />
          },
          {
            path: '/dashboard/cvs',
            element: <CVManagement />
          },
          {
            path: '/dashboard/cvs/:id',
            element: <CVDetail />
          },
          {
            path: '/dashboard/users',
            element: <UserManagement />
          }
        ]
      }
    ]
  }
])



