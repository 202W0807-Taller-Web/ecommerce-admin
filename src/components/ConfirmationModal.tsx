import React from 'react';
import { AlertTriangle } from 'lucide-react';

// Definimos las propiedades que nuestro modal recibirá
interface ConfirmationModalProps {
  isOpen: boolean; // Controla si el modal está visible o no
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  // Si el modal no debe estar abierto, no renderizamos nada
  if (!isOpen) {
    return null;
  }

  return (
    // Fondo oscuro semi-transparente (Overlay)
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onClick={onClose} // Cierra el modal si se hace clic fuera
    >
      {/* Contenedor del Modal */}
      <div
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
        onClick={e => e.stopPropagation()} // Evita que el clic dentro lo cierre
      >
        <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="text-sm text-gray-600 mt-1">{message}</p>
            </div>
        </div>
        
        {/* Botones de Acción */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Denegar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-semibold bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;