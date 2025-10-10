import { useState, useImperativeHandle, forwardRef } from "react";
import { useQuery } from "@tanstack/react-query";
import Select from "@components/Select";
import type { Option } from "../../../types/ui/Option";
import type {
  Departamento,
  Provincia,
  Distrito,
} from "../../../modules/inventario-envios/local/types/ubigeo";
import {
  getDepartamentos,
  getProvincias,
  getDistritos,
} from "../../../modules/inventario-envios/local/api/ubigeos";

type SelectsUbigeoProps = {
  className?: string;
  onChange?: (value: any) => void;
  onChangeUbicacion?: ({
    label,
    value,
  }: {
    label: string;
    value: string;
  }) => void;
  error?: string;
};

const SelectsUbigeo = forwardRef(
  (
    { className = "", onChange, onChangeUbicacion, error }: SelectsUbigeoProps,
    ref
  ) => {
    const [departamento, setDepartamento] = useState("");
    const [provincia, setProvincia] = useState("");
    const [distrito, setDistrito] = useState("");

    // Reset manual
    useImperativeHandle(ref, () => ({
      reset: () => {
        setDepartamento("");
        setProvincia("");
        setDistrito("");
        onChangeUbicacion?.({ label: "", value: "" });
      },
    }));

    // Queries
    const {
      data: departamentosData = [],
      isLoading: loadingDepartamentos,
      error: errorDepartamentos,
    } = useQuery<Departamento[]>({
      queryKey: ["departamentos"],
      queryFn: getDepartamentos,
    });

    const {
      data: provinciasData = [],
      isLoading: loadingProvincias,
      error: errorProvincias,
    } = useQuery<Provincia[]>({
      queryKey: ["provincias", departamento],
      queryFn: () => getProvincias(departamento),
      enabled: !!departamento,
    });

    const {
      data: distritosData = [],
      isLoading: loadingDistritos,
      error: errorDistritos,
    } = useQuery<Distrito[]>({
      queryKey: ["distritos", provincia],
      queryFn: () => getDistritos(provincia),
      enabled: !!provincia,
    });

    // Opciones formateadas
    const departamentos: Option[] = departamentosData.map(d => ({
      value: String(d.id),
      label: d.nombre,
    }));

    const provincias: Option[] = provinciasData.map(p => ({
      value: String(p.id),
      label: p.nombre,
    }));

    const distritos: Option[] = distritosData.map(d => ({
      value: String(d.id),
      label: d.nombre,
    }));

    // Handlers
    const handleDepartamentoChange = (
      e: React.ChangeEvent<HTMLSelectElement>
    ) => {
      const val = e.target.value;
      setDepartamento(val);
      setProvincia("");
      setDistrito("");
      onChangeUbicacion?.({ label: "departamento", value: val });
      onChange?.({ departamento: val, provincia: "", distrito: "" });
    };

    const handleProvinciaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value;
      setProvincia(val);
      setDistrito("");
      onChangeUbicacion?.({ label: "provincia", value: val });
      onChange?.({ departamento, provincia: val, distrito: "" });
    };

    const handleDistritoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value;
      setDistrito(val);
      onChangeUbicacion?.({ label: "distrito", value: val });
      onChange?.({ departamento, provincia, distrito: val });
    };

    return (
      <div
        className={`flex flex-col sm:flex-row flex-wrap gap-4 sm:items-end w-full ${className}`}
      >
        <Select
          label="Departamento"
          placeholder={
            loadingDepartamentos ? "Cargando..." : "Seleccione un departamento"
          }
          options={departamentos}
          value={departamento}
          onChange={handleDepartamentoChange}
          disabled={loadingDepartamentos}
          error={errorDepartamentos ? "Error al cargar departamentos" : error}
          className="sm:flex-1"
        />

        <Select
          label="Provincia"
          placeholder={
            departamento
              ? loadingProvincias
                ? "Cargando..."
                : "Seleccione una provincia"
              : "Seleccione un departamento primero"
          }
          options={provincias}
          value={provincia}
          onChange={handleProvinciaChange}
          disabled={!departamento || loadingProvincias}
          error={errorProvincias ? "Error al cargar provincias" : error}
          className="sm:flex-1"
        />

        <Select
          label="Distrito"
          placeholder={
            provincia
              ? loadingDistritos
                ? "Cargando..."
                : "Seleccione un distrito"
              : "Seleccione una provincia primero"
          }
          options={distritos}
          value={distrito}
          onChange={handleDistritoChange}
          disabled={!provincia || loadingDistritos}
          error={errorDistritos ? "Error al cargar distritos" : error}
          className="sm:flex-1"
        />
      </div>
    );
  }
);

SelectsUbigeo.displayName = "SelectsUbigeo";
export default SelectsUbigeo;
