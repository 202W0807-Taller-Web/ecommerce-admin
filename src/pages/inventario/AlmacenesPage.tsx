
import React, { useState } from "react";
import Modal from "../../components/Modal";
import Input from "../../components/Input";
import InputFile from "../../components/InputFile";
import Button from "../../components/Button";
import FileAction from "../../components/FileAction";
import { TableHeader, TableCell, StatusBadge, ActionMenuCell } from "../../components/Table";
import { Pencil, Trash2, Store, PackagePlus, Eye } from "lucide-react";
import Pagination from "../../components/Pagination";
import { PlusCircle } from "lucide-react";
import { Search } from "lucide-react";
import { RefreshCw } from "lucide-react";
import Select from "../../components/Select";

const almacenesData = [
    {
        id: 1,
        imagen: "https://i.pravatar.cc/40?img=1",
        nombre: "Almacen Central",
        estado: "Activo",
        direccion: "Av. Principal 123",
        distrito: "Miraflores",
        provincia: "Lima",
        departamento: "Lima",
    },
    {
        id: 2,
        imagen: "https://i.pravatar.cc/40?img=2",
        nombre: "Almacen Secundario",
        estado: "Inactivo",
        direccion: "Calle Secundaria 456",
        distrito: "San Isidro",
        provincia: "Lima",
        departamento: "Lima",
    },
    // ...más almacenes
];


// Obtiene valores únicos para los selects
const distritos = Array.from(new Set(almacenesData.map(a => a.distrito)));
const provincias = Array.from(new Set(almacenesData.map(a => a.provincia)));
const departamentos = Array.from(new Set(almacenesData.map(a => a.departamento)));

const distritoOptions = distritos.map(d => ({ value: d, label: d }));
const provinciaOptions = provincias.map(p => ({ value: p, label: p }));
const departamentoOptions = departamentos.map(dep => ({ value: dep, label: dep }));

export default function AlmacenesPage() {
    const [busqueda, setBusqueda] = useState("");
    const [distrito, setDistrito] = useState("");
    const [provincia, setProvincia] = useState("");
    const [departamento, setDepartamento] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 10;

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState({
        nombre: "",
        estado: "Activo",
        direccion: "",
        distrito: "",
        provincia: "",
        departamento: "",
        imagen: ""
    });

    // Filtros
    const filtered = almacenesData.filter((a) =>
        a.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
        (distrito ? a.distrito === distrito : true) &&
        (provincia ? a.provincia === provincia : true) &&
        (departamento ? a.departamento === departamento : true)
    );
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

    const handleClear = () => {
        setBusqueda("");
        setDistrito("");
        setProvincia("");
        setDepartamento("");
        setPage(1);
    };

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };
    const handleAccept = () => {
        // Aquí podrías agregar el almacén a la lista
        setModalOpen(false);
    };

    return (
        <div className="p-2 sm:p-4 md:p-6 w-full max-w-full overflow-x-auto">
            <h1 className="text-2xl font-bold mb-4">Almacenes</h1>

            {/* Filtros */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 mb-6 items-end w-full">
                <div className="w-full sm:w-64 min-w-0">
                    <Input
                        label="Buscar por nombre"
                        placeholder="Nombre de almacén"
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                        rightIcon={Search}
                    />
                </div>
                <div className="w-full sm:w-48 min-w-0">
                    <Select
                        label="Distrito"
                        placeholder="Todos"
                        options={distritoOptions}
                        value={distrito}
                        onChange={e => setDistrito(e.target.value)}
                    />
                </div>
                <div className="w-full sm:w-48 min-w-0">
                    <Select
                        label="Provincia"
                        placeholder="Todas"
                        options={provinciaOptions}
                        value={provincia}
                        onChange={e => setProvincia(e.target.value)}
                    />
                </div>
                <div className="w-full sm:w-48 min-w-0">
                    <Select
                        label="Departamento"
                        placeholder="Todos"
                        options={departamentoOptions}
                        value={departamento}
                        onChange={e => setDepartamento(e.target.value)}
                    />
                </div>
                <button
                    type="button"
                    onClick={handleClear}
                    className="text-body-color px-3 py-2 rounded-md border-none bg-transparent hover:text-secondary-color"
                >
                    Clear all
                </button>
                <div className="flex-1 flex justify-end">
                    <Button
                        text="Añadir almacén"
                        icon={PlusCircle}
                        iconPosition="right"
                        variant="primary"
                        onClick={handleOpenModal}
                    />
                </div>
            </div>

            {/* Acciones */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 my-10 w-full">
                <FileAction text="Importar data" variant="upload" />
                <FileAction text="Exportar data" variant="download" />
                <button
                    type="button"
                    className="cursor-pointer flex items-center text-sm gap-2 text-body-color underline hover:text-secondary-color"
                >
                    <span>Actualizar stock</span>
                    <RefreshCw className="h-5 w-5" />
                </button>
            </div>

            {/* Tabla */}
            <div className="w-full overflow-auto">
                <table className="overflow-visible min-w-[600px] w-full border-collapse mb-2 text-xs sm:text-sm">
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
                        {paginated.length === 0 ? (
                            <tr><TableCell>No hay almacenes</TableCell></tr>
                        ) : (
                            paginated.map((a, idx) => (
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
                                        buttons={[
                                            {
                                                label: "Ver detalles",
                                                icon: <Eye className="w-4 h-4 text-blue-600" />,
                                                onClick: () => console.log(`Ver detalles de: ${a.nombre}`),
                                            },
                                            {
                                                label: "Actualizar",
                                                icon: <Pencil className="w-4 h-4 text-primary1" />,
                                                onClick: () => console.log(`Actualizar almacén: ${a.nombre}`),
                                            },
                                            {
                                                label: "Eliminar",
                                                icon: <Trash2 className="w-4 h-4 text-red-600" />,
                                                onClick: () => console.log(`Eliminar almacén: ${a.nombre}`),
                                            },
                                            {
                                                label: "Asignar tiendas",
                                                icon: <Store className="w-4 h-4 text-secondary-color" />,
                                                onClick: () => console.log(`Asignar tiendas a: ${a.nombre}`),
                                            },
                                            {
                                                label: "Asignar productos",
                                                icon: <PackagePlus className="w-4 h-4 text-green-600" />,
                                                onClick: () => console.log(`Asignar productos a: ${a.nombre}`),
                                            },
                                        ]}
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
            {/* Modal para agregar almacén */}
            <Modal
                open={modalOpen}
                title="Agregar almacén"
                onCancel={handleCloseModal}
                onAccept={handleAccept}
            >
                <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                        <Input
                            label="Nombre"
                            name="nombre"
                            value={form.nombre}
                            onChange={handleFormChange}
                            placeholder="Nombre del almacén"
                        />
                    </div>


                    <div className="sm:col-span-2">
                        <Input
                            label="Dirección"
                            name="direccion"
                            value={form.direccion}
                            onChange={handleFormChange}
                            placeholder="Dirección"
                        />
                    </div>

                    <div>
                        <Select
                            label="Estado"
                            options={[{ value: "Activo", label: "Activo" }, { value: "Inactivo", label: "Inactivo" }]}
                            value={form.estado}
                            onChange={handleFormChange}
                        />
                    </div>

                    <div>
                        <Select
                            label="Departamento"
                            placeholder="Selecciona departamento"
                            options={departamentoOptions}
                            value={form.departamento}
                            onChange={handleFormChange}
                        />
                    </div>

                    <div>
                        <Select
                            label="Provincia"
                            placeholder="Selecciona provincia"
                            options={provinciaOptions}
                            value={form.provincia}
                            onChange={handleFormChange}
                        />
                    </div>

                    <div>
                        <Select
                            label="Distrito"
                            placeholder="Selecciona distrito"
                            options={distritoOptions}
                            value={form.distrito}
                            onChange={handleFormChange}
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <InputFile
                            label="Imagen"
                            name="imagen"
                            maxFiles={1}
                            onFilesChange={(_, dataUrls) => {
                                // tomar primer dataUrl si existe
                                setForm(f => ({ ...f, imagen: dataUrls && dataUrls.length ? dataUrls[0] : "" }));
                            }}
                        />
                    </div>
                </form>
            </Modal>
        </div>
    );
}