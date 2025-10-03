// Librerias
import { createBrowserRouter } from "react-router-dom";

// Layouts
import MainLayout from "./layouts/MainLayout";

// Inventarios
import AlmacenesPage from "./pages/inventario/AlmacenesPage";
import TiendasPage from "./pages/inventario/TiendasPage";
import ProductosPage from "./pages/inventario/ProductosPage";

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
                path: 'inventario/tiendas',
                element: <TiendasPage/>,
            },
            {
                path: 'inventario/productos',
                element: <ProductosPage/>,
            },
        ]
    }
]);

export default router;