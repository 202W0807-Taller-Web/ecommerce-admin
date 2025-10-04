import Input from "@components/Input";
import InputFile from "@components/InputFile";
import Select from "@components/Select";
import { Controller, type Control, type FieldErrors } from "react-hook-form";

type TiendaFormProps = {
  control: Control<any>;
  errors: FieldErrors<any>;
};

const TiendaForm: React.FC<TiendaFormProps> = ({ control, errors }) => {
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
              error={errors.dirreccion?.message as string}
              {...field}
            />
          )}
        />
      </div>
      <Controller
        name="estado"
        control={control}
        render={({ field }) => (
          <Select
            label="Estado"
            options={[
              { value: "Activo", label: "Activo" },
              { value: "Inactivo", label: "Inactivo" },
            ]}
            {...field}
          />
        )}
      />

      {/* Repite para almacen, departamento, provincia, distrito */}

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
