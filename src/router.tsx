// Librerias
import { createBrowserRouter } from "react-router-dom";

// Layouts
import MainLayout from "./layouts/MainLayout";

// Inventarios
import AlmacenesPage from "./pages/inventario/AlmacenesPage";
import TiendasPage from "./pages/inventario/TiendasPage";
import ProductosPage from "./pages/inventario/ProductosPage";
import CategoriasPage from "./pages/catalogo/CategoriasPage";
import AtributosPage from "./pages/catalogo/AtributosPage";
import ReseñasPage from "./pages/catalogo/ReseñasPage";

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

            {
                path: 'catalogo/categorias',
                element: <CategoriasPage/>,
            },
            {
                path: 'catalogo/reseñas',
                element: <ReseñasPage/>,
            },
            {
                path: 'catalogo/atributos',
                element: <AtributosPage/>,
            },
        ]
    }
]);

export default router;