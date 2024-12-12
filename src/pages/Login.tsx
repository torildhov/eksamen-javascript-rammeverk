import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginStart, loginSuccess, loginFail } from "../store/slices/authSlice";
import { userService } from "../services/user.service";
import type { User } from "../store/slices/userSlice";
import { HeroAnimation } from "../components/ui/HeroAnimation";

interface Credentials {
  username: string;
  password: string;
}

export function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<Credentials>({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    password: "",
    general: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ username: "", password: "", general: "" });
    dispatch(loginStart());

    try {
      const users = await userService.getAllUsers();
      const user = users.find(
        (u: User) =>
          u.username === credentials.username &&
          u.password === credentials.password
      );

      if (user) {
        dispatch(loginSuccess(user));
        navigate("/dashboard");
      } else {
        setErrors({
          username: "Invalid username or password",
          password: "Invalid username or password",
          general: "",
        });
        dispatch(loginFail("Invalid credentials"));
      }
    } catch {
      setErrors({
        username: "",
        password: "",
        general: "Login failed. Please try again.",
      });
      dispatch(loginFail("Login failed"));
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="w-full md:w-1/2 mt-10 md:mt-20">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-left">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
              CV Builder
            </h1>
            <p className="mt-3 text-xl text-gray-300">
              Create stunning CVs in minutes
            </p>
          </div>

          {/* Features List */}
          <div className="mt-8 space-y-4">
            <div className="flex items-center text-gray-300">
              <svg
                className="h-6 w-6 text-orange-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="ml-2">Professional templates</span>
            </div>
            <div className="flex items-center text-gray-300">
              <svg
                className="h-6 w-6 text-orange-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="ml-2">Easy PDF export</span>
            </div>
            <div className="flex items-center text-gray-300">
              <svg
                className="h-6 w-6 text-orange-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="ml-2">Secure cloud storage</span>
            </div>
          </div>

          {/* Login Form */}
          {errors.general && (
            <div className="text-red-500 text-center mb-4">
              {errors.general}
            </div>
          )}
          <div className="mt-10 bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              Sign in to your account
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Username
                </label>
                <input
                  type="text"
                  value={credentials.username}
                  onChange={(e) =>
                    setCredentials((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  required
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-500">{errors.username}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  required
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 px-4 rounded-md hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-semibold shadow-lg"
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
      {/* Right side - Animation */}
      <div className="hidden md:flex w-full md:w-1/2 items-end justify-center pb-8">
        <div className="w-[1000px] h-[1000px]">
          <HeroAnimation />
        </div>
      </div>
    </div>
  );
}
