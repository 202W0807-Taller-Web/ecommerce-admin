import React from "react";
import type { LucideIcon } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  helperText?: string;
  error?: string;
  success?: string;
  variant?: "default" | "invalid" | "success";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      helperText,
      error,
      success,
      variant = "default",
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "bg-white w-full rounded-md border py-[10px] px-4 text-dark outline-none transition disabled:bg-gray-100 disabled:border-gray-300";

    const variants: Record<string, string> = {
      default: "border-stroke focus:border-primary3",
      invalid: "border-red focus:border-red",
      success: "border-green focus:border-green",
    };

    return (
      <div className={`w-full sm:min-w-[200px] ${className}`}>
        {label && (
          <label
            htmlFor={props.id}
            className="mb-[8px] block text-base font-medium text-dark"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {LeftIcon && (
            <LeftIcon className="absolute left-3 h-5 w-5 text-gray-400 pointer-events-none" />
          )}

          <input
            ref={ref}
            disabled={disabled}
            {...props}
            className={[
              baseStyles,
              variants[variant],
              LeftIcon ? "pl-10" : "",
              RightIcon ? "pr-10" : "",
            ].join(" ")}
          />

          {RightIcon && (
            <RightIcon className="absolute right-3 h-5 w-5 text-gray-400 pointer-events-none" />
          )}
        </div>

        {/* Mensajes de ayuda */}
        {helperText && !error && !success && (
          <p className="mt-2 text-sm text-gray-500">{helperText}</p>
        )}
        {error && <p className="mt-2 text-sm text-red">{error}</p>}
        {success && <p className="mt-2 text-sm text-green">{success}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
