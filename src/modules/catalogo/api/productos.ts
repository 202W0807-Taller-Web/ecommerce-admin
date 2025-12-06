import API_CATALOGO from "./api";
import type { Producto, ProductoSimplificado } from "../types/producto";

/**
 * Obtiene todos los productos del catálogo
 */
export const getProductos = async (): Promise<Producto[]> => {
  const { data } = await API_CATALOGO.get<Producto[]>("/productos");
  return data;
};

/**
 * Obtiene un producto específico por ID
 */
export const getProductoById = async (id: number): Promise<Producto> => {
  const { data } = await API_CATALOGO.get<Producto>(`/productos/${id}`);
  return data;
};

/**
 * Transforma un producto del catálogo a formato simplificado
 */
export const transformarProductoSimplificado = (producto: Producto): ProductoSimplificado => {
  const imagenPrincipal = producto.productoImagenes?.find(img => img.principal)?.imagen || 
                         producto.productoImagenes?.[0]?.imagen || '';
  
  const precioBase = producto.variantes?.[0]?.precio || 0;
  const cantidadVariantes = producto.variantes?.length || 0;

  return {
    id: producto.id,
    nombre: producto.nombre,
    descripcion: producto.descripcion,
    imagenPrincipal,
    precioBase,
    cantidadVariantes,
    variantes: producto.variantes || [],
  };
};

/**
 * Obtiene productos simplificados para uso en formularios
 */
export const getProductosSimplificados = async (): Promise<ProductoSimplificado[]> => {
  const productos = await getProductos();
  return productos.map(transformarProductoSimplificado);
};
