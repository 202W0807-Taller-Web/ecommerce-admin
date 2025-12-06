import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Plus, Trash2, AlertCircle, Save, Search } from 'lucide-react';
import { getOrdenById } from '../../modules/ordenes/api/ordenes';
import { useCreateDevolucion } from '../../modules/devoluciones';
import { useProductos } from '../../modules/catalogo';
import type { CreateItemDevolucionDto, EstadoDevolucion, AccionItemDevolucion } from '../../modules/devoluciones/types/devolucion';
import BuscadorProductosModal from './components/BuscadorProductosModal';

interface ItemOrden {
  producto_id: number;
  nombre_producto: string;
  cantidad: number;
  precio_unitario: number;
}

interface OrdenDetalle {
  id: string;
  cod_orden?: string;
  customerName?: string;
  status: string;
  items: ItemOrden[];
}

interface ItemFormulario extends Omit<CreateItemDevolucionDto, 'tipo_accion'> {
  tipo_accion: string;
  productoNombre?: string;
  productoNombreNew?: string; // Nombre del producto de reemplazo
}

export default function CrearDevolucionPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const ordenId = searchParams.get('ordenId');

  const [items, setItems] = useState<ItemFormulario[]>([]);
  const [estado] = useState<EstadoDevolucion>('SOLICITADO' as EstadoDevolucion);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [itemIndexSeleccionado, setItemIndexSeleccionado] = useState<number | null>(null);

  const { data: orden, isLoading: loadingOrden } = useQuery<OrdenDetalle>({
    queryKey: ['orden', ordenId],
    queryFn: () => getOrdenById(ordenId!),
    enabled: !!ordenId,
  });

  const { mutate: crearDevolucion, isPending: creandoDevolucion } = useCreateDevolucion();
  
  // Obtener productos del catálogo para el modal
  const { data: productosCatalogo = [] } = useProductos();

  useEffect(() => {
    // Inicializar con un item vacío si no hay items
    if (items.length === 0 && orden?.items) {
      agregarItem();
    }
  }, [orden]);

  const agregarItem = () => {
    const nuevoItem: ItemFormulario = {
      producto_id_dev: 0,
      cantidad_dev: 1,
      precio_unitario_dev: 0,
      tipo_accion: 'REEMBOLSO',
      motivo: '',
    };
    setItems([...items, nuevoItem]);
  };

  const eliminarItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const actualizarItem = (index: number, campo: keyof ItemFormulario, valor: any) => {
    const nuevosItems = [...items];
    nuevosItems[index] = { ...nuevosItems[index], [campo]: valor };

    // Si se selecciona un producto, actualizar el precio automáticamente
    if (campo === 'producto_id_dev' && orden?.items) {
      const productoSeleccionado = orden.items.find((p: ItemOrden) => p.producto_id === Number(valor));
      if (productoSeleccionado) {
        nuevosItems[index].precio_unitario_dev = productoSeleccionado.precio_unitario;
        nuevosItems[index].productoNombre = productoSeleccionado.nombre_producto;
      }
    }

    setItems(nuevosItems);
  };

  const abrirModalProductos = (index: number) => {
    setItemIndexSeleccionado(index);
    setModalAbierto(true);
  };

  const handleSeleccionarProducto = (producto: any) => {
    if (itemIndexSeleccionado === null) return;

    const nuevosItems = [...items];
    nuevosItems[itemIndexSeleccionado].producto_id_new = producto.producto_id;
    nuevosItems[itemIndexSeleccionado].productoNombreNew = producto.nombre_producto;
    nuevosItems[itemIndexSeleccionado].precio_unitario_new = producto.precio_unitario;
    // Inicializar cantidad_new con 1 si no existe
    if (!nuevosItems[itemIndexSeleccionado].cantidad_new) {
      nuevosItems[itemIndexSeleccionado].cantidad_new = 1;
    }
    
    setItems(nuevosItems);
    setModalAbierto(false);
    setItemIndexSeleccionado(null);
  };

  const calcularMontoTotal = () => {
    return items.reduce((total, item) => {
      return total + (item.precio_unitario_dev * item.cantidad_dev);
    }, 0);
  };

  const validarFormulario = (): string[] => {
    const errores: string[] = [];

    if (!ordenId) {
      errores.push('No se especificó una orden');
    }

    if (items.length === 0) {
      errores.push('Debe agregar al menos un producto');
    }

    items.forEach((item, index) => {
      if (!item.producto_id_dev || item.producto_id_dev === 0) {
        errores.push(`Item ${index + 1}: Debe seleccionar un producto`);
      }
      if (!item.cantidad_dev || item.cantidad_dev <= 0) {
        errores.push(`Item ${index + 1}: La cantidad debe ser mayor a 0`);
      }
      if (!item.precio_unitario_dev || item.precio_unitario_dev <= 0) {
        errores.push(`Item ${index + 1}: El precio debe ser mayor a 0`);
      }
      if (!item.motivo || item.motivo.trim() === '') {
        errores.push(`Item ${index + 1}: Debe especificar un motivo`);
      }
      // Validar producto de reemplazo si el tipo de acción es REEMPLAZO
      if (item.tipo_accion === 'REEMPLAZO') {
        if (!item.producto_id_new || item.producto_id_new === 0) {
          errores.push(`Item ${index + 1}: Debe seleccionar un producto de reemplazo`);
        }
        if (!item.cantidad_new || item.cantidad_new <= 0) {
          errores.push(`Item ${index + 1}: La cantidad de reemplazo debe ser mayor a 0`);
        }
      }
    });

    return errores;
  };

  const handleCrearDevolucion = () => {
    const errores = validarFormulario();
    
    if (errores.length > 0) {
      alert('Por favor corrija los siguientes errores:\n\n' + errores.join('\n'));
      return;
    }

    const devolucionData = {
      orden_id: ordenId!,
      estado: estado,
      items: items.map(item => ({
        producto_id_dev: Number(item.producto_id_dev),
        cantidad_dev: Number(item.cantidad_dev),
        precio_unitario_dev: Number(item.precio_unitario_dev),
        tipo_accion: item.tipo_accion as AccionItemDevolucion,
        motivo: item.motivo,
        ...(item.producto_id_new && { producto_id_new: Number(item.producto_id_new) }),
        ...(item.cantidad_new && { cantidad_new: Number(item.cantidad_new) }),
        ...(item.precio_unitario_new && { precio_unitario_new: Number(item.precio_unitario_new) }),
      })),
    };

    crearDevolucion(devolucionData, {
      onSuccess: () => {
        alert('Devolución creada exitosamente');
        navigate('/ordenes/devoluciones');
      },
      onError: (error: any) => {
        alert(`Error al crear la devolución: ${error.message || 'Error desconocido'}`);
      },
    });
  };

  if (loadingOrden) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Cargando orden...</div>
      </div>
    );
  }

  if (!orden) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">No se encontró la orden especificada</p>
          <button
            onClick={() => navigate('/ordenes/ordenes')}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Volver a órdenes
          </button>
        </div>
      </div>
    );
  }

  const errores = validarFormulario();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Nueva Devolución</h1>
        <p className="text-gray-600 mt-2">Vista previa de la devolución antes de crearla</p>
      </div>

      {/* Información de la Orden */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Información de la Orden</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <span className="text-sm text-gray-600">Orden ID:</span>
            <p className="font-semibold">{orden.cod_orden || ordenId}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">Cliente:</span>
            <p className="font-semibold">{orden.customerName || 'N/A'}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">Estado:</span>
            <p className="font-semibold">{orden.status}</p>
          </div>
        </div>
      </div>

      {/* Productos de la Orden Disponibles */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-6">
        <h3 className="font-semibold mb-3">Productos en la Orden:</h3>
        <div className="space-y-2">
          {orden.items?.map((item: ItemOrden) => (
            <div key={item.producto_id} className="flex justify-between items-center text-sm">
              <span>
                <strong>ID {item.producto_id}:</strong> {item.nombre_producto}
              </span>
              <span className="text-gray-600">
                Cant: {item.cantidad} | S/. {item.precio_unitario.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Items de la Devolución */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Items a Devolver</h2>
          <button
            onClick={agregarItem}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Agregar Item
          </button>
        </div>

        {items.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No hay items agregados. Haga clic en "Agregar Item" para comenzar.
          </p>
        ) : (
          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold">Item {index + 1}</h3>
                  <button
                    onClick={() => eliminarItem(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Producto */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Producto *
                    </label>
                    <select
                      value={item.producto_id_dev}
                      onChange={(e) =>
                        actualizarItem(index, 'producto_id_dev', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="0">Seleccionar producto</option>
                      {orden.items?.map((p: ItemOrden) => (
                        <option key={p.producto_id} value={p.producto_id}>
                          {p.nombre_producto} (ID: {p.producto_id})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Cantidad */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cantidad *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={item.cantidad_dev}
                      onChange={(e) =>
                        actualizarItem(index, 'cantidad_dev', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Precio Unitario */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Precio Unitario *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.precio_unitario_dev}
                      onChange={(e) =>
                        actualizarItem(index, 'precio_unitario_dev', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Tipo de Acción */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Acción *
                    </label>
                    <select
                      value={item.tipo_accion}
                      onChange={(e) =>
                        actualizarItem(index, 'tipo_accion', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="REEMBOLSO">Reembolso</option>
                      <option value="REEMPLAZO">Reemplazo</option>
                      <option value="REPARACION">Reparación</option>
                    </select>
                  </div>

                  {/* Motivo */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Motivo *
                    </label>
                    <input
                      type="text"
                      value={item.motivo}
                      onChange={(e) =>
                        actualizarItem(index, 'motivo', e.target.value)
                      }
                      placeholder="Ej: Producto defectuoso, talla incorrecta, etc."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Sección de Producto de Reemplazo (solo si tipo_accion es REEMPLAZO) */}
                {item.tipo_accion === 'REEMPLAZO' && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-3">Producto de Reemplazo</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Producto de Reemplazo */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Producto de Reemplazo *
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={item.productoNombreNew || ''}
                            readOnly
                            placeholder="Haga clic en 'Buscar' para seleccionar"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                          />
                          <button
                            type="button"
                            onClick={() => abrirModalProductos(index)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            <Search className="w-4 h-4" />
                            Buscar
                          </button>
                        </div>
                        {item.producto_id_new && (
                          <p className="text-xs text-gray-600 mt-1">
                            ID: {item.producto_id_new} | Precio: S/. {item.precio_unitario_new?.toFixed(2)}
                          </p>
                        )}
                      </div>

                      {/* Cantidad de Reemplazo */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cantidad *
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={item.cantidad_new || 1}
                          onChange={(e) =>
                            actualizarItem(index, 'cantidad_new', Number(e.target.value))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Subtotal */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex justify-end">
                    <span className="text-sm font-semibold">
                      Subtotal: S/. {(item.precio_unitario_dev * item.cantidad_dev).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resumen */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Resumen de la Devolución</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-700">Total de items:</span>
            <span className="font-semibold">{items.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Estado inicial:</span>
            <span className="font-semibold">{estado}</span>
          </div>
          <div className="flex justify-between text-lg pt-2 border-t border-blue-300">
            <span className="font-bold">Monto Total:</span>
            <span className="font-bold text-blue-600">
              S/. {calcularMontoTotal().toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Errores de Validación */}
      {errores.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800 mb-2">
                Errores de validación:
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                {errores.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Acciones */}
      <div className="flex gap-4 justify-end">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          onClick={handleCrearDevolucion}
          disabled={creandoDevolucion || errores.length > 0}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5" />
          {creandoDevolucion ? 'Creando...' : 'Crear Devolución'}
        </button>
      </div>

      {/* Modal de Búsqueda de Productos */}
      <BuscadorProductosModal
        isOpen={modalAbierto}
        onClose={() => {
          setModalAbierto(false);
          setItemIndexSeleccionado(null);
        }}
        productos={productosCatalogo.map((p) => ({
          producto_id: p.id,
          nombre_producto: p.nombre,
          cantidad: p.variantes?.length || 0,
          precio_unitario: p.variantes?.[0]?.precio || 0,
          imagen: p.productoImagenes?.find(img => img.principal)?.imagen || p.productoImagenes?.[0]?.imagen || '',
        }))}
        onSelectProducto={handleSeleccionarProducto}
        productosSeleccionados={items
          .filter(item => item.producto_id_new)
          .map(item => item.producto_id_new!)}
      />
    </div>
  );
}
