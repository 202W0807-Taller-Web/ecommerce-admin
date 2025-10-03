import React from "react";

interface ModalProps {
    open: boolean;
    title: string;
    children?: React.ReactNode;
    onCancel: () => void;
    onAccept: () => void;
    cancelText?: string;
    acceptText?: string;
}

const Modal: React.FC<ModalProps> = ({
    open,
    title,
    children,
    onCancel,
    onAccept,
    cancelText = "Cancelar",
    acceptText = "Aceptar",
}) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000b3] bg-opacity-40 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-xl mx-4 relative flex flex-col">
                {/* Botón cerrar */}
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
                    onClick={onCancel}
                    aria-label="Cerrar"
                >
                    ×
                </button>
                {/* Título */}
                <h2 className="text-xl font-bold text-center mt-6 mb-4">{title}</h2>
                {/* Contenido */}
                <div className="px-6 pb-6">{children}</div>
                {/* Botones */}
                <div className="flex justify-center gap-4 pb-6">
                    <button
                        className="px-6 py-2 rounded bg-gray-200 text-gray-700 font-medium hover:bg-gray-300"
                        onClick={onCancel}
                    >
                        {cancelText}
                    </button>
                    <button
                        className="px-6 py-2 rounded bg-primary1 text-white font-medium hover:bg-primary3"
                        onClick={onAccept}
                    >
                        {acceptText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
