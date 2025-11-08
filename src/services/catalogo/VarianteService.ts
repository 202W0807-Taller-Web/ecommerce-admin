import { fetchUrl } from "./api";
import type { Variante } from "../../types/catalogo/Variantes";


const API_BASE_URL =
  typeof import.meta !== "undefined"
    ? import.meta.env.VITE_API_CATALOGO_URL
    : process.env.VITE_API_CATALOGO_URL;

export const getVariantesByProductoId = async (
  productoId: number
): Promise<Variante[]> => {
  try {
    const endpoint = `/api/variantes/productos/${productoId}/variantes`;
    console.log(`📡 Obteniendo variantes desde: ${endpoint}`);
    return await fetchUrl<Variante[]>(endpoint);
  } catch (err) {
    console.warn(
      "⚠️ No se pudo obtener variantes directamente, intentando desde productos..."
    );
    return await getVariantesFromProductos(productoId);
  }
};

export const getVariantesFromProductos = async (
  productoId: number
): Promise<Variante[]> => {
  const endpoint = `/api/productos`;
  console.log(`📡 Obteniendo productos desde: ${endpoint}`);
  const productos = await fetchUrl<any[]>(endpoint);
  const producto = productos.find((p) => p.id === productoId);
  if (!producto) {
    console.warn(`❌ Producto con ID ${productoId} no encontrado`);
    return [];
  }
  console.log(`✅ Variantes del producto ${productoId}:`, producto.variantes);
  return producto.variantes ?? [];
};

export const createVariante = async (
  productoId: number,
  formData: FormData
): Promise<Variante> => {
  const endpoint = `/api/variantes/productos/${productoId}/variantes`;
  console.log("🚀 Enviando a:", endpoint);

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const t = await res.text();
    console.error(`❌ Error ${res.status}: ${t}`);
    throw new Error(`Error al crear variante: ${res.status} ${t}`);
  }

  return res.json() as Promise<Variante>;
};

export const deleteVariante = async (varianteId: number): Promise<void> => {
  const endpoint = `/api/variantes/${varianteId}`;
  console.log(`Eliminando variante desde: ${API_BASE_URL}${endpoint}`);

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const t = await res.text();
    console.error(`Error ${res.status}: ${t}`);
    throw new Error(`Error al eliminar variante: ${res.status} ${t}`);
  }

  console.log(`Variante ${varianteId} eliminada`);
};