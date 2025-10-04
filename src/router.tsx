// Librerias
import { createBrowserRouter } from "react-router-dom";

// Layouts
import MainLayout from "./layouts/MainLayout";

// Inventarios
import AlmacenesPage from "./pages/inventario/AlmacenesPage";
import AlmacenesDetailsPage from "./pages/inventario/AlmacenesDetailsPage";
import TiendasPage from "./pages/inventario/TiendasPage";
import TiendasDetailPage from "./pages/inventario/TiendasDetailPage";
import ProductosPage from "./pages/inventario/StockPage";
import StockDetailsPage from "./pages/inventario/StockDetailsPage";

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout/>,
        children: [
            {
                path: 'inventario/almacenes',
                element: <AlmacenesPage/>,
            },
            {
                path: 'inventario/almacenes/:id',
                element: <AlmacenesDetailsPage/>,
            },
            {
                path: 'inventario/tiendas',
                element: <TiendasPage/>,
            },
            {
                path: 'inventario/tiendas/:id',
                element: <TiendasDetailPage/>,
            },
            {
                path: 'inventario/stock',
                element: <ProductosPage/>,
            },
            {
                path: 'inventario/stock/:id',
                element: <StockDetailsPage/>,
            },
        ]
    }
]); 
// KAFKA
// ordenes y devoluciones
// necesitan estados de envio (finalizado)
// orden, productoOrden, Historial orden

// nos mandas la confirmacion de la orden (para reservar y para confirmar)
// otra para devolucion, descuenta automatico



export default router;