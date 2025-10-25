import React from "react";

interface ConfirmDeleteModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  onClose,
  onConfirm,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[400px] text-center">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          ¿Seguro que desea eliminar esta variante?
        </h3>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Sí
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
