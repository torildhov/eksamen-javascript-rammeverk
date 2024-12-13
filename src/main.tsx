import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store/store'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/routes'
import { userService } from './services/user.service'
import './index.css'

// Initialiserer admin-bruker ved oppstart
userService.initializeAdminUser()

// Rendrer hovedapplikasjonen med Redux store og routing
createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <RouterProvider router={router} />
    </PersistGate>
  </Provider>
)
