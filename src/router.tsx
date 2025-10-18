// Librerias
import { createBrowserRouter } from "react-router-dom";

// Layouts
import MainLayout from "./layouts/MainLayout";

// Inventarios
import AlmacenDetailPage from "./pages/inventario/AlmacenDetailPage";
import AlmacenesPage from "./pages/inventario/AlmacenesPage";
import TiendasPage from "./pages/inventario/TiendasPage";
import TiendaDetailPage from "./pages/inventario/TiendaDetailPage";
import StockPage from "./pages/inventario/StockPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
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
