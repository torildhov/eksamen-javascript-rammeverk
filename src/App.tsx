import { Header } from './components/ui/Header'
import { Outlet } from 'react-router-dom'
import { ScrollToTop } from './components/ui/ScrollToTop'
import { Toaster } from 'react-hot-toast'

// Hovedapplikasjon som setter opp grunnleggende layout
function App() {
  return (
    <div className="min-h-screen">
      <ScrollToTop />
      <Header />
      <main>
        <Outlet />
      </main>
      <Toaster position="top-center" />
    </div>
  )
}

export default App
