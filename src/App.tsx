import { Header } from './components/Header'
import { Outlet } from 'react-router-dom'
import { ScrollToTop } from './components/ScrollToTop'
import { Toaster } from 'react-hot-toast'

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
