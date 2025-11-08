// components/catalogo/CrearProductoForm.tsx
import React, { useRef, useState, useEffect } from "react";
import { useCreateProducto } from "@hooks/catalogo/useProductos";

export default function CrearProductoForm({ onSuccess }: { onSuccess?: (p: any) => void }) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [archivos, setArchivos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { postData: crear, loading } = useCreateProducto();

  useEffect(() => {
    return () => previews.forEach((u) => URL.revokeObjectURL(u));
  }, [previews]);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    setArchivos(arr);
    setPreviews(arr.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async () => {
    const fd = new FormData();
    fd.append("Nombre", nombre);
    fd.append("Descripcion", descripcion);
    archivos.forEach((f) => fd.append("NuevasImagenesArchivos", f));
    const res = await crear(fd);
    if (onSuccess) onSuccess(res);
  };

  return (
    <div className="bg-[var(--color-base)] p-4 rounded-lg shadow">
      <label className="block text-sm text-[var(--color-primary6)]">Nombre</label>
      <input value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full p-3 rounded border border-[var(--color-primary5)] mb-3 text-[var(--color-primary6)]" />

      <label className="block text-sm text-[var(--color-primary6)]">Descripción</label>
      <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="w-full p-3 rounded border border-[var(--color-primary5)] mb-3 text-[var(--color-primary6)]" rows={4} />

      <label className="block text-sm text-[var(--color-primary6)]">Imágenes</label>
      <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={(e) => handleFiles(e.target.files)} className="w-full mb-3 text-[var(--color-primary6)]" />

      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          {previews.map((src, i) => (
            <img key={i} src={src} className="w-full h-24 object-cover rounded" alt={`preview-${i}`} />
          ))}
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button onClick={handleSubmit} disabled={loading} className="px-4 py-2 rounded-md text-[var(--color-base)] bg-[var(--color-primary1)] hover:bg-[var(--color-primary2)]">
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </div>
  );
}
