// Librerias
import { createBrowserRouter } from "react-router-dom";

// Layouts
import MainLayout from "./layouts/MainLayout";

// Inventarios
import AlmacenesPage from "./pages/inventario/AlmacenesPage";
import TiendasPage from "./pages/inventario/TiendasPage";
import ProductosPage from "./pages/inventario/ProductosPage";
import CategoriasPage from "./pages/catalogo/CategoriasPage";
import ProductosVariantesPage from "./pages/catalogo/ProductosVariantesPage";
import AtributosPage from "./pages/catalogo/AtributosPage";
import ReseñasPage from "./pages/catalogo/ReseñasPage";
import PromocionesPage from "./pages/catalogo/PromocionesPage";
import DetalleReseñasPage from "@pages/catalogo/DetalleReseñasPage";

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
                path: 'catalogo/productos',
                element: <CategoriasPage/>,
            },

            {
                path: 'catalogo/productos/:id/variantes',
                element: <ProductosVariantesPage/>,
            },

            {
                path: 'catalogo/reseñas',
                element: <ReseñasPage/>,
            },
            {
                path: 'catalogo/atributos',
                element: <AtributosPage/>,
            },
            {
                path: 'catalogo/promociones',
                element: <PromocionesPage/>,
            },
            {
                path: 'catalogo/reseñas/:id',
                element: <DetalleReseñasPage />,
            },

            
        ]
    }
]);

export default router;