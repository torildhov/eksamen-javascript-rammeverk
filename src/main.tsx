import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/routes'
import { userService } from './services/user.service'
import './index.css'

userService.initializeAdminUser()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
