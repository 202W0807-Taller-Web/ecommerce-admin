// src/components/TestPromociones.tsx
import React, { useEffect } from "react";
import {
  usePromociones,
  usePromocionById,
  useCreatePromocion,
  useUpdatePromocion,
  useDeletePromocion,
} from "../hooks/promociones/usePromociones";
import type { Promocion } from "../types/promociones/Promociones";

const TestPromociones: React.FC = () => {
  // --- Hooks GET ---
  const { data: promociones, loading: loadingPromociones } = usePromociones();

  // Tomamos el primer ID si existe
  const promoId = 17;
  const { data: promocionById } = usePromocionById(promoId);

  // --- Hooks POST / PUT / DELETE ---
  const { postData: createPromocionFn, loading: creating, error: errorCreate } = useCreatePromocion();
  const { putData: updatePromocionFn, loading: updating, error: errorUpdate } = useUpdatePromocion();
  const { deleteData: deletePromocionFn, loading: deleting, error: errorDelete, success: deleteSuccess } = useDeletePromocion();

  // --- Handlers ---
  const handleCreate = async () => {
    const newPromo: Omit<Promocion, "id"> = {
      descripcion: "Promo Test",
      monto: 50,
      porcentaje: 10,
      fecha_inicio: "2025-11-10T05:00:00+00:00",
      fecha_limite: "2025-12-01T05:00:00+00:00",
    };

    await createPromocionFn(newPromo);
  };

  const handleUpdate = async () => {
    if (!promoId) return;
    const updatedData: Omit<Promocion, "id"> = {
      descripcion: "Promo Test Actualizada",
      monto: 60,
      porcentaje: 15,
      fecha_inicio: "2025-11-11T05:00:00+00:00",
      fecha_limite: "2025-12-05T05:00:00+00:00",
    };

    await updatePromocionFn({ id: promoId, data: updatedData });
  };

  const handleDelete = async () => {
    if (!promoId) return;
    await deletePromocionFn(promoId);
  };

  // --- Logs ---
  useEffect(() => {
    if (!loadingPromociones && promociones) console.log("✅ Promociones:", promociones);
  }, [promociones, loadingPromociones]);

  useEffect(() => {
    if (promocionById) console.log(`✅ Promoción ${promoId}:`, promocionById);
  }, [promocionById, promoId]);

  useEffect(() => {
    if (errorCreate) console.error("Error Crear:", errorCreate);
  }, [errorCreate]);

  useEffect(() => {
    if (errorUpdate) console.error("Error Actualizar:", errorUpdate);
  }, [errorUpdate]);

  useEffect(() => {
    if (errorDelete) console.error("Error Eliminar:", errorDelete);
    if (deleteSuccess) console.log("✅ Eliminación exitosa");
  }, [errorDelete, deleteSuccess]);

  // --- Render ---
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Promociones</h1>
      <div className="space-x-2">
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Crear Promoción
        </button>
        <button
          onClick={handleUpdate}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Actualizar Promoción
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Eliminar Promoción
        </button>
      </div>
    </div>
  );
};

export default TestPromociones;
