import { useState } from "react";
import { Shield, Mail, Lock, AlertCircle } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import * as authApi from "../../services/auth/authApi";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result: authApi.ApiResponse = await login({
        correo: email,
        contraseña: password,
      });
      if (result.success) {
        // eslint-disable-next-line quotes
        navigate("/");
      } else {
        setError(result.message || "Error al iniciar sesión");
      }
    } catch (err) {
      setError("Ocurrió un error al intentar iniciar sesión");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Fondo con imagen y overlay */}
      <div className="absolute inset-0">
        {/* Imagen de fondo */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)",
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-[#c4a44c]/20 z-10" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8 overflow-auto">
        <div className="sm:mx-auto sm:w-full sm:max-w-md flex justify-center items-center space-x-4">
          <div className="flex items-center justify-center w-16 h-16 bg-[#c4a44c] rounded-lg shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div className="text-left">
            <h2 className="text-3xl font-bold text-gray-900">
              Panel Administrativo
            </h2>
            <p className="text-sm text-gray-600">
              Ingresa tus credenciales para acceder al sistema
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-700 font-medium">
                    Error de autenticación
                  </p>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Correo electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c4a44c] focus:border-[#c4a44c] sm:text-sm transition-colors"
                    placeholder="admin@empresa.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c4a44c] focus:border-[#c4a44c] sm:text-sm transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Additional Options */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-[#c4a44c] focus:ring-[#c4a44c] border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Recordar sesión
                  </label>
                </div>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-[#c4a44c] hover:text-[#b09344] transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-[#c4a44c] hover:bg-[#b09344] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c4a44c] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Iniciando sesión...
                    </>
                  ) : (
                    "Iniciar sesión"
                  )}
                </button>
              </div>

              {/* Register Link */}
              <div className="text-center">
                <span className="text-sm text-gray-600">
                  ¿No tienes una cuenta?{" "}
                  <a
                    href="/auth/register"
                    className="font-medium text-[#c4a44c] hover:text-[#b09344] transition-colors"
                  >
                    Solicitar acceso
                  </a>
                </span>
              </div>
            </form>

            {/* Security Notice */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <Shield className="w-4 h-4" />
                <span>Conexión segura y encriptada</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-white">
        <p>
          &copy; {new Date().getFullYear()} Panel Administrativo. Todos los
          derechos reservados.
        </p>
      </div>
    </div>
  );
};

export default Login;
