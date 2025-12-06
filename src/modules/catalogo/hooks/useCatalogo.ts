import { useQuery } from '@tanstack/react-query';
import { getProductos, getProductoById, getProductosSimplificados } from '../api/productos';

// Query Keys
export const catalogoKeys = {
  all: ['catalogo'] as const,
  productos: () => [...catalogoKeys.all, 'productos'] as const,
  producto: (id: number) => [...catalogoKeys.all, 'producto', id] as const,
  productosSimplificados: () => [...catalogoKeys.all, 'productos-simplificados'] as const,
};

/**
 * Hook para obtener todos los productos del catálogo
 */
export const useProductos = () => {
  return useQuery({
    queryKey: catalogoKeys.productos(),
    queryFn: getProductos,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para obtener un producto específico
 */
export const useProducto = (id: number) => {
  return useQuery({
    queryKey: catalogoKeys.producto(id),
    queryFn: () => getProductoById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook para obtener productos en formato simplificado
 * Ideal para usar en selects, modales de búsqueda, etc.
 */
export const useProductosSimplificados = () => {
  return useQuery({
    queryKey: catalogoKeys.productosSimplificados(),
    queryFn: getProductosSimplificados,
    staleTime: 5 * 60 * 1000,
  });
};
