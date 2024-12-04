import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Header } from '../components/Header'
import type { RootState } from '../store/store'

export function Dashboard() {
  const { user } = useSelector((state: RootState) => state.auth)
  const displayName = user?.name || user?.username

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">
          Hello, {displayName} 👋
        </h1>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

