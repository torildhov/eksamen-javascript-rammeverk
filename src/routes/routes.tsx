import { createBrowserRouter } from 'react-router-dom'
import { Login } from '../pages/Login'
import { Dashboard } from '../pages/Dashboard'
import { CVList } from '../pages/CVList'
import { CVDetail } from '../pages/CVDetail'
import { UserManagement } from '../pages/UserManagement'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
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
        element: <UserManagement />
      }
    ]
  }
])

