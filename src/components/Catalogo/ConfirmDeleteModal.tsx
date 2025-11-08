
export default function ConfirmDeleteModal({
  message,
  onCancel,
  onConfirm,
}: {
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* overlay separado para atenuar el fondo */}
      <div className="absolute inset-0 bg-black/40" />

      {/* modal encima del overlay - fondo semi-transparente */}
      <div className="relative w-full max-w-sm bg-white/80 backdrop-blur-sm rounded-lg p-5 shadow z-10 border border-[var(--color-primary5)]/10">
        <p className="text-[var(--color-primary6)] mb-4">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-3 py-2 rounded-md border border-[var(--color-primary5)] hover:bg-[var(--color-primary5)] hover:text-white text-[var(--color-primary6)] transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-2 rounded-md text-white bg-[var(--color-primary1)] hover:bg-[var(--color-primary2)]"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
