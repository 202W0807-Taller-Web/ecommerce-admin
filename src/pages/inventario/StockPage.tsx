import FilterForm from "@components/FilterForm";
import StockDataTable from "./components/stock/StockDataTable";
import Input from "@components/Input";
import Select from "@components/Select";
import MovStockDataTable from "./components/stock/MovStockDataTable";

export default function StockPage() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Stock de productos</h1>
      <FilterForm>
        <Input
          type="text"
          name="nombre"
          label="Nombre"
          placeholder="Nombre de producto"
        />
        <Select
          label="Categoría"
          placeholder="Seleccione una categoría"
          options={[
            { value: "tecnologia", label: "Calzado" },
            { value: "moda", label: "Ropa hombre" },
            { value: "hogar", label: "Ropa mujer" },
          ]}
        />
      </FilterForm>
      <StockDataTable page={1} limit={3} />
      <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3 border-b pb-1">
        Historial de movimiento
      </h2>
      <MovStockDataTable />
    </>
  );
}
