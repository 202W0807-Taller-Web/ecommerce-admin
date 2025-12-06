import React, { useRef, useState, useCallback } from "react";

type InputFileProps = {
  label?: string;
  name?: string;
  maxFiles?: number;
  accept?: string;
  value?: string[]; // dataURLs for preview (optional)
  // onFilesChange provides both File[] and the generated data URLs for preview
  onFilesChange?: (files: File[], dataUrls: string[]) => void;
};

const InputFile: React.FC<InputFileProps> = ({
  label,
  name,
  maxFiles = 1,
  accept = "image/*",
  value = [],
  onFilesChange,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previews, setPreviews] = useState<string[]>(value || []);
  const [isDrag, setIsDrag] = useState(false);

  const readFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files).slice(0, maxFiles);
    const readers = fileArray.map((file) => {
      return new Promise<string | null>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((results) => {
      const imgs = results.filter((r): r is string => !!r).slice(0, maxFiles);
      setPreviews(imgs);
      if (onFilesChange) onFilesChange(fileArray, imgs);
    });
  }, [maxFiles, onFilesChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    readFiles(e.target.files);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDrag(false);
    if (!e.dataTransfer.files) return;
    readFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDrag(true);
  };

  const handleDragLeave = () => setIsDrag(false);

  const handleRemove = (index: number) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    // Note: we don't update files input value here; parent can re-open dialog to pick
    if (onFilesChange) onFilesChange([], newPreviews);
  };

  return (
    <div className="w-full">
      {label && <label className="mb-[8px] block text-base font-medium text-dark">{label}</label>}

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`flex flex-col items-center justify-center border-2 rounded-md p-4 transition-colors ${isDrag ? 'border-primary3 bg-primary1/10' : 'border-dashed border-gray-300 bg-white'}`}
        style={{ minHeight: 120 }}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept={accept}
          multiple={maxFiles > 1}
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="text-center text-sm text-gray-600">
          <p>Arrastra y suelta aquí o haz click para seleccionar</p>
          <p className="text-xs text-gray-400">{maxFiles > 1 ? `Puedes seleccionar hasta ${maxFiles} archivos` : "Sólo 1 imagen"}</p>
        </div>

        {previews.length > 0 && (
          <div className="mt-3 grid grid-cols-4 gap-2 w-full">
            {previews.map((p, idx) => (
              <div key={idx} className="relative">
                <img src={p} alt={`preview-${idx}`} className="w-20 h-20 object-cover rounded-md" />
                <button type="button" onClick={(e) => { e.stopPropagation(); handleRemove(idx); }} className="absolute top-0 right-0 bg-white rounded-full p-1 text-xs shadow">×</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InputFile;
