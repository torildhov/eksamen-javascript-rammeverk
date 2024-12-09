import { Header } from './components/Header'
import { Outlet } from 'react-router-dom'
import { ScrollToTop } from './components/ScrollToTop'

function App() {
  return (
    <div className="min-h-screen">
      <ScrollToTop />
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default App
