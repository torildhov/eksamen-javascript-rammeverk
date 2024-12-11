import { useRouteError, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { Button } from "../components/ui/Button";

export function ErrorPage() {
  const error = useRouteError() as Error;
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const handleReturn = () => {
    navigate(isAuthenticated ? "/dashboard" : "/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-8 shadow-xl max-w-md w-full text-center">
        <h1 className="text-9xl font-bold text-white mb-4 opacity-20">404</h1>
        <h2 className="text-3xl font-bold text-white mb-6">
          Oops! Page Not Found
        </h2>
        <p className="text-gray-300 mb-8">{error.message}</p>
        <Button
          onClick={handleReturn}
          variant="primary"
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
}
