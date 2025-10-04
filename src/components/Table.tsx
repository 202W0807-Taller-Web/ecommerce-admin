import { EllipsisVertical } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import React from "react";
import ReactDOM from "react-dom";

/* ---------- Tipos ---------- */
type StatusVariant = "neutral" | "success" | "danger" | "warning";

interface TableHeaderProps {
  label: string;
  className?: string;
}

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
}

interface ActionButton {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface ActionMenuCellProps {
  buttons?: ActionButton[];
}

interface StatusBadgeProps {
  label: string;
  variant?: StatusVariant;
}

interface AvatarCellProps {
  name: string;
  avatarUrl?: string;
}

/* ---------- Componentes ---------- */

export const TableHeader = ({ label, className = "" }: TableHeaderProps) => {
  return (
    <th
      className={`p-3 text-sm font-semibold tracking-wide text-left uppercase border border-stroke ${className}`}
    >
      {label}
    </th>
  );
};

export const TableCell = ({ children, className = "" }: TableCellProps) => {
  return (
    <td
      className={`p-3 text-sm text-gray-700 border border-stroke ${className}`}
    >
      {children}
    </td>
  );
};

export const StatusBadge = ({
  label,
  variant = "neutral",
}: StatusBadgeProps) => {
  const baseClasses =
    "px-3 inline-flex text-sm leading-5 font-semibold rounded-xl text-center uppercase py-1";

  const variants: Record<StatusVariant, string> = {
    neutral: "bg-white border border-gray-300 text-gray-700",
    success: "bg-green-600 text-white",
    danger: "bg-red-600 text-white",
    warning: "bg-amber-500 text-white",
  };

  return <span className={`${baseClasses} ${variants[variant]}`}>{label}</span>;
};

export const AvatarCell = ({
  name,
  avatarUrl = "https://i.pravatar.cc/40",
}: AvatarCellProps) => {
  return (
    <TableCell>
      <div className="flex items-center gap-3">
        <img src={avatarUrl} alt={name} className="w-8 h-8 rounded-full" />
        <span>{name}</span>
      </div>
    </TableCell>
  );
};

export const ActionMenuCell = ({ buttons }: ActionMenuCellProps) => {
  const [open, setOpen] = useState(false);
  const iconRef = useRef<HTMLSpanElement>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  useEffect(() => {
    if (open && iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 4, left: rect.left });
    }
    function handleClickOutside(event: MouseEvent) {
      if (open && !(iconRef.current && iconRef.current.contains(event.target as Node))) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <TableCell className="w-10 text-center">
      <span ref={iconRef} style={{ display: "inline-block" }}>
        <EllipsisVertical className="cursor-pointer" onClick={buttons ? () => setOpen((v) => !v) : ()=>{}} />
      </span>
      {open && ReactDOM.createPortal(
        <div
          style={{
            position: "fixed",
            top: menuPos.top,
            left: menuPos.left - 50,
            zIndex: 9999,
            background: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            borderRadius: "0.5rem",
            padding: "0.5rem",
            minWidth: "160px",
            border: "1px solid #e5e7eb",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem"
          }}
        >
          {buttons?.map((btn, idx) => (
            <button
              key={idx}
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-left text-sm"
              onClick={() => {
                btn.onClick();
                setOpen(false);
              }}
            >
              {btn.icon}
              <span>{btn.label}</span>
            </button>
          ))}
        </div>,
        document.body
      )}
    </TableCell>
  );
};

/* ---------- Ejemplo ---------- */

// ...existing code...
export default function Table() {
  return <table></table>;
}