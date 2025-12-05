import axios from "axios";

const API_BASE_URL =
  "https://catalogo-service-dcc3a7dgbja8b6dd.canadacentral-01.azurewebsites.net/api";

/**
 * Obtiene el detalle de un producto por su ID
 * Incluye imágenes, variantes y atributos.
 */
export const getProductoById = async (id: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/productos/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener producto:", error);
    throw error;
  }
};
