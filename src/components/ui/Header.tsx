import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import reactLogo from "../../assets/react.svg";
import type { RootState } from "../../store/store";
import type { AppDispatch } from "../../store/store";

// Hovedkomponent for header/navigasjonsbar
export function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Henter autentisering og brukerdata fra Redux store
  const { isAuthenticated: isLoggedIn, user } = useSelector(
    (state: RootState) => state.auth
  );

  // Håndterer utlogging og navigerer til loginsiden
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  // Rendrer header med navigasjonsmeny
  return (
    <header className="w-full bg-gray-800 text-white">
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        {/* Logo-seksjon med link til dashboard  */}
        <div className="flex items-center">
          <Link to="/dashboard">
            <img
              src={reactLogo}
              alt="React Logo"
              className="h-10 w-10 animate-spin-slow hover:drop-shadow-glow transition-all duration-300"
            />
          </Link>
        </div>

        <div className="flex items-center gap-8">
          {isLoggedIn && (
            <>
              {/* Navigasjonslenker som vises når bruker er innlogget */}
              <Link
                to="/dashboard"
                className="text-white text-lg hover:text-blue-300 transition-colors transform hover:scale-105"
              >
                Dashboard
              </Link>
              <Link
                to="/dashboard/cvs"
                className="text-white text-lg hover:text-blue-300 transition-colors transform hover:scale-105"
              >
                CVs
              </Link>
              {/* Admin-spesifikk lenke som kun vises for admin-brukere */}
              {user?.role === "admin" && (
                <Link
                  to="/dashboard/users"
                  className="text-white text-lg hover:text-blue-300 transition-colors transform hover:scale-105"
                >
                  Users
                </Link>
              )}
            </>
          )}

          {/* Utloggingsknapp som vises når bruker er innlogget */}
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="bg-orange-600 hover:bg-orange-700 px-6 py-3 rounded-md transition-colors text-white font-semibold"
            >
              Log out
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}

