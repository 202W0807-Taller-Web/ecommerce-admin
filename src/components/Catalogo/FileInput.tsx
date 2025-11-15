import { useState, type ChangeEventHandler } from "react";

interface FileInputProps {
  label: string;
  onChange: (file: File | null) => void;
}

export default function FileInput({ label, onChange }: FileInputProps) {
  const [fileName, setFileName] = useState("Ningún archivo seleccionado");

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0] || null;
    setFileName(file ? file.name : "Ningún archivo seleccionado");
    onChange(file);
  };

  return (
    <div className="col-span-full flex items-center gap-3 overflow-hidden">
      <label className="text-gray-700 font-medium flex-shrink-0">
        {label}
      </label>

      <div className="flex items-center gap-3 flex-1 min-w-0">
        <label
          htmlFor="file-upload"
          className="bg-[var(--color-primary1)] text-white px-4 py-1.5 rounded-md text-sm font-medium cursor-pointer hover:bg-[var(--color-primary2)] transition-colors"
        >
          Seleccionar archivo
        </label>

        <input
          id="file-upload"
          type="file"
          onChange={handleFileChange}
          className="hidden"
        />

        <span className="text-sm text-gray-600 truncate flex-1">
          {fileName}
        </span>
      </div>
    </div>
  );
}
