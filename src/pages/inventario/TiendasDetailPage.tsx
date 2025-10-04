import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Select from "../../components/Select";
import FileAction from "../../components/FileAction";
import { TableHeader, TableCell, StatusBadge, ActionMenuCell } from "../../components/Table";
import Pagination from "../../components/Pagination";
import { Pencil, PackagePlus, Trash2, Search } from "lucide-react";

// Datos simulados
const tiendasData = [
  {
    id: 1,
    nombre: "Tienda Centro",
    estado: "Activo",
    direccion: "Av. Comercio 100",
    distrito: "Miraflores",
    provincia: "Lima",
    departamento: "Lima",
    imagen: "https://i.pravatar.cc/80?img=3",
    almacen: "Almacen Central",
  },
  {
    id: 2,
    nombre: "Tienda Norte",
    estado: "Inactivo",
    direccion: "Calle Norte 200",
    distrito: "San Isidro",
    provincia: "Lima",
    departamento: "Lima",
    imagen: "https://i.pravatar.cc/80?img=4",
    almacen: "Almacen Secundario",
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

const almacenes = Array.from(new Set(tiendasData.map(t => t.almacen)));
const almacenesOptions = almacenes.map(a => ({ value: a, label: a }));
const distritos = Array.from(new Set(tiendasData.map(t => t.distrito)));
const provincias = Array.from(new Set(tiendasData.map(t => t.provincia)));
const departamentos = Array.from(new Set(tiendasData.map(t => t.departamento)));
const distritoOptions = distritos.map(d => ({ value: d, label: d }));
const provinciaOptions = provincias.map(p => ({ value: p, label: p }));
const departamentoOptions = departamentos.map(dep => ({ value: dep, label: dep }));
const categorias = Array.from(new Set(productosData.map(p => p.categoria)));
const categoriaOptions = categorias.map(c => ({ value: c, label: c }));

export default function TiendasDetailPage() {
  // Datos simulados de almacenes asociados
  const almacenesData = [
    {
      id: 1,
      nombre: "Almacen Central",
      estado: "Activo",
      direccion: "Av. Principal 123",
      distrito: "Miraflores",
      provincia: "Lima",
      departamento: "Lima",
      imagen: "https://i.pravatar.cc/80?img=1",
    },
    {
      id: 2,
      nombre: "Almacen Secundario",
      estado: "Inactivo",
      direccion: "Calle Secundaria 456",
      distrito: "San Isidro",
      provincia: "Lima",
      departamento: "Lima",
      imagen: "https://i.pravatar.cc/80?img=2",
    },
  ];

  // Filtros almacenes
  const [busquedaAlmacen, setBusquedaAlmacen] = useState("");
  const [distritoAlmacen, setDistritoAlmacen] = useState("");
  const [provinciaAlmacen, setProvinciaAlmacen] = useState("");
  const [departamentoAlmacen, setDepartamentoAlmacen] = useState("");
  const [pageAlmacen, setPageAlmacen] = useState(1);
  const pageSizeAlmacen = 10;

  // Opciones para selects de almacenes
  const distritosAlmacen = Array.from(new Set(almacenesData.map(a => a.distrito)));
  const provinciasAlmacen = Array.from(new Set(almacenesData.map(a => a.provincia)));
  const departamentosAlmacen = Array.from(new Set(almacenesData.map(a => a.departamento)));
  const distritoOptionsAlmacen = distritosAlmacen.map(d => ({ value: d, label: d }));
  const provinciaOptionsAlmacen = provinciasAlmacen.map(p => ({ value: p, label: p }));
  const departamentoOptionsAlmacen = departamentosAlmacen.map(dep => ({ value: dep, label: dep }));

  // Filtrado almacenes
  const filteredAlmacenes = almacenesData.filter((a) =>
    a.nombre.toLowerCase().includes(busquedaAlmacen.toLowerCase()) &&
    (distritoAlmacen ? a.distrito === distritoAlmacen : true) &&
    (provinciaAlmacen ? a.provincia === provinciaAlmacen : true) &&
    (departamentoAlmacen ? a.departamento === departamentoAlmacen : true)
  );
  const totalPagesAlmacenes = Math.max(1, Math.ceil(filteredAlmacenes.length / pageSizeAlmacen));
  const paginatedAlmacenes = filteredAlmacenes.slice((pageAlmacen - 1) * pageSizeAlmacen, pageAlmacen * pageSizeAlmacen);
  const { id } = useParams();
  const tienda = tiendasData.find(t => t.id === Number(id)) || tiendasData[0];

  // Filtros productos
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("");
  const [almacen, setAlmacen] = useState("");
  const [distrito, setDistrito] = useState("");
  const [provincia, setProvincia] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Filtrado productos
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
        <h1 className="text-2xl font-bold">{tienda.nombre}</h1>
        <Button text="Editar" icon={Pencil} variant="primary" />
      </div>
      
      {/* Datos de la tienda */}
      <div className="flex flex-col sm:flex-row gap-6 mb-6 items-center">
        <img src={tienda.imagen} alt={tienda.nombre} className="w-40 h-40 rounded-lg border" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <div className="flex flex-col gap-2">
            <div><b>Dirección:</b> {tienda.direccion}</div>
            <div><b>Estado:</b> <span className={`${tienda.estado.toLowerCase() === "activo" ? 'text-green-700' : 'text-red-700'}`}>{tienda.estado}</span></div>
            <div><b>Distrito:</b> {tienda.distrito}</div>
          </div>
          <div className="flex flex-col gap-2">
            <div><b>Provincia:</b> {tienda.provincia}</div>
            <div><b>Departamento:</b> {tienda.departamento}</div>
            <div><b>Almacén:</b> {tienda.almacen}</div>
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
              <TableHeader label="Categoría" />
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
                  <TableCell>{p.categoria}</TableCell>
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
      {/* Almacenes asociados */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Almacenes asociados</h2>
        {/* Filtros almacenes */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-end w-full">
          <div className="w-full sm:w-64 min-w-0">
            <Input
              label="Buscar por nombre"
              placeholder="Nombre de almacén"
              value={busquedaAlmacen}
              onChange={e => setBusquedaAlmacen(e.target.value)}
              rightIcon={Search}
            />
          </div>
          <div className="w-full sm:w-48 min-w-0">
            <Select
              label="Distrito"
              placeholder="Todos"
              options={distritoOptionsAlmacen}
              value={distritoAlmacen}
              onChange={e => setDistritoAlmacen(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-48 min-w-0">
            <Select
              label="Provincia"
              placeholder="Todas"
              options={provinciaOptionsAlmacen}
              value={provinciaAlmacen}
              onChange={e => setProvinciaAlmacen(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-48 min-w-0">
            <Select
              label="Departamento"
              placeholder="Todos"
              options={departamentoOptionsAlmacen}
              value={departamentoAlmacen}
              onChange={e => setDepartamentoAlmacen(e.target.value)}
            />
          </div>
        </div>
        {/* Tabla almacenes */}
        <div className="overflow-x-auto w-full">
          <table className="min-w-[600px] w-full border-collapse mb-2 text-xs sm:text-sm">
            <thead className="bg-gray-50">
              <tr>
                <TableHeader label="#" className="w-12 min-w-[48px] text-center" />
                <TableHeader label="Imagen" />
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
              {paginatedAlmacenes.length === 0 ? (
                <tr><TableCell>No hay almacenes asociados</TableCell></tr>
              ) : (
                paginatedAlmacenes.map((a, idx) => (
                  <tr key={a.id} className={idx % 2 ? "bg-gray-50" : "bg-white"}>
                    <TableCell className="w-12 min-w-[48px] text-center">{a.id}</TableCell>
                    <TableCell><img src={a.imagen} alt={a.nombre} className="w-8 h-8 rounded-full" /></TableCell>
                    <TableCell>{a.nombre}</TableCell>
                    <TableCell>
                      <StatusBadge label={a.estado} variant={a.estado === "Activo" ? "success" : "neutral"} />
                    </TableCell>
                    <TableCell>{a.direccion}</TableCell>
                    <TableCell>{a.distrito}</TableCell>
                    <TableCell>{a.provincia}</TableCell>
                    <TableCell>{a.departamento}</TableCell>
                    <ActionMenuCell
                      buttons={[{
                        label: "Editar",
                        icon: <Pencil className="w-4 h-4 text-primary1" />,
                        onClick: () => console.log(`Editar almacén: ${a.nombre}`),
                      }, {
                        label: "Eliminar",
                        icon: <Trash2 className="w-4 h-4 text-red-600" />,
                        onClick: () => console.log(`Eliminar almacén: ${a.nombre}`),
                      }]}
                    />
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="flex justify-end items-center w-full mt-2">
            <span className="text-sm text-gray-500 mr-2">
              {`Mostrando ${filteredAlmacenes.length === 0 ? 0 : ((pageAlmacen - 1) * pageSizeAlmacen + 1)} - ${filteredAlmacenes.length === 0 ? 0 : Math.min(pageAlmacen * pageSizeAlmacen, filteredAlmacenes.length)} de ${filteredAlmacenes.length} resultados`}
            </span>
          </div>
          <div className="flex justify-center mt-4 w-full">
            <Pagination
              currentPage={pageAlmacen}
              totalPages={totalPagesAlmacenes}
              onPageChange={setPageAlmacen}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
