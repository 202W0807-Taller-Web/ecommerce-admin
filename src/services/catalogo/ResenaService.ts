const API_URL =
  "https://resenas-gybuf9h7fsgwd2ez.canadacentral-01.azurewebsites.net";

// ⭐ Interface de reseña basada en tu API
export interface Resena {
  id: number;
  productoId: number;
  usuarioNombre: string;
  fecha: string;
  calificacion: number;
  comentario?: string;
}

// ⭐ Obtener reseñas por producto (nombre real de tu función)
export const getResenasByProducto = async (
  productoId: number
): Promise<Resena[]> => {
  const res = await fetch(`${API_URL}/api/productos/${productoId}/reseñas`);
  return res.json();
};

export const createResena = async (data: Resena) => {
  const res = await fetch(`${API_URL}/api/resenas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json-patch+json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateResena = async (id: number, data: Partial<Resena>) => {
  const res = await fetch(`${API_URL}/api/resenas/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json-patch+json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteResena = async (id: number) => {
  await fetch(`${API_URL}/api/resenas/${id}`, { method: "DELETE" });
};
