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

// Helper para construir FormData con TODOS los campos que requiere el PUT.
// data.imagenesExistentesUrls -> string[] de urls que quiero conservar
// data.nuevasImagenesArchivos -> File[] de nuevas imágenes a subir
// data.idsAtributosValores -> number[] de ids de atributos/valores
export const buildProductoFormData = (data: {
  Id?: number | string;
  Nombre?: string;
  Descripcion?: string;
  ImagenesExistentesUrls?: string[];
  NuevasImagenesArchivos?: File[];
  IdsAtributosValores?: (number | string)[];
  // puedes añadir aquí otros campos que tu backend necesite (promocionId, variantes, etc.)
}): FormData => {
  const fd = new FormData();

  if (data.Id !== undefined && data.Id !== null) fd.append("Id", String(data.Id));
  if (data.Nombre !== undefined) fd.append("Nombre", String(data.Nombre));
  if (data.Descripcion !== undefined) fd.append("Descripcion", String(data.Descripcion));

  // Imágenes existentes: enviar una entrada por cada url que quieras conservar
  if (Array.isArray(data.ImagenesExistentesUrls)) {
    data.ImagenesExistentesUrls.forEach((url) => {
      fd.append("ImagenesExistentesUrls", url);
    });
  }

  // Nuevos archivos: enviar cada File con la misma key
  if (Array.isArray(data.NuevasImagenesArchivos)) {
    data.NuevasImagenesArchivos.forEach((file) => {
      fd.append("NuevasImagenesArchivos", file);
    });
  }

  // Ids de atributos/valores: enviar uno por entrada
  if (Array.isArray(data.IdsAtributosValores)) {
    data.IdsAtributosValores.forEach((id) => {
      fd.append("IdsAtributosValores", String(id));
    });
  }

  return fd;
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