import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import * as authApi from '../../services/auth/authApi';

export const Register = () => {
  const [formData, setFormData] = useState({
    nombres: '',
    apellido_p: '',
    apellido_m: '',
    correo: '',
    contraseña: '',
    confirmPassword: '',
    tipo_documento: 'DNI',
    nro_documento: '',
    rolInt: 2, // Default to admin role
  });
  
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rolInt' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.contraseña !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...registerData } = formData;
      const result: authApi.ApiResponse = await register(registerData);
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message || 'Error al registrar el usuario');
      }
    } catch (err) {
      setError('Ocurrió un error al intentar registrarse');
      console.error('Register error:', err);
    }
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <h2 className="mb-6 text-center text-3xl font-extrabold text-gray-900">
          Crear Cuenta
        </h2>
        
        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="nombres" className="block text-sm font-medium text-gray-700">
                Nombres *
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="nombres"
                  name="nombres"
                  required
                  value={formData.nombres}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="apellido_p" className="block text-sm font-medium text-gray-700">
                Apellido Paterno *
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="apellido_p"
                  name="apellido_p"
                  required
                  value={formData.apellido_p}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="apellido_m" className="block text-sm font-medium text-gray-700">
                Apellido Materno
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="apellido_m"
                  name="apellido_m"
                  value={formData.apellido_m}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="tipo_documento" className="block text-sm font-medium text-gray-700">
                Tipo de Documento *
              </label>
              <select
                id="tipo_documento"
                name="tipo_documento"
                value={formData.tipo_documento}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              >
                <option value="DNI">DNI</option>
                <option value="CE">Carné de Extranjería</option>
                <option value="PASAPORTE">Pasaporte</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="nro_documento" className="block text-sm font-medium text-gray-700">
                Número de Documento *
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="nro_documento"
                  name="nro_documento"
                  required
                  value={formData.nro_documento}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="correo" className="block text-sm font-medium text-gray-700">
                Correo electrónico *
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  autoComplete="email"
                  required
                  value={formData.correo}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="contraseña" className="block text-sm font-medium text-gray-700">
                Contraseña *
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  id="contraseña"
                  name="contraseña"
                  required
                  minLength={6}
                  value={formData.contraseña}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar Contraseña *
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  minLength={6}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
                ¿Ya tienes una cuenta? Inicia sesión
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Registrarse
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
