import { fetchUrl } from "./api";
import type { Variante } from "../../types/catalogo/Variantes";
import type { Producto } from "../../types/catalogo/Productos";


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
  } catch (err: unknown) {
    console.warn(
      "⚠️ No se pudo obtener variantes directamente, intentando desde productos...",
      err
    );
    return await getVariantesFromProductos(productoId);
  }
};

export const getVariantesFromProductos = async (
  productoId: number
): Promise<Variante[]> => {
  const endpoint = `/api/productos`;
  console.log(`📡 Obteniendo productos desde: ${endpoint}`);
  interface ProductoWithVariantes extends Producto {
    variantes?: Variante[];
  }

  const productos = await fetchUrl<ProductoWithVariantes[]>(endpoint);
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

export const deleteVariante = async (
  productoIdOrVarianteId: number,
  maybeVarianteId?: number
): Promise<void> => {

  let productoId: number | undefined;
  let varianteId: number;

  if (typeof maybeVarianteId === "number") {
    productoId = productoIdOrVarianteId;
    varianteId = maybeVarianteId;
  } else {
    varianteId = productoIdOrVarianteId;
    productoId = undefined;
  }

  const tryProductEndpoint = async () => {
    if (typeof productoId !== "number") return false;
    const endpoint = `/api/variantes/productos/${productoId}/variantes/${varianteId}`;
    
    const res = await fetch(`${API_BASE_URL}${endpoint}`, { method: "DELETE" });
    if (res.ok) {
      console.log(`Variante ${varianteId} del producto ${productoId} eliminada (product-scoped)`);
      return true;
    }
    const t = await res.text();
    console.warn(`Intento product-scoped falló: ${res.status} ${t}`);
    return false;
  };

  const tryGenericEndpoint = async () => {
    const endpoint = `/api/variantes/${varianteId}`;
    
    const res = await fetch(`${API_BASE_URL}${endpoint}`, { method: "DELETE" });
    if (res.ok) {
      console.log(`Variante ${varianteId} eliminada (genérica)`);
      return true;
    }
    const t = await res.text();
    throw new Error(`Error al eliminar variante: ${res.status} ${t}`);
  };

  if (typeof productoId === "number") {
    const ok = await tryProductEndpoint();
    if (ok) return;
    await tryGenericEndpoint();
    return;
  }

  await tryGenericEndpoint();
};