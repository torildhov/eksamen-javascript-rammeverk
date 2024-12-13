import { Link } from 'react-router-dom'
import type { User } from '../../store/slices/authSlice'
import type { CV } from '../../store/slices/cvSlice'

// Interface som definerer props for statistikk-kortene
interface StatCardsProps {
    user: User
    users: User[]
    cvs: CV[]
    userCvs: CV[]
    isAdmin: boolean
}

// Komponent som viser statistikk-kort basert på brukerrolle
export function StatCards({ user, users, cvs, userCvs, isAdmin }: StatCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Betinget rendering basert på om brukeren er admin */}
      {isAdmin ? (
        <>
          {/* Admin-spesifikke kort som viser total statistikk */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-blue-100">Total Users</h3>
            <p className="text-4xl font-bold text-white mt-2">{users.length}</p>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-green-100">Total CVs</h3>
            <p className="text-4xl font-bold text-white mt-2">{cvs.length}</p>
          </div>
        </>
      ) : (
        <>
          {/* Bruker-spesifikke kort som viser personlig statistikk */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-blue-100">Your CVs</h3>
            <p className="text-4xl font-bold text-white mt-2">{userCvs.length}</p>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-green-100">Profile Overview</h3>
            <div className="mt-2 space-y-2">
              <p className="text-white">
                <span className="text-green-200">Username:</span> {user?.username}
              </p>
              <p className="text-white">
                <span className="text-green-200">Email:</span> {user?.email}
              </p>
            </div>
          </div>
        </>
      )}

      {/* Hurtighandlinger-kort som vises for alle brukere */}
      <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 shadow-xl">
        <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
        <div className="space-y-3">
          {/* Dynamisk lenketekst basert på brukerrolle */}
          <Link 
            to="/dashboard/cvs"
            className="block w-full bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300 text-center font-semibold shadow-lg"
          >
            {isAdmin ? 'Manage CVs' : 'Create New CV'}
          </Link>
          {/* Admin-spesifikk lenke for brukerhåndtering */}
          {isAdmin && (
            <Link 
              to="/dashboard/users"
              className="block w-full bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300 text-center font-semibold shadow-lg"
            >
              Manage Users
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

