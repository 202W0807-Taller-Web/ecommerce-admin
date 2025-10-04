import { useState } from "react";
import Input from "../../components/Input";
import FileAction from "../../components/FileAction";
import { TableHeader, TableCell, StatusBadge, ActionMenuCell } from "../../components/Table";
import Pagination from "../../components/Pagination";
import { Search } from "lucide-react";
import Select from "../../components/Select";

import { useQuery } from "@tanstack/react-query";
import type { Producto } from "../../modules/inventario/types/producto";
import { getProductos } from "../../modules/inventario/api/productos";

export default function ProductosPage() {
    const [busqueda, setBusqueda] = useState("");
    const [categoria, setCategoria] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 10;

    // Get
    const {
        isPending,
        isError,
        data: productosData,
        error,
    } = useQuery<Producto[]>({
        queryKey: ["productos"],
        queryFn: getProductos,
    });

    if (isPending) return <span>Loading...</span>;

    if (isError) return <span>Error: {error.message}</span>;

    // Categorias
    const categorias = Array.from(new Set(productosData.map(p => p.categoria)));
    const categoriaOptions = categorias.map(c => ({ value: c, label: c }));
    // Filtros
    const filtered = productosData.filter((p) =>
        p.producto.toLowerCase().includes(busqueda.toLowerCase()) &&
        (categoria ? p.categoria === categoria : true)
    );
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

    const handleClear = () => {
        setBusqueda("");
        setCategoria("");
        setPage(1);
    };

    return (
        <div className="p-2 sm:p-4 md:p-6 w-full max-w-full overflow-x-auto">
            <h1 className="text-2xl font-bold mb-4">Productos</h1>

            {/* Filtros */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 mb-6 items-end w-full">
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
                <button
                    type="button"
                    onClick={handleClear}
                    className="text-body-color px-3 py-2 rounded-md border-none bg-transparent hover:text-secondary-color"
                >
                    Clear all
                </button>
            </div>

            {/* Acciones */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 my-10 w-full">
                <FileAction text="Importar data" variant="upload" />
                <FileAction text="Exportar data" variant="download" />
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto w-full">
                <table className="min-w-[600px] w-full border-collapse mb-2 text-xs sm:text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <TableHeader label="#" className="w-12 min-w-[48px] text-center" />
                            <TableHeader label="Imagen" />
                            <TableHeader label="SKU" />
                            <TableHeader label="Producto" />
                            <TableHeader label="Categoría" />
                            <TableHeader label="Stk. Global Disponible" />
                            <TableHeader label="Stk. Global Reservado" />
                            <TableHeader label="Stk. Global Total" />
                            <TableHeader label="Estado stk." />
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
                                    <ActionMenuCell/>
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
        </div>
    );
}
