
    import React from "react";
    import Table from "../../components/Table";

    const columns = [
        { key: "id", label: "#" },
        { key: "nombre", label: "Nombre" },
        { key: "estado", label: "Estado" },
        { key: "direccion", label: "Dirección" },
        { key: "capacidad", label: "Capacidad" },
        { key: "encargado", label: "Encargado" },
    ];

    const data = [
        {
            id: 1,
            nombre: "Almacén Central",
            estado: "Activo",
            direccion: "Av. Principal 123",
            capacidad: "5000",
            encargado: "Juan Pérez",
        },
        // Puedes agregar más datos de ejemplo aquí
    ];

    export default function AlmacenesPage() {
        return (
            <div>
                <h1>Almacenes</h1>
                <Table columns={columns} data={data} />
            </div>
        );
    }