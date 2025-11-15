import React, { useEffect, useRef, useState } from "react";
import type { Producto } from "../../types/catalogo/Productos";
import { buildProductoFormData, updateProducto } from "../../services/catalogo/ProductoService";
import { useAtributoValores } from "@hooks/catalogo/useAtributoValores";

export default function EditProductModal({
  producto,
  onClose,
  onUpdated,
  onNotify,
}: {
  producto: Producto;
  onClose: () => void;
  onUpdated?: (updated: Producto) => void;
  onNotify?: (message: { type: "success" | "error" | "info"; text: string }) => void;
}) {
  // campos básicos
  const [nombre, setNombre] = useState(producto.nombre || "");
  const [descripcion, setDescripcion] = useState(producto.descripcion || "");

  // imágenes
  const [existingUrls, setExistingUrls] = useState<string[]>(
    producto.productoImagenes?.map((i: any) => i.imagen) ?? []
  );
  const [archivos, setArchivos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);

  // atributos dinámicos (usar el mismo enfoque que el modal de creación)
  const { data: atributos, loading: attrsLoading } = useAtributoValores();
  // agrupamos por nombreAtributo
  const atributosAgrupados: Record<string, { id: number; valor: string }[]> =
    Array.isArray(atributos)
      ? (atributos as any[]).reduce((acc: any, curr: any) => {
          const nombre = curr.nombreAtributo || "Otros";
          if (!acc[nombre]) acc[nombre] = [];
          acc[nombre].push({ id: curr.id, valor: curr.valor });
          return acc;
        }, {})
      : {};

  // Los atributos que mostramos en el formulario (mismo filtro que en AddProductModal)
  const atributosPermitidos = ["Categoría", "Género", "Deporte", "Tipo", "Colección"];

  // estado: mapping nombreAtributo -> valorId (string)
  const [atributosSeleccionados, setAtributosSeleccionados] = useState<Record<string, string>>({});

  // Pre-seleccionar valores según producto.productoAtributos intentando casar por 'valor'
  useEffect(() => {
    if (!atributos || !Array.isArray(atributos)) return;

    const seleccionInicial: Record<string, string> = {};

    atributosPermitidos.forEach((nombre) => {
      const valoresDelAtributo = atributosAgrupados[nombre] ?? [];
      // intentar buscar en producto.productoAtributos un valor igual
      const match = (producto.productoAtributos ?? []).find((pa: any) =>
        pa.atributoValor?.valor && valoresDelAtributo.some((v) => v.valor === pa.atributoValor?.valor)
      );
      if (match?.atributoValor?.valor) {
        const found = valoresDelAtributo.find((v) => v.valor === match.atributoValor?.valor);
        if (found) seleccionInicial[nombre] = String(found.id);
      } else {
        // si no hay match, dejar cadena vacía
        seleccionInicial[nombre] = "";
      }
    });

    setAtributosSeleccionados((prev) => ({ ...seleccionInicial, ...prev }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [atributos, producto]);

  useEffect(() => {
    return () => previews.forEach((u) => URL.revokeObjectURL(u));
  }, [previews]);

  const handleFilesChange = (filesList: FileList | null) => {
    if (!filesList) return;
    const arr = Array.from(filesList);
    setArchivos((prev) => [...prev, ...arr]);
    const urls = arr.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...urls]);
  };

  const removeExistingUrl = (idx: number) => {
    setExistingUrls((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeNewFile = (idx: number) => {
    const newFiles = archivos.filter((_, i) => i !== idx);
    const newPreviews = previews.filter((_, i) => i !== idx);
    URL.revokeObjectURL(previews[idx]);
    setArchivos(newFiles);
    setPreviews(newPreviews);
    if (fileInputRef.current) {
      const dt = new DataTransfer();
      newFiles.forEach((f) => dt.items.add(f));
      fileInputRef.current.files = dt.files;
    }
  };

  const handleAtributoChange = (nombreAtributo: string, valorId: string) => {
    setAtributosSeleccionados((prev) => ({ ...prev, [nombreAtributo]: valorId }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // ids seleccionados (filtrados)
      const idsAtributosValores = Object.values(atributosSeleccionados)
        .filter((v) => v)
        .map((v) => Number(v));

      const fd = buildProductoFormData({
        Id: producto.id,
        Nombre: nombre,
        Descripcion: descripcion,
        ImagenesExistentesUrls: existingUrls,
        NuevasImagenesArchivos: archivos,
        IdsAtributosValores: idsAtributosValores,
      });

      const updated = await updateProducto(producto.id, fd);

      if (onUpdated) onUpdated(updated);
      if (onNotify) onNotify({ type: "success", text: "Producto actualizado correctamente." });
      onClose();
    } catch (err) {
      console.error("Error actualizando producto:", err);
      if (onNotify) onNotify({ type: "error", text: "Hubo un error al actualizar el producto." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white rounded-xl p-6 shadow-lg space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Editar producto</h3>
          <button type="button" onClick={onClose} className="text-gray-500">
            ✕
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full p-3 rounded-lg border"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full p-3 rounded-lg border"
            rows={4}
            required
          />
        </div>

        {/* atributos dinámicos (igual que en creación) */}
        <div className="grid grid-cols-2 gap-4">
          {atributosPermitidos.map((nombre) => {
            const valores = atributosAgrupados[nombre] ?? [];
            return (
              <div key={nombre}>
                <label className="block text-sm font-medium mb-1">{nombre}</label>
                <select
                  value={atributosSeleccionados[nombre] || ""}
                  onChange={(e) => handleAtributoChange(nombre, e.target.value)}
                  className="w-full p-3 rounded-lg border bg-white"
                  disabled={attrsLoading}
                >
                  <option value="">{`Seleccione ${nombre.toLowerCase()}`}</option>
                  {valores.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.valor}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Imágenes existentes</label>
          {existingUrls.length === 0 && <p className="text-xs text-gray-500 mb-2">No hay imágenes existentes.</p>}
          <div className="grid grid-cols-3 gap-3 mb-3">
            {existingUrls.map((url, idx) => (
              <div key={idx} className="relative rounded-lg overflow-hidden border p-1 bg-gray-50">
                <img src={url} alt={`exist-${idx}`} className="object-cover w-full h-28" />
                <button
                  type="button"
                  onClick={() => removeExistingUrl(idx)}
                  className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <label className="block text-sm font-medium mb-2">Agregar nuevas imágenes</label>
          <button>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFilesChange(e.target.files)}
                className="block w-full"
            />
          </button>
          {previews.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {previews.map((src, idx) => (
                <div key={idx} className="relative rounded-lg overflow-hidden border p-1 bg-gray-50">
                  <img src={src} alt={`preview-${idx}`} className="object-cover w-full h-28" />
                  <button
                    type="button"
                    onClick={() => removeNewFile(idx)}
                    className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-center items-center space-x-3">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-[var(--color-primary1)] text-white rounded-lg shadow disabled:opacity-50"
          >
            {loading ? "Actualizando..." : "Actualizar producto"}
          </button>

          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}