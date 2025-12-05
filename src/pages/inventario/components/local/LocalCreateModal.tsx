import { useForm } from "react-hook-form";
import ModalForm from "@components/ModalForm";
import LocalForm from "./LocalForm";
import { useCreateLocal } from "../../hooks/local/useCreateLocal";
import type { LocalBody } from "@services/inventario-envios/local/types/local";

interface LocalCreateModalProps {
  localType: "almacenes" | "tiendas";
  isOpen: boolean;
  closeModal: () => void;
}

export const LocalCreateModal: React.FC<LocalCreateModalProps> = ({
  localType,
  isOpen,
  closeModal,
}) => {
  const { control, handleSubmit, formState, reset } = useForm<
    Omit<LocalBody, "id_tipo_local">
  >({
    defaultValues: {
      nombre: "",
      direccion: "",
      estado: "ACTIVO",
      ubigeo: {
        departamento: "",
        provincia: "",
        distrito: "",
      },
      imagen: "",
    },
  });

  const { mutate, isPending } = useCreateLocal(localType);

  const onSubmit = handleSubmit(data => {
    mutate(data, {
      onSuccess: () => {
        console.log("data", data);
        alert("El local se creo exitosamente");
        closeModal();
        reset();
      },
      onError: error => {
        console.log("data", data);
        console.error("Error al crear el local: ", error);
        alert("No se pudo crear el local");
      },
    });
  });

  return (
    <ModalForm
      title={`Crear ${localType === "almacenes" ? "Almacén" : "Tienda"}`}
      isOpen={isOpen}
      closeModal={closeModal}
      onSubmit={onSubmit}
      isLoading={isPending}
    >
      <LocalForm
        control={control}
        errors={formState.errors}
        localType={localType === "almacenes" ? "almacen" : "tienda"}
      />
    </ModalForm>
  );
};
