import axios from "axios";

export const API_RETURNS = axios.create({
  baseURL: import.meta.env.MODE === "production"
    ? "https://ecommerceordenesdevoluciones-557084106360.us-central1.run.app"
    : "http://localhost:3003",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para añadir token en cada request
API_RETURNS.interceptors.request.use(
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
API_RETURNS.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
