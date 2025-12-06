// Librerias
import { createBrowserRouter } from "react-router-dom";
import { AuthLayout } from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Protected Pages
import AlmacenesPage from "./pages/inventario/AlmacenesPage";
import TiendasPage from "./pages/inventario/TiendasPage";
import ProductosPage from "./pages/inventario/ProductosPage";

const router = createBrowserRouter([
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
          {
            path: "inventario/almacenes",
            element: <AlmacenesPage />,
          },
          {
            path: "inventario/tiendas",
            element: <TiendasPage />,
          },
          {
            path: "inventario/productos",
            element: <ProductosPage />,
          },
          // Add more protected routes here
          {
            path: "*",
            element: <div>Página no encontrada</div>,
          },
        ],
      },
    ],
  },
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

export default router;