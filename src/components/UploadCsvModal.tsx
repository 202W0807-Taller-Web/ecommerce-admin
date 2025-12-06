import React, { useState } from "react";
import ModalForm from "@components/ModalForm";

type UploadCsvModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  title?: string;
  uploadFn: (file: File) => Promise<any>; // función dinámica que realiza el POST
  resourceName?: string; // nombre amigable
  onSuccess?: (result?: any) => void; // callback opcional
};

const UploadCsvModal: React.FC<UploadCsvModalProps> = ({
  isOpen,
  closeModal,
  title = "Importar desde CSV",
  uploadFn,
  resourceName,
  onSuccess,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "text/csv") {
        alert("Solo se permiten archivos CSV");
        e.target.value = "";
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      alert("Por favor seleccione un archivo CSV antes de continuar");
      return;
    }

    try {
      setIsLoading(true);
      const result = await uploadFn(file);
      alert(
        result.message ||
          `Archivo CSV de ${resourceName ?? "datos"} importado correctamente`
      );
      if (onSuccess) onSuccess(result);
      closeModal();
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.message || "Error al subir el archivo CSV");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalForm
      title={title}
      isOpen={isOpen}
      closeModal={closeModal}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="csvFile" className="text-sm font-medium text-gray-700">
          Seleccione un archivo CSV:
        </label>
        <input
          type="file"
          id="csvFile"
          accept=".csv"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary1"
        />
        {file && (
          <p className="text-xs text-gray-500 mt-1">
            Archivo seleccionado: <strong>{file.name}</strong>
          </p>
        )}
      </div>
    </ModalForm>
  );
};

export default UploadCsvModal;
