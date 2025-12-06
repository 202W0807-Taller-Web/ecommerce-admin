const API_URL = import.meta.env.VITE_API_RESENAS_URL;

export interface Resena {
  id: number;
  id_detalle_orden: number;
  comentario: string;
  calificacion: number;
  fecha_resena: string;
}

export interface CreateResenaDto {
  id_detalle_orden: number;
  comentario: string;
  calificacion: number;
  fecha_resena: string;
}

export interface UpdateResenaDto {
  id_detalle_orden?: number | null;
  comentario?: string | null;
  calificacion?: number | null;
  fecha_resena?: string | null;
}

/**
 * ✔ Obtiene las reseñas REALES del producto
 * mapeando orden-items → reseñas
 */
export const getResenasByProducto = async (
  productoId: number
): Promise<Resena[]> => {
  // 1. Traer todos los orden-items
  const oiRes = await fetch(`${API_URL}/api/orden-items`);
  const allOrderItems = await oiRes.json();

  // 2. Filtrar los order-items que pertenecen al producto
  const productOrderItems = allOrderItems.filter(
    (oi: any) => oi.productoId === productoId
  );

  const orderItemIds = productOrderItems.map((oi: any) => oi.id);

  // 3. Traer todas las reseñas
  const res = await fetch(`${API_URL}/api/resenas`);
  const allReviews = await res.json();

  // 4. Filtrar solo las reseñas ligadas a los order-items del producto
  const productReviews = allReviews.filter((r: Resena) =>
    orderItemIds.includes(r.id_detalle_orden)
  );

  return productReviews;
};

export const createResena = async (data: CreateResenaDto): Promise<Resena> => {
  const res = await fetch(`${API_URL}/api/resenas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json-patch+json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateResena = async (
  id: number,
  data: UpdateResenaDto
): Promise<Resena> => {
  const res = await fetch(`${API_URL}/api/resenas/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json-patch+json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteResena = async (id: number): Promise<void> => {
  await fetch(`${API_URL}/api/resenas/${id}`, { method: "DELETE" });
};
