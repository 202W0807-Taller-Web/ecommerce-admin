import { useState } from "react";
import { User, Bell, Shield, Palette, Globe, HelpCircle } from "lucide-react";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Perfil", icon: <User className="w-4 h-4" /> },
    { id: "notifications", label: "Notificaciones", icon: <Bell className="w-4 h-4" /> },
    { id: "security", label: "Seguridad", icon: <Shield className="w-4 h-4" /> },
    { id: "appearance", label: "Apariencia", icon: <Palette className="w-4 h-4" /> },
    { id: "language", label: "Idioma", icon: <Globe className="w-4 h-4" /> },
    { id: "help", label: "Ayuda", icon: <HelpCircle className="w-4 h-4" /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Información del Perfil</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombres</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c4a44c]"
                  placeholder="Tus nombres"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Apellido Paterno</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c4a44c]"
                  placeholder="Apellido paterno"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Apellido Materno</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c4a44c]"
                  placeholder="Apellido materno"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c4a44c]"
                  placeholder="tu@email.com"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button className="px-4 py-2 bg-[#c4a44c] text-white rounded-md hover:bg-[#b09344] transition-colors">
                Guardar Cambios
              </button>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Preferencias de Notificación</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-800">Notificaciones por Email</h4>
                  <p className="text-sm text-gray-600">Recibir actualizaciones importantes por correo</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#c4a44c]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#c4a44c]"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-800">Notificaciones del Sistema</h4>
                  <p className="text-sm text-gray-600">Alertas y notificaciones dentro del sistema</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#c4a44c]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#c4a44c]"></div>
                </label>
              </div>
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Configuración de Seguridad</h3>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-4">Cambiar Contraseña</h4>
                <div className="space-y-3">
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c4a44c]"
                    placeholder="Contraseña actual"
                  />
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c4a44c]"
                    placeholder="Nueva contraseña"
                  />
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c4a44c]"
                    placeholder="Confirmar nueva contraseña"
                  />
                </div>
                <button className="mt-4 px-4 py-2 bg-[#c4a44c] text-white rounded-md hover:bg-[#b09344] transition-colors">
                  Actualizar Contraseña
                </button>
              </div>
            </div>
          </div>
        );

      case "appearance":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Apariencia</h3>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-4">Tema</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="theme" className="mr-2 text-[#c4a44c] focus:ring-[#c4a44c]" defaultChecked />
                    <span className="text-gray-700">Claro</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="theme" className="mr-2 text-[#c4a44c] focus:ring-[#c4a44c]" />
                    <span className="text-gray-700">Oscuro</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="theme" className="mr-2 text-[#c4a44c] focus:ring-[#c4a44c]" />
                    <span className="text-gray-700">Automático</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case "language":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Idioma y Región</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Idioma</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c4a44c]">
                  <option>Español</option>
                  <option>Inglés</option>
                  <option>Portugués</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Zona Horaria</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c4a44c]">
                  <option>America/Lima (UTC-5)</option>
                  <option>America/Mexico_City (UTC-6)</option>
                  <option>America/Argentina/Buenos_Aires (UTC-3)</option>
                </select>
              </div>
            </div>
          </div>
        );

      case "help":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Ayuda y Soporte</h3>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Centro de Ayuda</h4>
                <p className="text-sm text-gray-600 mb-3">Encuentra respuestas a preguntas frecuentes y guías de uso.</p>
                <button className="text-[#c4a44c] hover:text-[#b09344] text-sm font-medium">Visitar Centro de Ayuda</button>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Contactar Soporte</h4>
                <p className="text-sm text-gray-600 mb-3">¿Necesitas ayuda adicional? Contáctanos directamente.</p>
                <button className="text-[#c4a44c] hover:text-[#b09344] text-sm font-medium">Enviar Mensaje</button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full bg-gray-100 p-8 overflow-auto">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <div className="px-6 py-4">
              <h1 className="text-2xl font-bold text-gray-900">Configuraciones</h1>
              <p className="text-gray-600">Gestiona tu cuenta y preferencias</p>
            </div>
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-[#c4a44c] text-[#c4a44c]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.icon}
                  <span className="ml-2">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
          <div className="px-6 py-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
