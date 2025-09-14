import { useState } from "react";
import { User, Mail, Lock, LogIn } from "lucide-react";
import { useUserStore } from "../stores/useUserStore.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

export const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useUserStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    validateForm();
    login(username, password);
  };

  const [errors, setErrors] = useState({
    userName: "",
    password: "",
  });

  const validateForm = () => {
    const newErrors = { userName: "", password: "" };
    let isValid = true;

    if (!username) {
      newErrors.userName = "Username required";
      isValid = false;
    }
    if (!password) {
      newErrors.password = "Password required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-base-200 p-8 rounded-lg shadow-xl">
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <User className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-extrabold text-base-content">
            LogIn to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {/* userName  */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-base-content mb-1"
              >
                Username
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-base-content/50" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full px-3 py-2 pl-10 bg-base-200 border border-base-300 rounded-md shadow-sm placeholder-base-content/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                  placeholder="Enter your username"
                />
              </div>
              {errors.userName && (
                <p className="mt-1 text-sm text-red-600 flex items-start">
                  <svg
                    className="h-4 w-4 mr-1 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.userName}
                </p>
              )}
            </div>

            {/* Password  */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-base-content mb-1"
              >
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-base-content/50" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-3 py-2 pl-10 bg-base-200 border border-base-300 rounded-md shadow-sm placeholder-base-content/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-start">
                  <svg
                    className="h-4 w-4 mr-1 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.password}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="btn btn-primary w-full group relative"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LogIn className="h-5 w-5 text-primary-content" />
              </span>
              LogIn
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
