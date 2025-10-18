// components/catalogo/CrearProductoForm.tsx
import React, { useState, useRef } from "react";
import { useCreateProducto} from "../../hooks/catalogo/useProductos";
import type { Producto } from "../../types/catalogo/Productos";

export default function CrearProductoForm({
  onSuccess,
}: {
  onSuccess?: (producto: Producto) => void;
}) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [archivos, setArchivos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { postData: crear, loading, error, data } = useCreateProducto();

  // manejar selección de archivos
  const handleFilesChange = (filesList: FileList | null) => {
    if (!filesList) return;
    const arr = Array.from(filesList);
    setArchivos(arr);

    // generar previews (URL temporales)
    const urls = arr.map((f) => URL.createObjectURL(f));
    // limpiarUrls anteriores
    previews.forEach((u) => URL.revokeObjectURL(u));
    setPreviews(urls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim() || !descripcion.trim()) {
      alert("Nombre y descripción son requeridos");
      return;
    }

    const fd = new FormData();
    fd.append("nombre", nombre);
    fd.append("descripcion", descripcion);

    // importa que el backend espere "imagenes" como nombre de campo
    archivos.forEach((file) => {
      fd.append("imagenes", file);
    });

    try {
      const producto = await crear(fd);
      if (producto) {
        // limpiar form
        setNombre("");
        setDescripcion("");
        setArchivos([]);
        previews.forEach((u) => URL.revokeObjectURL(u));
        setPreviews([]);

        if (fileInputRef.current) fileInputRef.current.value = "";

        if (onSuccess) onSuccess(producto);
        else alert("Producto creado correctamente");
      }
    } catch (err) {
      // usePostData ya setea error, pero por si acaso:
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-md space-y-6"
    >
      <h2 className="text-2xl font-semibold">Crear producto</h2>

      <div>
        <label className="block text-sm font-medium mb-1">Nombre</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-1"
          placeholder="Nombre del producto"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Descripción</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-1"
          rows={4}
          placeholder="Descripción"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Imágenes</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFilesChange(e.target.files)}
          className="block w-full"
        />
        <p className="text-xs text-gray-500 mt-1">
          Puedes subir varias imágenes. Se enviarán como campo <code>imagenes</code>.
        </p>

        {previews.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-3">
            {previews.map((src, idx) => (
              <div
                key={idx}
                className="relative rounded-lg overflow-hidden border p-1 bg-gray-50"
              >
                <img
                  src={src}
                  alt={`preview-${idx}`}
                  className="object-cover w-full h-32"
                />
                <button
                  type="button"
                  onClick={() => {
                    // eliminar archivo idx
                    const newFiles = archivos.filter((_, i) => i !== idx);
                    setArchivos(newFiles);

                    const newPreviews = previews.filter((_, i) => i !== idx);
                    URL.revokeObjectURL(previews[idx]);
                    setPreviews(newPreviews);
                    // limpiar input file (si quieres soporte robusto: reconstruir DataTransfer)
                    if (fileInputRef.current) {
                      // reconstruir FileList si es necesario (simple: clear input and re-add via DataTransfer)
                      const dt = new DataTransfer();
                      newFiles.forEach((f) => dt.items.add(f));
                      fileInputRef.current.files = dt.files;
                    }
                  }}
                  className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-3">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:opacity-95 disabled:opacity-50"
        >
          {loading ? "Subiendo..." : "Crear producto"}
        </button>

        {data && (
          <p className="text-sm text-green-600">Producto creado: {data.nombre}</p>
        )}

        {error && <p className="text-sm text-red-600">Error: {error}</p>}
      </div>
    </form>
  );
}
