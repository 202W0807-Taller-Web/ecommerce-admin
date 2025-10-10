import Input from "@components/Input";
import InputFile from "@components/InputFile";
import Select from "@components/Select";
import { Controller, type Control, type FieldErrors } from "react-hook-form";
import SelectsUbigeo from "./SelectsUbigeo";

type TiendaFormProps = {
  control: Control<any>;
  errors: FieldErrors<any>;
  ubicacionRef?: React.RefObject<{
    reset: () => void;
  } | null>;
};

const TiendaForm: React.FC<TiendaFormProps> = ({
  control,
  errors,
  ubicacionRef,
}) => {
  return (
    <>
      <div className="sm:col-span-2">
        <Controller
          name="nombre"
          control={control}
          rules={{ required: "El nombre es obligatorio" }}
          render={({ field }) => (
            <Input
              label="Nombre"
              placeholder="Nombre de la tienda"
              error={errors.nombre?.message as string}
              {...field}
            />
          )}
        />
      </div>
      <div className="sm:col-span-2">
        <Controller
          name="direccion"
          control={control}
          rules={{ required: "La dirección es obligatoria" }}
          render={({ field }) => (
            <Input
              label="Dirección"
              placeholder="Dirección de la tienda"
              error={errors.direccion?.message as string}
              {...field}
            />
          )}
        />
      </div>
      <Controller
        name="estado"
        control={control}
        rules={{ required: "Seleccione un estado" }}
        render={({ field }) => (
          <Select
            label="Estado"
            placeholder="Seleccione un estado"
            options={[
              { value: "Activo", label: "Activo" },
              { value: "Inactivo", label: "Inactivo" },
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
            error={fieldState.error?.message}
            {...field}
            ref={ubicacionRef}
          />
        )}
      />

      <div className="sm:col-span-2">
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
      </div>
    </>
  );
};

export default TiendaForm;
