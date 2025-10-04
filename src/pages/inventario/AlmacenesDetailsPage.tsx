import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Select from "../../components/Select";
import FileAction from "../../components/FileAction";
import { TableHeader, TableCell, StatusBadge, ActionMenuCell } from "../../components/Table";
import Pagination from "../../components/Pagination";
import { Pencil, PackagePlus, Trash2, Search } from "lucide-react";

// Datos simulados
const almacenesData = [
  {
    id: 1,
    nombre: "Almacen Central",
    direccion: "Av. Principal 123",
    estado: "Activo",
    distrito: "Miraflores",
    provincia: "Lima",
    departamento: "Lima",
    imagen: "https://i.pravatar.cc/80?img=1",
  },
  {
    id: 2,
    nombre: "Almacen Secundario",
    direccion: "Calle Secundaria 456",
    estado: "Inactivo",
    distrito: "San Isidro",
    provincia: "Lima",
    departamento: "Lima",
    imagen: "https://i.pravatar.cc/80?img=2",
  },
];

const productosData = [
  {
    id: 1,
    imagen: "https://i.pravatar.cc/40?img=5",
    sku: "SKU001",
    producto: "Laptop Dell Inspiron",
    categoria: "Electrónica",
    stkDisponible: 12,
    stkReservado: 3,
    stkTotal: 15,
    estadoStk: "Disponible",
  },
  {
    id: 2,
    imagen: "https://i.pravatar.cc/40?img=6",
    sku: "SKU002",
    producto: "Mouse Logitech",
    categoria: "Accesorios",
    stkDisponible: 5,
    stkReservado: 2,
    stkTotal: 7,
    estadoStk: "Bajo Stock",
  },
];

const categorias = Array.from(new Set(productosData.map(p => p.categoria)));
const categoriaOptions = categorias.map(c => ({ value: c, label: c }));

export default function AlmacenesDetailsPage() {
  // Datos simulados de tiendas asociadas
  const tiendasData = [
    {
      id: 1,
      nombre: "Tienda Centro",
      estado: "Activo",
      direccion: "Av. Comercio 100",
      distrito: "Miraflores",
      provincia: "Lima",
      departamento: "Lima",
    },
    {
      id: 2,
      nombre: "Tienda Norte",
      estado: "Inactivo",
      direccion: "Calle Norte 200",
      distrito: "San Isidro",
      provincia: "Lima",
      departamento: "Lima",
    },
    // ...más tiendas
  ];

  // Filtros tiendas
  const [busquedaTienda, setBusquedaTienda] = useState("");
  const [distritoTienda, setDistritoTienda] = useState("");
  const [provinciaTienda, setProvinciaTienda] = useState("");
  const [departamentoTienda, setDepartamentoTienda] = useState("");
  const [pageTienda, setPageTienda] = useState(1);
  const pageSizeTienda = 10;

  // Opciones para selects de tiendas
  const distritosTienda = Array.from(new Set(tiendasData.map(t => t.distrito)));
  const provinciasTienda = Array.from(new Set(tiendasData.map(t => t.provincia)));
  const departamentosTienda = Array.from(new Set(tiendasData.map(t => t.departamento)));
  const distritoOptionsTienda = distritosTienda.map(d => ({ value: d, label: d }));
  const provinciaOptionsTienda = provinciasTienda.map(p => ({ value: p, label: p }));
  const departamentoOptionsTienda = departamentosTienda.map(dep => ({ value: dep, label: dep }));

  // Filtrado tiendas
  const filteredTiendas = tiendasData.filter((t) =>
    t.nombre.toLowerCase().includes(busquedaTienda.toLowerCase()) &&
    (distritoTienda ? t.distrito === distritoTienda : true) &&
    (provinciaTienda ? t.provincia === provinciaTienda : true) &&
    (departamentoTienda ? t.departamento === departamentoTienda : true)
  );
  const totalPagesTiendas = Math.max(1, Math.ceil(filteredTiendas.length / pageSizeTienda));
  const paginatedTiendas = filteredTiendas.slice((pageTienda - 1) * pageSizeTienda, pageTienda * pageSizeTienda);
  const { id } = useParams();
  const almacen = almacenesData.find(a => a.id === Number(id)) || almacenesData[0];

  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Filtros productos
  const filtered = productosData.filter((p) =>
    p.producto.toLowerCase().includes(busqueda.toLowerCase()) &&
    (categoria ? p.categoria === categoria : true)
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="p-4 w-full max-w-full overflow-x-auto">
      {/* Título y botón editar */}
      <div className="flex justify-between items-center gap-4 mb-4">
        <h1 className="text-2xl font-bold">{almacen.nombre}</h1>
        <Button text="Editar" icon={Pencil} variant="primary" />
      </div>
      {/* Datos del almacén en dos columnas */}
      <div className="flex flex-col sm:flex-row gap-6 mb-6 items-center">
        <img src={almacen.imagen} alt={almacen.nombre} className="w-40 h-40 rounded-lg border" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <div className="flex flex-col gap-2">
            <div><b>Dirección:</b> {almacen.direccion}</div>
            <div><b>Estado:</b> <span className={`${almacen.estado.toLowerCase() === "activo" ? 'text-green-700' : 'text-red-700'}`}>{almacen.estado}</span></div>
            <div><b>Distrito:</b> {almacen.distrito}</div>
          </div>
          <div className="flex flex-col gap-2">
            <div><b>Provincia:</b> {almacen.provincia}</div>
            <div><b>Departamento:</b> {almacen.departamento}</div>
          </div>
        </div>
      </div>
      {/* Filtros productos */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-end w-full">
        <div className="w-full sm:w-64 min-w-0">
          <Input
            label="Buscar producto"
            placeholder="Nombre de producto"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            rightIcon={Search}
          />
        </div>
        <div className="w-full sm:w-48 min-w-0">
          <Select
            label="Categoría"
            placeholder="Todas"
            options={categoriaOptions}
            value={categoria}
            onChange={e => setCategoria(e.target.value)}
          />
        </div>
      </div>
      {/* Acciones productos */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <FileAction text="Importar data" variant="upload" />
        <FileAction text="Exportar data" variant="download" />
      </div>
      {/* Tabla productos */}
      <div className="overflow-x-auto w-full">
        <table className="min-w-[600px] w-full border-collapse mb-2 text-xs sm:text-sm">
          <thead className="bg-gray-50">
            <tr>
              <TableHeader label="#" className="w-12 min-w-[48px] text-center" />
              <TableHeader label="Imagen" />
              <TableHeader label="SKU" />
              <TableHeader label="Producto" />
              <TableHeader label="Stk. Disponible" />
              <TableHeader label="Stk. Reservado" />
              <TableHeader label="Stk. Total" />
              <TableHeader label="Estado" />
              <th className="w-24 min-w-[64px] text-center border border-stroke"></th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr><TableCell>No hay productos</TableCell></tr>
            ) : (
              paginated.map((p, idx) => (
                <tr key={p.id} className={idx % 2 ? "bg-gray-50" : "bg-white"}>
                  <TableCell className="w-12 min-w-[48px] text-center">{p.id}</TableCell>
                  <TableCell><img src={p.imagen} alt={p.producto} className="w-8 h-8 rounded-full" /></TableCell>
                  <TableCell>{p.sku}</TableCell>
                  <TableCell>{p.producto}</TableCell>
                  <TableCell>{p.stkDisponible}</TableCell>
                  <TableCell>{p.stkReservado}</TableCell>
                  <TableCell>{p.stkTotal}</TableCell>
                  <TableCell>
                    <StatusBadge label={p.estadoStk} variant={p.estadoStk === "Disponible" ? "success" : "danger"} />
                  </TableCell>
                  <ActionMenuCell
                    buttons={[{
                      label: "Editar",
                      icon: <Pencil className="w-4 h-4 text-primary1" />,
                      onClick: () => console.log(`Editar producto: ${p.producto}`),
                    }, {
                      label: "Eliminar",
                      icon: <Trash2 className="w-4 h-4 text-red-600" />,
                      onClick: () => console.log(`Eliminar producto: ${p.producto}`),
                    }, {
                      label: "Asignar",
                      icon: <PackagePlus className="w-4 h-4 text-green-600" />,
                      onClick: () => console.log(`Asignar producto: ${p.producto}`),
                    }]}
                  />
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="flex justify-end items-center w-full mt-2">
          <span className="text-sm text-gray-500 mr-2">
            {`Mostrando ${filtered.length === 0 ? 0 : ((page - 1) * pageSize + 1)} - ${filtered.length === 0 ? 0 : Math.min(page * pageSize, filtered.length)} de ${filtered.length} resultados`}
          </span>
        </div>
        <div className="flex justify-center mt-4 w-full">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>
      {/* Tiendas asociadas al almacén */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Tiendas asociadas</h2>
        {/* Filtros tiendas */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-end w-full">
          <div className="w-full sm:w-64 min-w-0">
            <Input
              label="Buscar por nombre"
              placeholder="Nombre de tienda"
              value={busquedaTienda}
              onChange={e => setBusquedaTienda(e.target.value)}
              rightIcon={Search}
            />
          </div>
          <div className="w-full sm:w-48 min-w-0">
            <Select
              label="Distrito"
              placeholder="Todos"
              options={distritoOptionsTienda}
              value={distritoTienda}
              onChange={e => setDistritoTienda(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-48 min-w-0">
            <Select
              label="Provincia"
              placeholder="Todas"
              options={provinciaOptionsTienda}
              value={provinciaTienda}
              onChange={e => setProvinciaTienda(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-48 min-w-0">
            <Select
              label="Departamento"
              placeholder="Todos"
              options={departamentoOptionsTienda}
              value={departamentoTienda}
              onChange={e => setDepartamentoTienda(e.target.value)}
            />
          </div>
        </div>
        {/* Acciones tiendas */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <FileAction text="Importar data" variant="upload" />
          <FileAction text="Exportar data" variant="download" />
        </div>
        {/* Tabla tiendas */}
        <div className="overflow-x-auto w-full">
          <table className="min-w-[600px] w-full border-collapse mb-2 text-xs sm:text-sm">
            <thead className="bg-gray-50">
              <tr>
                <TableHeader label="#" className="w-12 min-w-[48px] text-center" />
                <TableHeader label="Nombre" />
                <TableHeader label="Estado" />
                <TableHeader label="Dirección" />
                <TableHeader label="Distrito" />
                <TableHeader label="Provincia" />
                <TableHeader label="Departamento" />
                <th className="w-24 min-w-[64px] text-center border border-stroke"></th>
              </tr>
            </thead>
            <tbody>
              {paginatedTiendas.length === 0 ? (
                <tr><TableCell>No hay tiendas asociadas</TableCell></tr>
              ) : (
                paginatedTiendas.map((t, idx) => (
                  <tr key={t.id} className={idx % 2 ? "bg-gray-50" : "bg-white"}>
                    <TableCell className="w-12 min-w-[48px] text-center">{t.id}</TableCell>
                    <TableCell>{t.nombre}</TableCell>
                    <TableCell>
                      <StatusBadge label={t.estado} variant={t.estado === "Activo" ? "success" : "neutral"} />
                    </TableCell>
                    <TableCell>{t.direccion}</TableCell>
                    <TableCell>{t.distrito}</TableCell>
                    <TableCell>{t.provincia}</TableCell>
                    <TableCell>{t.departamento}</TableCell>
                    <ActionMenuCell
                      buttons={[{
                        label: "Editar",
                        icon: <Pencil className="w-4 h-4 text-primary1" />,
                        onClick: () => console.log(`Editar tienda: ${t.nombre}`),
                      }, {
                        label: "Eliminar",
                        icon: <Trash2 className="w-4 h-4 text-red-600" />,
                        onClick: () => console.log(`Eliminar tienda: ${t.nombre}`),
                      }]}
                    />
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="flex justify-end items-center w-full mt-2">
            <span className="text-sm text-gray-500 mr-2">
              {`Mostrando ${filteredTiendas.length === 0 ? 0 : ((pageTienda - 1) * pageSizeTienda + 1)} - ${filteredTiendas.length === 0 ? 0 : Math.min(pageTienda * pageSizeTienda, filteredTiendas.length)} de ${filteredTiendas.length} resultados`}
            </span>
          </div>
          <div className="flex justify-center mt-4 w-full">
            <Pagination
              currentPage={pageTienda}
              totalPages={totalPagesTiendas}
              onPageChange={setPageTienda}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
