const API_BASE_URL = import.meta.env.VITE_API_CATALOGO_URL; 

export const getProductos = async () => {
  const res = await fetch(`${API_BASE_URL}/api/productos`);
  if (!res.ok) {
    throw new Error(`Error al cargar productos: ${res.status}`);
  }
  return res.json();
};

export const createProducto = async (formData: FormData) => {
  console.log("Enviando producto al backend...");

  const res = await fetch(`${API_BASE_URL}/api/productos`, {
    method: "POST",
    body: formData, 
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error al crear producto: ${res.status} - ${text}`);
  }

  return res.json();
};

export const getProductoById = async (id: number) => {   
  const res = await fetch(`${API_BASE_URL}/api/productos/${id}`);
  if (!res.ok) {
    throw new Error(`Error al cargar producto: ${res.status}`);
  }
  return res.json();
};

export const updateProducto = async (id: number, formData: FormData) => {
  console.log(`Actualizando producto ${id} en el backend...`);

  const res = await fetch(`${API_BASE_URL}/api/productos/${id}`, {
    method: "PUT",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error al actualizar producto: ${res.status} - ${text}`);
  }

  return res.json();
};

export const deleteProducto = async (id: number) => {
  console.log(`Eliminando producto ${id} del backend...`);

  const res = await fetch(`${API_BASE_URL}/api/productos/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error al eliminar producto: ${res.status} - ${text}`);
  }

  return res.json();
};