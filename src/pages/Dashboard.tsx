import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '../store/store'
import { fetchUsers } from '../store/slices/userSlice'
import { fetchCVs } from '../store/slices/cvSlice'
import type { User } from '../store/slices/authSlice'
import { WelcomeHeader } from '../components/dashboard/WelcomeHeader'
import { StatCards } from '../components/dashboard/StatCards'
import { QuickGuide } from '../components/dashboard/QuickGuide'
import { RecentCVs } from '../components/dashboard/RecentCVs'
import type { CV } from '../store/slices/cvSlice'

// Hovedkomponent for dashbordet
export function Dashboard() {
  // Henter brukerdata og tilstand fra Redux store
  const { user } = useSelector((state: RootState) => state.auth)
  const typedUser = user as User
  const cvs = useSelector((state: RootState) => state.cv.cvs)
  const users = useSelector((state: RootState) => state.users.users) as User[]
  const isAdmin = typedUser?.role === 'admin'

  // Filtrerer CVer basert på brukerrettigheter
  const userCvs = cvs.filter((cv: CV) => 
    cv.userId === typedUser?._uuid || 
    cv.personalInfo.email === typedUser?.email
  )
  // Henter de 5 siste CVene
  const recentCvs = isAdmin ? cvs.slice(0, 5) : userCvs.slice(0, 5)

  const dispatch = useDispatch<AppDispatch>()

  // Henter brukere og CVer ved oppstart
  useEffect(() => {
    void dispatch(fetchUsers())
    void dispatch(fetchCVs())
  }, [dispatch])

  // Rendrer dashbordets hovedinnhold
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <WelcomeHeader 
          userName={typedUser?.name || 'Guest'} 
          isAdmin={isAdmin} 
        />
        <StatCards 
          user={typedUser}
          users={users}
          cvs={cvs}
          userCvs={userCvs}
          isAdmin={isAdmin}
        />
        <QuickGuide />
        <RecentCVs recentCvs={recentCvs} />
      </div>
    </div>
  )
}
