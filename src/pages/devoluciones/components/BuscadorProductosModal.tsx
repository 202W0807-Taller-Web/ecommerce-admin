import { useState, useEffect } from 'react';
import { X, Search, Package, ChevronLeft, ChevronRight } from 'lucide-react';

interface Producto {
  producto_id: number;
  nombre_producto: string;
  cantidad: number;
  precio_unitario: number;
  imagen?: string;
}

interface BuscadorProductosModalProps {
  isOpen: boolean;
  onClose: () => void;
  productos: Producto[];
  onSelectProducto: (producto: Producto) => void;
  productosSeleccionados?: number[]; // IDs de productos ya seleccionados
}

export default function BuscadorProductosModal({
  isOpen,
  onClose,
  productos,
  onSelectProducto,
  productosSeleccionados = [],
}: BuscadorProductosModalProps) {
  const [busqueda, setBusqueda] = useState('');
  const [productosFiltrados, setProductosFiltrados] = useState<Producto[]>(productos);
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 5;

  useEffect(() => {
    if (!busqueda.trim()) {
      setProductosFiltrados(productos);
    } else {
      const filtrados = productos.filter((producto) => {
        const searchLower = busqueda.toLowerCase();
        return (
          producto.nombre_producto.toLowerCase().includes(searchLower) ||
          producto.producto_id.toString().includes(searchLower)
        );
      });
      setProductosFiltrados(filtrados);
    }
    setPaginaActual(1); // Resetear a la primera página al buscar
  }, [busqueda, productos]);

  // Calcular productos de la página actual
  const indexInicio = (paginaActual - 1) * productosPorPagina;
  const indexFin = indexInicio + productosPorPagina;
  const productosPaginados = productosFiltrados.slice(indexInicio, indexFin);
  const totalPaginas = Math.max(1, Math.ceil(productosFiltrados.length / productosPorPagina));

  const handleSelectProducto = (producto: Producto) => {
    onSelectProducto(producto);
    setBusqueda('');
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Buscar Producto
              </h2>
              <p className="text-sm text-gray-500">
                Selecciona un producto de la orden
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre o ID del producto..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          </div>
          {busqueda && (
            <p className="mt-2 text-sm text-gray-600">
              {productosFiltrados.length} resultado(s) encontrado(s)
            </p>
          )}
        </div>

        {/* Products List */}
        <div className="flex-1 overflow-y-auto p-4">
          {productosFiltrados.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Package className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-lg font-medium">No se encontraron productos</p>
              <p className="text-sm">Intenta con otro término de búsqueda</p>
            </div>
          ) : (
            <div className="space-y-2">
              {productosPaginados.map((producto) => {
                const yaSeleccionado = productosSeleccionados.includes(
                  producto.producto_id
                );

                return (
                  <button
                    key={producto.producto_id}
                    onClick={() => !yaSeleccionado && handleSelectProducto(producto)}
                    disabled={yaSeleccionado}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      yaSeleccionado
                        ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                        : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Product Image or Placeholder */}
                      <div className="flex-shrink-0">
                        {producto.imagen ? (
                          <img
                            src={producto.imagen}
                            alt={producto.nombre_producto}
                            className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                            <Package className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {producto.nombre_producto}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              ID: {producto.producto_id}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-bold text-gray-900">
                              S/. {producto.precio_unitario.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500">
                              Cant: {producto.cantidad}
                            </p>
                          </div>
                        </div>

                        {yaSeleccionado && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                              Ya seleccionado
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination */}
        {productosFiltrados.length > productosPorPagina && (
          <div className="px-4 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Mostrando {indexInicio + 1} - {Math.min(indexFin, productosFiltrados.length)} de {productosFiltrados.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPaginaActual(prev => Math.max(1, prev - 1))}
                  disabled={paginaActual === 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium text-gray-700">
                  {paginaActual} / {totalPaginas}
                </span>
                <button
                  onClick={() => setPaginaActual(prev => Math.min(totalPaginas, prev + 1))}
                  disabled={paginaActual === totalPaginas}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              {productos.length} producto(s) en total
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
