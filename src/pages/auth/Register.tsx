import { useState } from "react";
import {
  Shield,
  Mail,
  Lock,
  AlertCircle,
  User,
  FileText,
  CreditCard,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import * as authApi from "../../services/auth/authApi";

export const Register = () => {
  const [formData, setFormData] = useState({
    nombres: "",
    apellido_p: "",
    apellido_m: "",
    correo: "",
    contraseña: "",
    confirmPassword: "",
    tipo_documento: "DNI",
    nro_documento: "",
    rolInt: 2, // Default to admin role
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "rolInt" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (formData.contraseña !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...registerData } = formData;
      const result: authApi.ApiResponse = await register(registerData);

      if (result.success) {
        navigate("/");
      } else {
        setError(result.message || "Error al registrar el usuario");
      }
    } catch (err) {
      setError("Ocurrió un error al intentar registrarse");
      console.error("Register error:", err);
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
      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 sm:px-6 lg:px-8 overflow-auto">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Lado izquierdo - Título e icono */}
          <div className="flex flex-col items-center justify-center text-center space-y-8 lg:items-start lg:text-left lg:pl-12">
            <div className="flex items-center justify-center w-24 h-24 bg-[#c4a44c] rounded-2xl shadow-2xl">
              <Shield className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Solicitud de Acceso
              </h1>
              <p className="text-xl text-gray-800 leading-relaxed">
                Completa el formulario para solicitar acceso al panel administrativo
              </p>
            </div>
          </div>

          {/* Lado derecho - Formulario */}
          <div className="w-full lg:pr-12">
            <div className="bg-white py-10 px-6 shadow-2xl rounded-3xl sm:px-12 border border-gray-100">
              {/* Error Alert */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-red-700 font-medium">
                      Error de registro
                    </p>
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                  </div>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Personal Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    Información Personal
                  </h3>

                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    {/* Nombres */}
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="nombres"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Nombres *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="nombres"
                          name="nombres"
                          required
                          value={formData.nombres}
                          onChange={handleChange}
                          className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c4a44c] focus:border-[#c4a44c] sm:text-sm transition-colors"
                          placeholder="Nombres"
                        />
                      </div>
                    </div>

                    {/* Apellido Paterno */}
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="apellido_p"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Apellido Paterno *
                      </label>
                      <input
                        type="text"
                        id="apellido_p"
                        name="apellido_p"
                        required
                        value={formData.apellido_p}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c4a44c] focus:border-[#c4a44c] sm:text-sm transition-colors"
                        placeholder="Apellido paterno"
                      />
                    </div>

                    {/* Apellido Materno */}
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="apellido_m"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Apellido Materno
                      </label>
                      <input
                        type="text"
                        id="apellido_m"
                        name="apellido_m"
                        value={formData.apellido_m}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c4a44c] focus:border-[#c4a44c] sm:text-sm transition-colors"
                        placeholder="Apellido materno"
                      />
                    </div>

                    {/* Tipo de Documento */}
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="tipo_documento"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Tipo de Documento *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FileText className="h-4 w-4 text-gray-400" />
                        </div>
                        <select
                          id="tipo_documento"
                          name="tipo_documento"
                          value={formData.tipo_documento}
                          onChange={handleChange}
                          className="appearance-none block w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c4a44c] focus:border-[#c4a44c] sm:text-sm transition-colors bg-white"
                        >
                          <option value="DNI">DNI</option>
                          <option value="CE">Carné de Extranjería</option>
                          <option value="PASAPORTE">Pasaporte</option>
                        </select>
                      </div>
                    </div>

                    {/* Número de Documento */}
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="nro_documento"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Número de Documento *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <CreditCard className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="nro_documento"
                          name="nro_documento"
                          required
                          value={formData.nro_documento}
                          onChange={handleChange}
                          className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c4a44c] focus:border-[#c4a44c] sm:text-sm transition-colors"
                          placeholder="12345678"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    Información de Contacto
                  </h3>

                  {/* Correo electrónico */}
                  <div>
                    <label
                      htmlFor="correo"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Correo electrónico *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="correo"
                        name="correo"
                        autoComplete="email"
                        required
                        value={formData.correo}
                        onChange={handleChange}
                        className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c4a44c] focus:border-[#c4a44c] sm:text-sm transition-colors"
                        placeholder="Correo electrónico"
                      />
                    </div>
                  </div>

                  {/* Contraseña */}
                  <div>
                    <label
                      htmlFor="contraseña"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Contraseña *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        id="contraseña"
                        name="contraseña"
                        required
                        minLength={6}
                        value={formData.contraseña}
                        onChange={handleChange}
                        className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c4a44c] focus:border-[#c4a44c] sm:text-sm transition-colors"
                        placeholder="Contraseña"
                      />
                    </div>
                  </div>

                  {/* Confirmar Contraseña */}
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Confirmar Contraseña *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        required
                        minLength={6}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c4a44c] focus:border-[#c4a44c] sm:text-sm transition-colors"
                        placeholder="Confirmar contraseña"
                      />
                    </div>
                  </div>
                </div>

                {/* Botón de registro */}
                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#c4a44c] hover:bg-[#c4a44c]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c4a44c]"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                      </div>
                    ) : (
                      <span>Registrar</span>
                    )}
                  </button>
                </div>
              </form>

              {/* Security Notice */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Shield className="w-4 h-4" />
                  <span>Tu información está segura y protegida</span>
                </div>
              </div>

              {/* Login Link */}
              <div className="text-center mt-6">
                <span className="text-sm text-gray-600">
                  ¿Ya tienes una cuenta?{" "}
                  <a
                    href="/auth/login"
                    className="font-medium text-[#c4a44c] hover:text-[#b09344] transition-colors"
                  >
                    Inicia sesión
                  </a>
                </span>
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

export default Register;
