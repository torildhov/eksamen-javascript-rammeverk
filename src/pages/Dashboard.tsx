import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import type { RootState, AppDispatch } from '../store/store'
import { fetchUsers } from '../store/slices/userSlice'
import { fetchCVs } from '../store/slices/cvSlice'


interface AuthUser {
  _created: number
  _data_type: string
  _is_deleted: boolean
  _modified: number
  _self_link: string
  _uuid: string
  email: string
  name: string
  password: string
  role: 'admin' | 'user'
  username: string
}

export function Dashboard() {
  const { user } = useSelector((state: RootState) => state.auth)
  const typedUser = (user as unknown) as AuthUser
  const cvs = useSelector((state: RootState) => state.cv.cvs)
  const users = useSelector((state: RootState) => state.users.users)
  const isAdmin = typedUser?.role === 'admin'

  const userCvs = cvs.filter(cv => cv.userId === typedUser?._uuid)
  const recentCvs = isAdmin ? cvs.slice(0, 5) : userCvs.slice(0, 5)

  const dispatch = useDispatch<AppDispatch>()

useEffect(() => {
  void dispatch(fetchUsers())
  void dispatch(fetchCVs())
}, [dispatch])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-8 mb-8 shadow-xl">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back,&nbsp;{user?.name}&nbsp;👋
          </h1>
          <p className="text-gray-300 text-lg">
            {isAdmin 
              ? 'Manage user accounts, view and edit user CVs and monitor user activity.'
              : 'Create professional CVs, showcase your skills, and track your applications all in one place.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isAdmin ? (
            <>
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
                    <span className="text-green-200">Email:</span> {typedUser?.email}
                  </p>
                </div>
              </div>
            </>
          )}

          <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link 
                to="/dashboard/cvs"
                className="block w-full bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300 text-center font-semibold shadow-lg"
              >
                {isAdmin ? 'Manage CVs' : 'Create New CV'}
              </Link>
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

        <div className="mt-8 bg-gradient-to-r from-orange-400 to-orange-500 rounded-2xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-4">Quick Guide</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/10 p-4 rounded-xl">
              <div className="text-indigo-200 text-xl mb-2">Getting Started</div>
              <div className="space-y-2">
                <p className="text-white">1. Create your CV using our professional template</p>
                <p className="text-white">2. Add your experience, skills, and achievements</p>
                <p className="text-white">3. Export as PDF and share with employers</p>
              </div>
            </div>
            <div className="bg-white/10 p-4 rounded-xl">
              <div className="text-indigo-200 text-xl mb-2">Pro Tips</div>
              <div className="space-y-2">
                <p className="text-white">💡 Keep your CV updated with latest achievements</p>
                <p className="text-white">💡 Use action verbs to describe your experience</p>
                <p className="text-white">💡 Highlight key skills relevant to your field</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 backdrop-blur-lg bg-white/10 rounded-2xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-6">Recent CVs</h2>
          <div className="grid gap-4">
            {recentCvs.map(cv => (
              <Link 
                key={cv._uuid} 
                to={`/dashboard/cvs/${cv._uuid}`}
                className="flex justify-between items-center p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 group"
              >
                <div>
                  <p className="font-semibold text-white">{cv.personalInfo.name}</p>
                  <p className="text-sm text-gray-300">{cv.personalInfo.email}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-300">
                    {new Date(cv.updatedAt).toLocaleDateString('no-NO', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </span>
                  <span className="text-white transform group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )




}
