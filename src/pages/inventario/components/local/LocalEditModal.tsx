import { useEffect } from "react";
import { useForm } from "react-hook-form";
import ModalForm from "@components/ModalForm";
import LocalForm from "./LocalForm";
import { useUpdateLocal } from "../../hooks/local/useUpdateLocal";
import type {
  LocalBody,
  LocalListItem,
} from "@services/inventario-envios/local/types/local";

interface LocalEditModalProps {
  localType: "almacenes" | "tiendas";
  isOpen: boolean;
  closeModal: () => void;
  localData: LocalListItem | null;
}

export const LocalEditModal: React.FC<LocalEditModalProps> = ({
  localType,
  isOpen,
  closeModal,
  localData,
}) => {
  const { control, handleSubmit, formState, reset } = useForm<
    Omit<LocalBody, "id_tipo_local">
  >({
    defaultValues: {
      nombre: "",
      direccion: "",
      estado: "ACTIVO",
      ubigeo: { departamento: "", provincia: "", distrito: "" },
      imagen: "",
    },
  });

  const { mutate, isPending } = useUpdateLocal(localType);

  useEffect(() => {
    if (localData) {
      reset({
        nombre: localData.nombre,
        direccion: localData.direccion,
        estado: localData.estado as "ACTIVO" | "INACTIVO",
        ubigeo: {
          departamento: String(localData.departamento?.id) ?? "",
          provincia: String(localData.provincia?.id) ?? "",
          distrito: String(localData.distrito?.id) ?? "",
        },
        imagen: localData.imagen || "",
      });
    }
  }, [localData, reset]);

  const onSubmit = handleSubmit(data => {
    if (!localData) return;

    mutate(
      { id: localData.id, data },
      {
        onSuccess: () => {
          alert("El local se actualizo exitosamente");
          closeModal();
          reset();
        },
        onError: error => {
          console.error("Error al actualizar el local: ", error);
          alert("No se pudo actualizar el local");
        },
      }
    );
  });

  return (
    <ModalForm
      title={`Editar ${localType === "almacenes" ? "Almacén" : "Tienda"}`}
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
