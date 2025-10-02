import { EllipsisVertical } from "lucide-react";
import React from "react";

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
    "px-3 inline-flex text-sm leading-5 font-semibold rounded-xl";

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

export const ActionMenuCell = () => {
  return (
    <TableCell className="w-10 text-center">
      <EllipsisVertical className="cursor-pointer" />
    </TableCell>
  );
};

/* ---------- Ejemplo ---------- */

function Table() {
  return (
    <table className="w-full border-collapse mb-2">
      <thead className="bg-gray-50">
        <tr>
          <TableHeader label="#" className="w-12 min-w-[48px] text-center" />
          <TableHeader label="Nombre" />
          <TableHeader label="Estado" />
          <TableHeader label="Estado 2" />
          <TableHeader label="Avatar" />
          <TableHeader label="" className="w-10 text-center" />
        </tr>
      </thead>
      <tbody>
        <tr className="bg-white">
          <TableCell className="w-12 min-w-[48px] text-center">1</TableCell>
          <TableCell>Nombre de Ejemplo</TableCell>
          <TableCell>
            <StatusBadge label="Activo" variant="success" />
          </TableCell>
          <TableCell>
            <StatusBadge label="Peligro" variant="danger" />
          </TableCell>
          <AvatarCell name="Emilio Caceres" />
          <ActionMenuCell />
        </tr>
        <tr className="bg-gray-50">
          <TableCell className="w-12 min-w-[48px] text-center">2</TableCell>
          <TableCell>Hola mundo</TableCell>
          <TableCell>
            <StatusBadge label="Neutro" variant="neutral" />
          </TableCell>
          <TableCell>
            <StatusBadge label="Ambar" variant="warning" />
          </TableCell>
          <AvatarCell name="Amber Morgan" />
          <ActionMenuCell />
        </tr>
      </tbody>
    </table>
  );
}

export default Table;
