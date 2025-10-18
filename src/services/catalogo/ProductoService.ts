const API_BASE_URL = import.meta.env.VITE_API_CATALOGO_URL; // ✅ toma la URL desde .env

export const getProductos = async () => {
  const res = await fetch(`${API_BASE_URL}/api/productos`);
  if (!res.ok) {
    throw new Error(`Error al cargar productos: ${res.status}`);
  }
  return res.json();
};

export const createProducto = async (formData: FormData) => {
  console.log("📦 Enviando producto al backend...");

  const res = await fetch(`${API_BASE_URL}/api/productos`, {
    method: "POST",
    body: formData, // ⚠️ No agregues Content-Type manualmente
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error al crear producto: ${res.status} - ${text}`);
  }

  return res.json();
};
