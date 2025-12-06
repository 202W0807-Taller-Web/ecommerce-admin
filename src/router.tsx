// Librerias
import { createBrowserRouter } from "react-router-dom";
import { AuthLayout } from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

//Ordenes-Devoluciones
import DevolucionesPage from "./pages/devoluciones/DevolucionesPage";
import DevolucionDetallePage from "./pages/devoluciones/DevolucionDetallePage";
import CrearDevolucionPage from "./pages/devoluciones/CrearDevolucionPage";
import OrdenesPage from "./pages/ordenes/OrdenesPage";
import DetalleOrden from "./pages/ordenes/DetalleOrden";

// Envios
import EnviosPage from "./pages/envios/EnviosPage";
import CrearEnvioPage from "./pages/envios/CrearEnvioPage";
import DetalleEnvioPage from "./pages/envios/DetalleEnvioPage";

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
import StockPage from "./pages/inventario/StockPage";
import StockDetailPage from "./pages/inventario/StockDetailPage";

import CategoriasPage from "./pages/catalogo/CategoriasPage";
import ProductosVariantesPage from "./pages/catalogo/ProductosVariantesPage";
import AtributosPage from "./pages/catalogo/AtributosPage";
import ReseñasPage from "./pages/catalogo/ReseñasPage";
import PromocionesPage from "./pages/catalogo/PromocionesPage";
import DetalleReseñasPage from "@pages/catalogo/DetalleReseñasPage";

const router = createBrowserRouter([
  // ============================
  // 🔓 PUBLIC ROUTES
  // ============================
  {
    path: "/",
    element: (
      <AuthProvider>
        <MainLayout />
      </AuthProvider>
    ),
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
      {
        path: "inventario/productos",
        element: <StockPage />,
      },
      {
        path: "inventario/productos/:id",
        element: <StockDetailPage />,
      },

      // Configuraciones
      {
        path: "configuraciones",
        element: <Settings />,
      },
      {
        path: "catalogo/productos",
        element: <CategoriasPage />,
      },
      {
        path: "catalogo/productos/:id/variantes",
        element: <ProductosVariantesPage />,
      },

      {
        path: "catalogo/reseñas",
        element: <ReseñasPage />,
      },
      {
        path: "catalogo/atributos",
        element: <AtributosPage />,
      },
      {
        path: "catalogo/promociones",
        element: <PromocionesPage />,
      },
      {
        path: "catalogo/reseñas/:id",
        element: <DetalleReseñasPage />,
      },

      {
        path: "devoluciones",
        element: <DevolucionesPage />,
      },
      {
        path: "devoluciones",
        element: <CrearDevolucionPage />,
      },
      {
        path: "devoluciones/:id",
        element: <DevolucionDetallePage />,
      },
      {
        path: "ordenes",
        element: <OrdenesPage />,
      },
      {
        path: "ordenes/:idOrden",
        element: <DetalleOrden />,
      },

      // Página 404 interna
      {
        path: "*",
        element: <div>Página no encontrada</div>,
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
        path: "devoluciones",
        element: <CrearDevolucionPage />,
      },
      {
        path: "devoluciones/:id",
        element: <DevolucionDetallePage />,
      },
      {
        path: "ordenes",
        element: <OrdenesPage />,
      },
      {
        path: "envios/ordenes",
        element: <EnviosPage />,
      },
      {
        path: "envios/crear",
        element: <CrearEnvioPage />,
      },
      {
        path: "envios/ordenes/:id",
        element: <DetalleEnvioPage />,
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
