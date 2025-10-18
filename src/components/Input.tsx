import React from "react";
import type { LucideIcon } from "lucide-react";

type InputProps = {
  label?: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;

  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;

  helperText?: string;
  error?: string;
  success?: string;

  variant?: "default" | "invalid" | "success";
};

const Input: React.FC<InputProps> = ({
  label,
  type = "text",
  placeholder,
  disabled = false,
  value,
  onChange,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  helperText,
  error,
  success,
  variant = "default",
}) => {
  const baseStyles =
    "bg-white w-full rounded-md border py-[10px] px-4 text-dark outline-none transition disabled:bg-gray-100 disabled:border-gray-300";

  const variants: Record<typeof variant, string> = {
    default: "border-stroke focus:border-primary3",
    invalid: "border-red",
    success: "border-green",
  };

  return (
    <div className="w-full">
      {label && (
        <label className="mb-[8px] block text-base font-medium text-dark">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {LeftIcon && (
          <LeftIcon className="absolute left-3 h-5 w-5 text-gray-400" />
        )}

        <input
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          onChange={onChange}
          className={`${baseStyles} ${variants[variant]} ${
            LeftIcon ? "pl-10" : ""
          } ${RightIcon ? "pr-10" : ""}`}
        />

        {RightIcon && (
          <RightIcon className="absolute right-3 h-5 w-5 text-gray-400" />
        )}
      </div>

      {helperText && !error && !success && (
        <p className="mt-2 text-sm text-gray-500">{helperText}</p>
      )}
      {error && <p className="mt-2 text-sm text-red">{error}</p>}
      {success && <p className="mt-2 text-sm text-green">{success}</p>}
    </div>
  );
};

export default Input;
