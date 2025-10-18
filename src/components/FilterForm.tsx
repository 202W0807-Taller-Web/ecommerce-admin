import React from "react";
import Button from "@components/Button";
import { Search, Loader } from "lucide-react";

interface FilterFormProps {
  children: React.ReactNode;
  disabled?: boolean;
  onSubmit?: (formData: Record<string, string>) => void;
  onReset?: () => void;
  searchText?: string;
  clearText?: string;
}

const FilterForm: React.FC<FilterFormProps> = ({
  disabled = false,
  children,
  onSubmit,
  onReset,
  searchText = "Buscar",
  clearText = "Limpiar",
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!onSubmit) return;

    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      if (typeof value === "string") {
        data[key] = value.trim();
      }
    });

    onSubmit(data);
  };

  const handleReset = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const form = e.currentTarget.form;
    if (form) form.reset();
    onReset?.();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <fieldset disabled={disabled} className="flex flex-col gap-4 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 w-full">
          {children}
          {/* Botones de acción */}
          <div className="flex gap-3 sm:ml-auto">
            <button
              type="button"
              onClick={handleReset}
              className="cursor-pointer text-body-color px-3 py-2 rounded-md border-none bg-transparent hover:text-secondary-color disabled:cursor-not-allowed"
            >
              {clearText}
            </button>
            <Button
              type="submit"
              variant="primary"
              icon={disabled ? Loader : Search}
              text={disabled ? "Buscando" : searchText}
              disabled={disabled}
            />
          </div>
        </div>
      </fieldset>
    </form>
  );
};

export default FilterForm;
