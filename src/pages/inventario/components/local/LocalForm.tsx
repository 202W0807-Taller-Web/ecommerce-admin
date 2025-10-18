import { Controller, type Control, type FieldErrors } from "react-hook-form";
import Input from "@components/Input";
import Select from "@components/Select";
import InputFile from "@components/InputFile";
import SelectsUbigeo from "../SelectsUbigeo";

type LocalFormProps = {
  control: Control<any>;
  errors: FieldErrors<any>;
  ubicacionRef?: React.RefObject<{ reset: () => void } | null>;
  localType: "almacen" | "tienda";
};

const LocalForm: React.FC<LocalFormProps> = ({
  control,
  errors,
  ubicacionRef,
  localType,
}) => {
  const labelNombre =
    localType === "almacen" ? "Nombre del almacén" : "Nombre de la tienda";

  const labelDireccion =
    localType === "almacen"
      ? "Dirección del almacén"
      : "Dirección de la tienda";

  return (
    <>
      <Controller
        name="nombre"
        control={control}
        rules={{ required: "El nombre es obligatorio" }}
        render={({ field }) => (
          <Input
            label="Nombre"
            placeholder={labelNombre}
            error={errors.nombre?.message as string}
            {...field}
          />
        )}
      />
      <Controller
        name="direccion"
        control={control}
        rules={{ required: "La dirección es obligatoria" }}
        render={({ field }) => (
          <Input
            label="Dirección"
            placeholder={labelDireccion}
            error={errors.direccion?.message as string}
            {...field}
          />
        )}
      />
      <Controller
        name="estado"
        control={control}
        rules={{ required: "Seleccione un estado" }}
        render={({ field }) => (
          <Select
            label="Estado"
            placeholder="Seleccione un estado"
            options={[
              { value: "ACTIVO", label: "Activo" },
              { value: "INACTIVO", label: "Inactivo" },
            ]}
            error={errors.estado?.message as string}
            {...field}
          />
        )}
      />
      <Controller
        name="ubigeo"
        control={control}
        rules={{
          validate: value => {
            if (!value) return "El ubigeo es obligatorio";
            const { departamento, provincia, distrito } = value;
            if (!departamento || !provincia || !distrito)
              return "Debe seleccionar todos los campos de ubigeo";
            return true;
          },
        }}
        render={({ field, fieldState }) => (
          <SelectsUbigeo
            value={field.value}
            onChange={field.onChange}
            error={fieldState.error?.message}
            ref={ubicacionRef}
          />
        )}
      />
      <Controller
        name="imagen"
        control={control}
        render={({ field }) => (
          <InputFile
            label="Imagen"
            maxFiles={1}
            onFilesChange={(_, dataUrls) => {
              field.onChange(dataUrls?.[0] || "");
            }}
          />
        )}
      />
    </>
  );
};

export default LocalForm;
