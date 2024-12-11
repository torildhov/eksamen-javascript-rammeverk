interface WelcomeHeaderProps {
    userName: string
    isAdmin: boolean
  }
  
  export function WelcomeHeader({ userName, isAdmin }: WelcomeHeaderProps) {
    return (
      <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-8 mb-8 shadow-xl">
        <h1 className="text-4xl font-bold text-white mb-2">
          Welcome back,&nbsp;{userName}&nbsp;👋
        </h1>
        <p className="text-gray-300 text-lg">
          {isAdmin 
            ? 'Manage user accounts, view and edit user CVs and monitor user activity.'
            : 'Create professional CVs, showcase your skills, and download your CV as PDF ready for job application.'}
        </p>
      </div>
    )
  }
  