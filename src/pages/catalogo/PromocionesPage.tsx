import React, { useState } from "react";
import { Pencil, Trash2, AlertTriangle } from "lucide-react";
import {
  usePromociones,
  useCreatePromocion,
  useUpdatePromocion,
  useDeletePromocion,
} from "../../hooks/promociones/usePromociones";
import type { Promocion } from "../../types/promociones/Promociones";
import Breadcrumbs from "../../components/Catalogo/Breadcrumbs";

type PromocionFormData = Omit<Promocion, "id">;

const PromocionesPage: React.FC = () => {
  const { data: promociones = [], loading, error, refetch } = usePromociones();
  const { postData: createPromocion } = useCreatePromocion();
  const { putData: updatePromocion } = useUpdatePromocion();
  const { deleteData: deletePromocion } = useDeletePromocion();

  // Estados modales
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [promoToDelete, setPromoToDelete] = useState<Promocion | null>(null);
  const [editingPromo, setEditingPromo] = useState<Promocion | null>(null);

  // Estados del formulario
  const [formData, setFormData] = useState<PromocionFormData>({
    descripcion: "",
    monto: 0,
    porcentaje: 0,
    fecha_inicio: "",
    fecha_limite: "",
  });

  const handleOpenModal = (promo?: Promocion) => {
    if (promo) {
      setEditingPromo(promo);
      setFormData({
        descripcion: promo.descripcion,
        monto: promo.monto,
        porcentaje: promo.porcentaje,
        fecha_inicio: promo.fecha_inicio,
        fecha_limite: promo.fecha_limite,
      });
    } else {
      setEditingPromo(null);
      setFormData({
        descripcion: "",
        monto: 0,
        porcentaje: 0,
        fecha_inicio: "",
        fecha_limite: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPromo(null);
  };

  const handleSavePromocion = async () => {
    try {
      if (editingPromo) {
        await updatePromocion({ id: editingPromo.id, data: formData });
      } else {
        await createPromocion(formData);
      }
      await refetch();
      handleCloseModal();
      alert(editingPromo ? "Promoción actualizada" : "Promoción creada");
    } catch (err) {
      console.error("Error guardando promoción:", err);
      alert("Error al guardar la promoción");
    }
  };

  const handleOpenDeleteModal = (promo: Promocion) => {
    setPromoToDelete(promo);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!promoToDelete) return;
    try {
      await deletePromocion(promoToDelete.id);
      await refetch();
      setShowDeleteModal(false);
      setPromoToDelete(null);
      alert("Promoción eliminada");
    } catch (err) {
      console.error("Error eliminando promoción:", err);
      alert("Error al eliminar la promoción");
      setShowDeleteModal(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("es-ES");
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <Breadcrumbs items={[{ label: "Promociones" }]} />

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2 text-[#363636]">
          Gestión de Promociones
        </h2>
      </div>

      <div className="mb-6 flex justify-end">
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-[#C0A648] text-white rounded-lg hover:bg-[#968751] transition-colors"
        >
          + Agregar Promoción
        </button>
      </div>

      {loading && <p className="text-gray-500">Cargando promociones...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {!loading && !error && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden bg-white">
            <thead className="bg-gray-100 text-gray-700 text-left">
              <tr>
                <th className="p-3">Descripción</th>
                <th className="p-3">Monto</th>
                <th className="p-3">Porcentaje</th>
                <th className="p-3">Inicio</th>
                <th className="p-3">Límite</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {promociones && promociones.length > 0 ? (
                promociones.map((promo) => (
                  <tr
                    key={promo.id}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="p-3">{promo.descripcion}</td>
                    <td className="p-3">S/ {promo.monto.toFixed(2)}</td>
                    <td className="p-3">{promo.porcentaje}%</td>
                    <td className="p-3">{formatDate(promo.fecha_inicio)}</td>
                    <td className="p-3">{formatDate(promo.fecha_limite)}</td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleOpenModal(promo)}
                          className="p-2 rounded-lg hover:bg-gray-200 transition text-gray-600 hover:text-gray-800"
                          title="Editar promoción"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(promo)}
                          className="p-2 rounded-lg hover:bg-gray-200 transition text-red-600 hover:text-red-800"
                          title="Eliminar promoción"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-500 italic">
                    No hay promociones disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-[#363636] mb-4">
              {editingPromo ? "Editar Promoción" : "Nueva Promoción"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#363636] mb-1">
                  Descripción
                </label>
                <input
                  type="text"
                  value={formData.descripcion}
                  onChange={(e) =>
                    setFormData({ ...formData, descripcion: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C0A648]"
                  placeholder="Ej: Descuento por mayor"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-[#363636] mb-1">
                    Monto (S/)
                  </label>
                  <input
                    type="number"
                    value={formData.monto}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        monto: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C0A648]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#363636] mb-1">
                    Porcentaje (%)
                  </label>
                  <input
                    type="number"
                    value={formData.porcentaje}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        porcentaje: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C0A648]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#363636] mb-1">
                  Fecha de Inicio
                </label>
                <input
                  type="datetime-local"
                  value={formData.fecha_inicio.substring(0, 16)}
                  onChange={(e) => {
                    const dt = new Date(e.target.value);
                    setFormData({
                      ...formData,
                      fecha_inicio: dt.toISOString(),
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C0A648]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#363636] mb-1">
                  Fecha de Límite
                </label>
                <input
                  type="datetime-local"
                  value={formData.fecha_limite.substring(0, 16)}
                  onChange={(e) => {
                    const dt = new Date(e.target.value);
                    setFormData({
                      ...formData,
                      fecha_limite: dt.toISOString(),
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C0A648]"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6 justify-end">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-200 text-[#363636] rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSavePromocion}
                className="px-4 py-2 bg-[#C0A648] text-white rounded-lg hover:bg-[#968751] transition-colors"
              >
                {editingPromo ? "Actualizar" : "Crear"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#363636] mb-2">
                  Eliminar Promoción
                </h3>
                <p className="text-gray-600 text-sm">
                  ¿Estás seguro de eliminar esta promoción? Esta acción no se
                  puede deshacer.
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-6 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 text-[#363636] rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromocionesPage;
