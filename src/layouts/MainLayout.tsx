import { useEffect, useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Home, Package, Truck, ChevronRight } from "lucide-react";
import type { NavItem } from "types/ui/NavItem";
import Logo from "@components/Logo";

const fetchCategorias = async () => [
  { label: "Electrónica", path: "electronica" },
  { label: "Accesorios", path: "accesorios" },
  { label: "Ropa", path: "ropa" },
  { label: "Libros", path: "libros" },
  { label: "Juguetes", path: "juguetes" },
  { label: "Computadoras", path: "computadoras" },
];

const staticNavItems: NavItem[] = [
  { label: "Home", path: "/", icon: <Home /> },
  {
    label: "Inventario",
    icon: <Package />,
    children: [
      { label: "Almacenes", path: "/inventario/almacenes" },
      { label: "Tiendas", path: "/inventario/tiendas" },
      { label: "Productos", path: "/inventario/productos" },
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
      { label: "Categorías", path: "/catalogo/categorias" },
      { label: "Reseñas", path: "/catalogo/reseñas" },
    ],
  },
];

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const [categorias, setCategorias] = useState<{ label: string; path: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [openAccordions, setOpenAccordions] = useState<string[]>(() => {
    const activeParents: string[] = [];

    staticNavItems.forEach((item) => {
      if (item.children) {
        if (item.children.some((child) => location.pathname.startsWith(child.path))) {
          activeParents.push(item.label);
        }
      }
    });

    if (location.pathname.startsWith("/catalogo/categorias")) {
      activeParents.push("Catálogo");
      activeParents.push("Categorías");
    }

    return activeParents;
  });

  useEffect(() => {
    fetchCategorias().then(setCategorias);
  }, []);

  useEffect(() => {
    const activeParents: string[] = [];

    staticNavItems.forEach((item) => {
      if (item.children) {
        if (item.children.some((child) => location.pathname.startsWith(child.path))) {
          activeParents.push(item.label);
        }
      }
    });

    if (location.pathname.startsWith("/catalogo/categorias")) {
      activeParents.push("Catálogo");
      activeParents.push("Categorías");
    }

    setOpenAccordions((prev) => Array.from(new Set([...prev, ...activeParents])));
  }, [location.pathname]);

  const toggleAccordion = (label: string) => {
    setOpenAccordions((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  const filteredCategorias = categorias.filter((cat) =>
    cat.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const navItems: NavItem[] = [
    ...staticNavItems.filter((item) => item.label !== "Catálogo"),
    {
      label: "Catálogo",
      icon: <Truck />,
      children: [
        {
          label: "Categorías",
          children: filteredCategorias.map((cat) => ({
            label: cat.label,
            path: `/catalogo/categorias/${cat.path}`,
          })),
        },
        { label: "Reseñas", path: "/catalogo/reseñas" },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 w-full">
      {/* Sidebar */}
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

          {/* Navigation */}
          <nav className="flex-1 py-6 space-y-4 overflow-y-auto">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.path ? (
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-8 py-2 rounded-md text-sm font-medium text-[16px] ${
                        isActive ? "font-semibold" : "text-gray-700 hover:bg-gray-100"
                      }`
                    }
                  >
                    {item.icon}
                    {item.label}
                  </NavLink>
                ) : (
                  <div>
                    <button
                      onClick={() => toggleAccordion(item.label)}
                      className={`flex w-full items-center justify-between px-8 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-md ${
                        openAccordions.includes(item.label) ? "bg-gray-100" : ""
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {item.icon}
                        {item.label}
                      </span>
                      <span
                        className={`transition-transform ${
                          openAccordions.includes(item.label) ? "rotate-90" : ""
                        }`}
                      >
                        <ChevronRight />
                      </span>
                    </button>
                    {openAccordions.includes(item.label) && (
                      <div className="ml-6 mt-1 space-y-1">
                        {item.children?.map((child) =>
                          child.children ? (
                            <div key={child.label}>
                              <button
                                onClick={() => toggleAccordion(child.label)}
                                className={`flex w-full items-center justify-between px-8 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-md ${
                                  openAccordions.includes(child.label) ? "bg-gray-100" : ""
                                }`}
                              >
                                <span className="flex items-center gap-2">{child.label}</span>
                                <span
                                  className={`transition-transform ${
                                    openAccordions.includes(child.label) ? "rotate-90" : ""
                                  }`}
                                >
                                  <ChevronRight />
                                </span>
                              </button>
                              {openAccordions.includes(child.label) && child.label === "Categorías" && (
                                <div
                                  className="ml-6 mt-1 space-y-1"
                                  style={{ maxHeight: "200px", overflowY: "auto", border: "1px solid #d1d5db", borderRadius: "0.375rem" }}
                                >
                                  <input
                                    type="text"
                                    placeholder="Buscar categoría"
                                    className="w-full px-2 py-1 border-b border-gray-300 focus:outline-none"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                  />
                                  {filteredCategorias.length ? (
                                    filteredCategorias.map((subChild) => (
                                      <NavLink
                                        key={subChild.path}
                                        to={subChild.path}
                                        className={({ isActive }) =>
                                          `block px-8 py-2 rounded-md text-sm ${
                                            isActive ? "font-semibold bg-gray-100" : "text-gray-600 hover:bg-gray-100"
                                          }`
                                        }
                                      >
                                        {subChild.label}
                                      </NavLink>
                                    ))
                                  ) : (
                                    <div className="px-8 py-2 text-sm text-gray-500">Sin categorías</div>
                                  )}
                                </div>
                              )}
                            </div>
                          ) : (
                            <NavLink
                              key={child.path}
                              to={child.path}
                              className={({ isActive }) =>
                                `block px-8 py-2 rounded-md text-sm ${
                                  isActive ? "font-semibold" : "text-gray-600 hover:bg-gray-100"
                                }`
                              }
                            >
                              {child.label}
                            </NavLink>
                          )
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* User Info */}
          <div className="p-4">
            <div className="flex items-center space-x-3">
              <img src="https://i.pravatar.cc/40" alt="User" className="w-10 h-10 rounded-full" />
              <div>
                <p className="text-sm font-medium text-gray-800">Juan Pérez</p>
                <p className="text-xs text-gray-500">juan.perez@email.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col w-full min-w-0">
        <header className="flex items-center justify-between px-4 py-3 bg-white shadow lg:hidden">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <Logo />
        </header>

        <main className="flex-1 p-2 sm:p-4 md:p-6 w-full min-w-0 overflow-x-auto">
          <div className="max-w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
