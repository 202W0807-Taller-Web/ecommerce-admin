import React from "react";
import { ChevronDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Option = {
  value: string;
  label: string;
};

type SelectProps = {
  label?: string;
  placeholder?: string;
  options: Option[];
  value?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;

  /** Iconos opcionales */
  leftIcon?: LucideIcon;

  /** Mensajes */
  helperText?: string;
  error?: string;
  success?: string;

  className?: string;
};

const Select: React.FC<SelectProps> = ({
  label,
  placeholder,
  options,
  value,
  onChange,
  leftIcon: LeftIcon,
  helperText,
  error,
  success,
  disabled = false,
  className = "",
}) => {
  const baseStyles =
    "cursor-pointer bg-white w-full appearance-none rounded-md border py-[10px] px-5 text-dark outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed";

  const stateStyles = error
    ? "border-red"
    : success
    ? "border-green"
    : "border-stroke focus:border-primary3";

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="mb-[8px] block text-base font-medium text-dark">
          {label}
        </label>
      )}

      <div className="relative">
        {LeftIcon && (
          <LeftIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        )}

        <select
          disabled={disabled}
          value={value ?? ""}
          onChange={onChange}
          className={`${baseStyles} ${stateStyles} ${
            LeftIcon ? "pl-10" : ""
          } pr-10`}
        >
          {placeholder ? <option value={""}>{placeholder}</option>: ""}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white">
              {opt.label}
            </option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
      </div>

      {helperText && !error && !success && (
        <p className="mt-2 text-sm text-gray-500">{helperText}</p>
      )}
      {error && <p className="mt-2 text-sm text-red">{error}</p>}
      {success && <p className="mt-2 text-sm text-green">{success}</p>}
    </div>
  );
};

export default Select;
