import type { LucideIcon } from "lucide-react";
import React from "react";

type ButtonProps = {
  text: string;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  variant?: "primary" | "secondary" | "outline";
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({
  text,
  icon: Icon,
  iconPosition = "right",
  variant = "primary",
  className = "",
  ...props
}) => {
  const baseStyles =
    "cursor-pointer inline-flex items-center justify-center gap-2 rounded-md py-3 px-7 text-[16px] font-medium transition-colors";

  const variants: Record<typeof variant, string> = {
    primary: "bg-primary1 hover:bg-primary3 text-white border",
    secondary: "bg-primary2 hover:bg-primary4 text-white border",
    outline: "bg-white border border-gray-400 text-gray-400 hover:bg-gray-100",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {iconPosition === "left" && Icon && <Icon className="h-5 w-5" />}
      <span>{text}</span>
      {iconPosition === "right" && Icon && <Icon className="h-5 w-5" />}
    </button>
  );
};

export default Button;
