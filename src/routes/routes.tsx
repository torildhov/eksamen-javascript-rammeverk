import { createBrowserRouter } from 'react-router-dom'
import { Login } from '../pages/Login'
import { Dashboard } from '../pages/Dashboard'
import { CVManagement } from '../pages/CVManagement'
import { CVDetail } from '../pages/CVDetail'
import { UserManagement } from '../pages/UserManagement'
import App from '../App'
import { ErrorPage } from '../pages/ErrorPage'
import { AuthGuard } from '../middleware/AuthGuard'

// Definerer applikasjonens ruteoppsett med createBrowserRouter
export const router = createBrowserRouter([
  {
    // Rot-rute som wrapper hele applikasjonen
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        // Offentlig innloggingsrute
        path: '/',
        element: <Login />
      },
      {
        // Beskyttet rute-gruppe som krever autentisering med AuthGuard
        element: <AuthGuard />,
        children: [
          {
            // Dashboard hovedside
            path: '/dashboard',
            element: <Dashboard />
          },
          {
            // CV-administrasjon
            path: '/dashboard/cvs',
            element: <CVManagement />
          },
          {
            // Detaljvisning for enkelt-CV
            path: '/dashboard/cvs/:id',
            element: <CVDetail />
          },
          {
            // Brukeradministrasjon (typisk for admin)
            path: '/dashboard/users',
            element: <UserManagement />
          }
        ]
      }
    ]
  }
])




