import { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Home, Package, Truck, ChevronRight, FileText } from "lucide-react";
import type { NavItem } from "types/ui/NavItem";
import Logo from "@components/Logo";

const staticNavItems: NavItem[] = [
  { label: "Home", path: "/", icon: <Home /> },
  {
    label: "Inventario",
    icon: <Package />,
    children: [
      { label: "Almacenes", path: "/inventario/almacenes" },
      { label: "Tiendas", path: "/inventario/tiendas" },
      { label: "Stock", path: "/inventario/stock" },
    ],
  },
  {
    label: "Envíos",
    icon: <Truck />,
    children: [
      { label: "Carriers", path: "/envios/carriers" },
      { label: "Órdenes", path: "/envios/ordenes" },
    ],
  },
  {
    label: "Catálogo",
    icon: <Truck />,
    children: [
      { label: "Productos y variantes", path: "/catalogo/productos" },
      { label: "Atributos", path: "/catalogo/atributos" },
      { label: "Reseñas", path: "/catalogo/reseñas" },
      { label: "Promociones", path: "/catalogo/promociones" },
    ],
  },
  {
    label: "Ordenes y devoluciones",
    icon: <FileText />, 
    children: [
      { label: "Órdenes", path: "/ordenes" },
      { label: "Devoluciones", path: "/devoluciones" },
    ],
  },
  
];

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const [openAccordions, setOpenAccordions] = useState<string[]>(() => {
    const activeParents: string[] = [];
    staticNavItems.forEach((item) => {
      if (item.children) {
        if (item.children.some(child => location.pathname.startsWith(child.path))) {
          activeParents.push(item.label);
        }
      }
    });
    return activeParents;
  });

  const toggleAccordion = (label: string) => {
    setOpenAccordions(prev =>
      prev.includes(label) ? prev.filter(item => item !== label) : [...prev, label]
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100 w-full">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 max-w-full transform bg-white shadow-lg transition-transform lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } font-inter py-8`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 py-3">
            <Logo />
            <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 py-6 space-y-4 overflow-y-auto">
            {staticNavItems.map(item => (
              <div key={item.label}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => toggleAccordion(item.label)}
                      className={`flex w-full items-center justify-between px-8 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-md  
                        ${openAccordions.includes(item.label) ? "bg-gray-100" : ""}`}
                    >
                      <span className="flex items-center gap-2 flex-1 text-left">
                        {item.icon}
                        {item.label}
                      </span>
                      <span className={`transition-transform ${openAccordions.includes(item.label) ? "rotate-90" : ""}`}>
                        <ChevronRight />
                      </span>
                    </button>

                    {openAccordions.includes(item.label) && (
                      <div className="ml-6 mt-1 space-y-1">
                        {item.children.map(child => (
                          <NavLink
                            key={child.path}
                            to={child.path}
                            className={({ isActive }) =>
                              `block px-8 py-2 rounded-md text-sm ${
                                isActive ? "font-bold" : "text-gray-600 hover:bg-gray-100"
                              }`
                            }
                          >
                            {child.label}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <NavLink
                    to={item.path!}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-8 py-2 rounded-md text-sm font-medium text-[16px] ${
                        isActive ? "font-bold" : "text-gray-700 hover:bg-gray-100"
                      }`
                    }
                  >
                    {item.icon}
                    {item.label}
                  </NavLink>
                )}
              </div>
            ))}
          </nav>
        </div>
      </aside>

      <div className="flex-1 flex flex-col w-full min-w-0">
        <header className="flex items-center justify-between px-4 py-3 bg-white shadow lg:hidden">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <Logo />
        </header>

        <main className="flex-1 p-2 sm:p-4 md:p-6 w-full min-w-0 overflow-x-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
