import { useQuery } from "@tanstack/react-query";
import Select from "@components/Select";
import type { Option } from "../../../types/ui/Option";
import { getCategorias } from "@services/inventario-envios/inventory/api/categorias";
import type { Categoria } from "@services/inventario-envios/inventory/types/categoria";

type SelectCategoriaProps = {
  className?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
};

const SelectCategoria = ({
  className = "",
  defaultValue,
  value,
  onChange,
  error,
}: SelectCategoriaProps) => {
  const {
    data: categorias = [],
    isLoading,
    isError,
  } = useQuery<Categoria[]>({
    queryKey: ["categorias"],
    queryFn: getCategorias,
  });

  const options: Option[] = categorias?.map((categoria: Categoria) => ({
    value: categoria.nombre,
    label: categoria.nombre,
  }));

  const placeholder = isLoading
    ? "Cargando categorías..."
    : isError
      ? "Error al cargar categorías"
      : "Selecciona una categoría";

  return (
    <Select
      name="categoria"
      label="Categoria"
      placeholder={placeholder}
      className={className}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      options={options}
      error={error}
      disabled={isLoading || isError}
    />
  );
};

export default SelectCategoria;
