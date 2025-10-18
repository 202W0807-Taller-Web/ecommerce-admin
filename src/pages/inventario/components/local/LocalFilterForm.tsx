import { useRef, useState } from "react";
import FilterForm from "@components/FilterForm";
import Input from "@components/Input";
import SelectsUbigeo from "../SelectsUbigeo";
import { useLocalesFilterUrl } from "../../hooks/local/useLocalesFilterUrl";

const LocalFilterForm = ({
  disabled = false,
  filters,
}: {
  disabled?: boolean;
  filters: ReturnType<typeof useLocalesFilterUrl>;
}) => {
  const ubicacionRef = useRef<{ reset: () => void }>(null);
  const [ubigeo, setUbigeo] = useState<{ label: string; value: string }>({
    label: "",
    value: "",
  });

  const { nombre, setParams } = filters;

  const [nombreInput, setNombreInput] = useState(nombre);

  const handleSubmit = () => {
    setParams({
      nombre: nombreInput.trim(),
      departamento: ubigeo.label === "departamento" ? ubigeo.value : "",
      provincia: ubigeo.label === "provincia" ? ubigeo.value : "",
      distrito: ubigeo.label === "distrito" ? ubigeo.value : "",
    });
  };

  // Limpiar todo
  const handleReset = () => {
    ubicacionRef.current?.reset();
    setUbigeo({ label: "", value: "" });
    setParams({
      nombre: "",
      departamento: "",
      provincia: "",
      distrito: "",
    });
    setNombreInput("");
  };

  return (
    <FilterForm
      onSubmit={handleSubmit}
      onReset={handleReset}
      disabled={disabled}
    >
      <Input
        type="text"
        name="nombre"
        label="Nombre"
        placeholder="Buscar por nombre"
        value={nombreInput.trimStart()}
        onChange={e => setNombreInput(e.target.value)}
        className="sm:flex-1"
      />
      <SelectsUbigeo ref={ubicacionRef} onChangeUbicacion={setUbigeo} />
    </FilterForm>
  );
};

export default LocalFilterForm;
