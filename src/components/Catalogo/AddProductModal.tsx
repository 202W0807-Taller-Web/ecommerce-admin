import React, { useState, useEffect } from "react";
import { useAtributoValores } from "@hooks/catalogo/useAtributoValores";

interface AtributoValor {
  id: number;
  nombreAtributo: string;
  valor: string;
}

interface AddProductModalProps {
  onClose: () => void;
  onAdd: (formData: FormData) => Promise<any> | void;
  onNotify?: (message: { type: "success" | "error" | "info"; text: string }) => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ onClose, onAdd, onNotify }) => {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState("Ningún archivo seleccionado");
  const [image, setImage] = useState<File | null>(null);
  const [atributosSeleccionados, setAtributosSeleccionados] = useState<
    Record<string, string>
  >({});
  const [submitting, setSubmitting] = useState(false);

  const { data: atributos, loading, error } = useAtributoValores();

  useEffect(() => {
    if (atributos) {
      console.log("Atributos recibidos desde el hook:", atributos);
    }
  }, [atributos]);

  const handleFileChange = (file: File | null) => {
    setImage(file);
    setFileName(file ? file.name : "Ningún archivo seleccionado");
  };

  const handleAtributoChange = (nombreAtributo: string, valorId: string) => {
    setAtributosSeleccionados((prev) => ({
      ...prev,
      [nombreAtributo]: valorId,
    }));
  };

  const handleSubmit = async () => {
    // validation -> usar notificación en lugar de alert
    if (!name || !categoryId || !description) {
      onNotify?.({ type: "error", text: "Por favor complete todos los campos obligatorios." });
      return;
    }

    const formData = new FormData();
    formData.append("Nombre", name);
    formData.append("Descripcion", description);
    formData.append("IdsCategorias[0]", categoryId);

    Object.values(atributosSeleccionados)
      .filter((v) => v)
      .forEach((id, index) => {
        formData.append(`IdsAtributos[${index}]`, id);
      });

    if (image) {
      formData.append("Imagenes", image);
    }

    try {
      setSubmitting(true);
      const result = await onAdd(formData);
      // notificar éxito si el padre no lo hace (o adicionalmente)
      onNotify?.({ type: "success", text: "Producto agregado correctamente." });
      onClose();
      return result;
    } catch (err) {
      console.error("Error agregando producto:", err);
      onNotify?.({ type: "error", text: "Hubo un error al agregar el producto." });
    } finally {
      setSubmitting(false);
    }
  };

  const atributosAgrupados: Record<string, AtributoValor[]> =
    Array.isArray(atributos)
      ? (atributos as AtributoValor[]).reduce((acc, curr) => {
          const nombre = curr.nombreAtributo || "Otros";
          if (!acc[nombre]) acc[nombre] = [];
          acc[nombre].push(curr);
          return acc;
        }, {} as Record<string, AtributoValor[]>)
      : {};

  const categorias = atributos?.filter((a) => a.nombreAtributo === "Categoría");

  const atributosPermitidos = ["Género", "Deporte", "Tipo", "Colección"];
  const atributosFiltrados = Object.entries(atributosAgrupados).filter(([nombre]) =>
    atributosPermitidos.includes(nombre)
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg">
        <h3 className="text-center font-semibold text-lg text-[var(--color-primary6)] mb-4">
          Agregar nuevo producto
        </h3>

        {/* Nombre */}
        <div>
          <label className="block text-[var(--color-primary6)] mb-1">Nombre:</label>
          <input
            type="text"
            placeholder="Ingrese el nombre del producto"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary1)]"
          />
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-[var(--color-primary6)] mb-1">Categoría:</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary1)]"
            disabled={loading}
          >
            <option value="">Seleccione una categoría</option>
            {categorias?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.valor}
              </option>
            ))}
          </select>
          {error && <span className="text-red-500 text-sm">Error al cargar categorías.</span>}
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-[var(--color-primary6)] mb-1">Descripción:</label>
          <textarea
            placeholder="Ingrese la descripción del producto"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary1)]"
            rows={3}
          />
        </div>

        {/* Atributos dinámicos */}
        <div className="grid grid-cols-2 gap-4">
          {atributosFiltrados.map(([nombre, valores]) => (
            <div key={nombre}>
              <label className="block text-[var(--color-primary6)] mb-1">{nombre}:</label>
              <select
                value={atributosSeleccionados[nombre] || ""}
                onChange={(e) => handleAtributoChange(nombre, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary1)]"
              >
                <option value="">{`Seleccione ${nombre.toLowerCase()}`}</option>
                {valores.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.valor}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* Imagen */}
        <div>
          <label className="block text-[var(--color-primary6)] mb-1 mt-2">Subir imagen:</label>
          <div className="flex items-center gap-3 whitespace-nowrap overflow-hidden">
            <input
              type="file"
              id="file-upload"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer px-4 py-2 border border-gray-400 bg-gray-200 text-[var(--color-primary6)] rounded-md hover:bg-gray-300 transition flex-shrink-0"
            >
              Seleccionar archivo
            </label>
            <span className="text-sm text-gray-600 truncate">{fileName}</span>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-center gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-400 rounded-md bg-gray-200 hover:bg-gray-300 transition"
            type="button"
            disabled={submitting}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[var(--color-primary1)] text-white rounded-md hover:bg-[var(--color-primary2)] transition"
            type="button"
            disabled={submitting}
          >
            {submitting ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
