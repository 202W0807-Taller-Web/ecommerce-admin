import React from "react";
import { X } from "lucide-react";
import Button from "./Button";

interface ModalFormProps {
  title: string;
  children?: React.ReactNode;
  isOpen: boolean;
  closeModal: () => void;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  isLoading?: boolean;
}

const ModalForm: React.FC<ModalFormProps> = ({
  title,
  children,
  isOpen,
  closeModal,
  onSubmit,
  isLoading,
}) => {
  const handleModalContainerClick = (e: React.MouseEvent<HTMLDivElement>) =>
    e.stopPropagation();

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#000000b3] backdrop-blur-sm transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={closeModal}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-xl mx-4 relative flex flex-col max-h-[90vh] overflow-y-auto"
        onClick={handleModalContainerClick}
      >
        <button
          className="cursor-pointer absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
          onClick={closeModal}
        >
          <X />
        </button>
        {/* Titulo */}
        <div className="flex flex-col items-center mt-6 mb-4 px-6">
          <h2 className="text-xl font-bold text-center">{title}</h2>
          <div className="w-25 h-[3px] bg-primary3 mt-2 rounded-full" />
        </div>
        {/* Formulario */}
        <form onSubmit={onSubmit} className="px-6">
          <fieldset disabled={isLoading} className="flex flex-col gap-6 pb-6">
            {children}
            <div className="flex justify-center gap-4 pb-6">
              <Button
                text="Cancelar"
                variant="outline"
                onClick={closeModal}
                type="button"
              />
              <Button text="Aceptar" variant="primary" type="submit" />
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default ModalForm;
