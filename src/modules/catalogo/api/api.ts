import axios from "axios";

const API_CATALOGO = axios.create({
  baseURL: import.meta.env.MODE === "production"
    ? "https://catalogo-service-dcc3a7dgbja8b6dd.canadacentral-01.azurewebsites.net/api"
    : "http://localhost:3004", // Puerto del servicio de catálogo
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para añadir token en cada request
API_CATALOGO.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    } else {
      delete config.headers["Authorization"];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuesta (manejo de errores)
API_CATALOGO.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API_CATALOGO;
