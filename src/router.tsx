// Librerias
import { createBrowserRouter } from "react-router-dom";
import { AuthLayout } from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Settings from "./pages/auth/Settings";

// Protected Pages
// Inventarios
import AlmacenDetailPage from "./pages/inventario/AlmacenDetailPage";
import AlmacenesPage from "./pages/inventario/AlmacenesPage";
import TiendasPage from "./pages/inventario/TiendasPage";
import TiendaDetailPage from "./pages/inventario/TiendaDetailPage";
//import StockPage from "./pages/inventario/StockPage"; <- no existe
import StockDetailPage from "@pages/inventario/StockDetailPage";

const router = createBrowserRouter([
  // ============================
  // 🔒 PROTECTED ROUTES
  // ============================
  {
    element: (
      <AuthProvider>
        <ProtectedRoute />
      </AuthProvider>
    ),
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          // Inventarios (unificados)
          {
            path: "inventario/almacenes",
            element: <AlmacenesPage />,
          },
          {
            path: "inventario/almacenes/:id",
            element: <AlmacenDetailPage />,
          },
          {
            path: "inventario/tiendas",
            element: <TiendasPage />,
          },
          {
            path: "inventario/tiendas/:id",
            element: <TiendaDetailPage />,
          },
          // {
          //   path: "inventario/productos",
          //   element: <StockPage />,
          // },
          {
            path: "inventario/productos/:id",
            element: <StockDetailPage />,
          },

          // Configuraciones
          {
            path: "configuraciones",
            element: <Settings />,
          },

          // Página 404 interna
          {
            path: "*",
            element: <div>Página no encontrada</div>,
          },
        ],
      },
    ],
  },

  // ============================
  // 🔓 AUTH ROUTES
  // ============================
  {
    path: "/auth",
    element: (
      <AuthProvider>
        <AuthLayout />
      </AuthProvider>
    ),
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
]);

// KAFKA
// ordenes y devoluciones
// necesitan estados de envio (finalizado)
// orden, productoOrden, Historial orden

// nos mandas la confirmacion de la orden (para reservar y para confirmar)
// otra para devolucion, descuenta automatico

export default router;
