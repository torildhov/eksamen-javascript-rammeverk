import { Link } from 'react-router-dom'
import type { CV } from '../../store/slices/cvSlice'

interface RecentCVsProps {
  recentCvs: CV[]
}

export function RecentCVs({ recentCvs }: RecentCVsProps) {
  return (
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
  )
}

