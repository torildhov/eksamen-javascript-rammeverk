import { useRouteError } from 'react-router-dom';

export function ErrorPage() {
  const error = useRouteError() as Error;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-8 shadow-xl max-w-md w-full text-center">
        <h1 className="text-9xl font-bold text-white mb-4 opacity-20">404</h1>
        <h2 className="text-3xl font-bold text-white mb-6">Oops! Page Not Found</h2>
        <p className="text-gray-300 mb-8">{error.message}</p>
        <button 
          onClick={() => window.location.href = '/'}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-semibold shadow-lg"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}
