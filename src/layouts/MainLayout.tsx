// src/layouts/MainLayout.tsx
import { Outlet, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Home, Package, Truck, ChevronRight } from "lucide-react";
// types
import type { NavItem } from "types/ui/NavItem";
//components
import Logo from "@components/Logo";

const navItems: NavItem[] = [
  { label: "Home", path: "/", icon: <Home /> },
  {
    label: "Inventario",
    icon: <Package />,
    children: [
      { label: "Almacenes", path: "/inventario/almacenes" },
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
];

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openAccordions, setOpenAccordions] = useState<string[]>([]);
  const location = useLocation();

  const toggleAccordion = (label: string) => {
    setOpenAccordions((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white shadow-lg transition-transform lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } font-inter py-8`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 py-3">
            <Logo/>
            <button
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 space-y-4 overflow-y-auto">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.path ? (
                  <Link
                    to={item.path}
                    className={`flex items-center gap-2 px-8 py-2 rounded-md text-sm font-medium text-[16px] ${
                      location.pathname === item.path
                        ? "font-semibold"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ) : (
                  <div>
                    <button
                      onClick={() => toggleAccordion(item.label)}
                      className={`flex w-full items-center justify-between px-8 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-md
                        ${openAccordions.includes(item.label) ? "bg-gray-100" : ""}`}
                    >
                      <span className="flex items-center gap-2">
                        {item.icon}
                        {item.label}
                      </span>
                      <span
                        className={`transition-transform ${
                          openAccordions.includes(item.label)
                            ? "rotate-90"
                            : ""
                        }`}
                      >
                        <ChevronRight />
                      </span>
                    </button>
                    {openAccordions.includes(item.label) && (
                      <div className="ml-6 mt-1 space-y-1">
                        {item.children?.map((child) => (
                          <Link
                            key={child.path}
                            to={child.path}
                            className={`block px-8 py-2 rounded-md text-sm ${
                              location.pathname === child.path
                                ? "font-semibold"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            {child.label}
                          </Link>
                        ))}
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
              <img
                src="https://i.pravatar.cc/40"
                alt="User"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="text-sm font-medium text-gray-800">Juan Pérez</p>
                <p className="text-xs text-gray-500">juan.perez@email.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between px-4 py-3 bg-white shadow lg:hidden">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <Logo/>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
