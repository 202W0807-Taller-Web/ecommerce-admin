// src/components/CustomStatusDropdown.tsx

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

// Tipos requeridos
type Option = {
  value: string;
  label: string;
};

// Interfaz para el componente
interface StatusDropdownProps {
  currentValue: string;
  options: Option[];
  getColorStyle: (value: string) => string;
  onChange: (newValue: string) => void;
}

// Lógica de colores
const getBaseColorStyle = (value: string): string => {
  switch (value) {
    case "SOLICITADO":
      return "bg-yellow-500";
    case "APROBADO":
      return "bg-green-500";
    case "RECHAZADO":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

// Lógica de colores de hover
const getHoverStyle = (value: string): string => {
  switch (value) {
    case "SOLICITADO":
      return "hover:bg-yellow-600";
    case "APROBADO":
      return "hover:bg-green-600";
    case "RECHAZADO":
      return "hover:bg-red-600";
    default:
      return "hover:bg-gray-600";
  }
};

const CustomStatusDropdown: React.FC<StatusDropdownProps> = ({
  currentValue,
  options,
  getColorStyle,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const dynamicBackground = getColorStyle(currentValue);

  // Cierra el dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (newValue: string) => {
    onChange(newValue);
    setIsOpen(false);
  };

  return (
    <div className="relative w-[150px]" ref={dropdownRef}>
      {/* Botón/Visualizador del Estado Actual */}
      <button
        type="button"
        className={`
                    ${dynamicBackground}
                    text-white
                    uppercase
                    font-bold
                    py-2
                    px-4
                    w-full
                    rounded-lg
                    shadow-sm
                    cursor-pointer
                    flex items-center justify-between
                    transition-colors
                    focus:outline-none focus:ring-2 focus:ring-gray-800
                `}
        onClick={() => setIsOpen(!isOpen)}
      >
        {currentValue}
        <ChevronDown
          className={`h-5 w-5 ml-1 transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}
        />
      </button>

      {/* Menú Desplegable (Dropdown) */}
      {isOpen && (
        <div className="absolute z-10 top-full left-0 mt-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
          {options.map(opt => {
            const isSelected = opt.value === currentValue;
            const hoverClass = getHoverStyle(opt.value);

            // Si la opción está seleccionada, le damos el color base del estado
            const selectedClass = isSelected
              ? getBaseColorStyle(opt.value) + " !text-white"
              : "bg-white text-gray-900";

            return (
              <div
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`
                                    ${selectedClass}
                                    ${hoverClass} 
                                    uppercase
                                    font-bold
                                    p-2
                                    cursor-pointer
                                    transition-colors
                                    text-left
                                    // Aseguramos que el texto hover sea blanco
                                    ${hoverClass.replace("hover:bg", "hover:text")}
                                `}
              >
                {opt.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomStatusDropdown;
