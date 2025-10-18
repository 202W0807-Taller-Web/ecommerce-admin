import { useState, useEffect } from "react";
import { useAtributoValores } from "@hooks/catalogo/useAtributoValores";

type AddProductModalProps = {
  onClose: () => void;
  onAdd: (formData: FormData) => void;
};

export default function AddProductModal({ onClose, onAdd }: AddProductModalProps) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState("Ningún archivo seleccionado");
  const [image, setImage] = useState<File | null>(null);
  const [atributosSeleccionados, setAtributosSeleccionados] = useState<Record<string, string>>({});

  const { data: atributos, loading, error } = useAtributoValores();

  useEffect(() => {
    console.log("🧠 Atributos recibidos desde el hook:", atributos);
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

  const handleSubmit = () => {
    if (!name || !categoryId || !description) {
      alert("Por favor complete todos los campos obligatorios.");
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

    if (image) formData.append("Imagenes", image);

    onAdd(formData);
    onClose();
  };

  const atributosAgrupados =
    atributos?.reduce((acc: any, curr: any) => {
      const nombre = curr.nombreAtributo || "Otros";
      if (!acc[nombre]) acc[nombre] = [];
      acc[nombre].push(curr);
      return acc;
    }, {}) || {};

  const categorias = atributos?.filter((a: any) => a.nombreAtributo === "Categoría");
  const atributosPermitidos = ["Género", "Deporte", "Tipo", "Colección"];
  const atributosFiltrados = Object.entries(atributosAgrupados).filter(([nombre]) =>
    atributosPermitidos.includes(nombre)
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: 24,
          borderRadius: 10,
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 15,
          minWidth: 520,
          maxWidth: 700,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <h3
          style={{
            textAlign: "center",
            fontWeight: 600,
            fontSize: "1.2rem",
            color: "#333",
          }}
        >
          Agregar nuevo producto
        </h3>

        {/* Nombre */}
        <div>
          <label className="block text-gray-800 mb-1">Nombre:</label>
          <input
            type="text"
            placeholder="Ingrese el nombre del producto"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
          />
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-gray-800 mb-1">Categoría:</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-800"
            disabled={loading}
          >
            <option value="">Seleccione una categoría</option>
            {categorias?.map((cat: any) => (
              <option key={cat.id} value={cat.id}>
                {cat.valor}
              </option>
            ))}
          </select>
          {error && (
            <span className="text-red-500 text-sm">
              Error al cargar categorías.
            </span>
          )}
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-gray-800 mb-1">Descripción:</label>
          <textarea
            placeholder="Ingrese la descripción del producto"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
            rows={3}
          />
        </div>

        {/* Atributos adicionales */}

          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            {atributosFiltrados.map(([nombre, valores]: any) => (
              <div key={nombre}>
                <label className="block text-gray-800 mb-1">{nombre}:</label>
                <select
                  value={atributosSeleccionados[nombre] || ""}
                  onChange={(e) => handleAtributoChange(nombre, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-800"
                >
                  <option value="">{`Seleccione ${nombre.toLowerCase()}`}</option>
                  {valores.map((v: any) => (
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
          <label className="block text-gray-800 mb-1">Subir imagen:</label>
          <div className="flex items-center gap-3 whitespace-nowrap overflow-hidden">
            <input
              type="file"
              id="file-upload"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer px-4 py-2 border border-gray-400 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition flex-shrink-0"
            >
              Seleccionar archivo
            </label>
            <span className="text-sm text-gray-600 truncate block overflow-hidden text-ellipsis">
              {fileName}
            </span>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-center gap-3 mt-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-400 rounded-md bg-gray-200 hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
