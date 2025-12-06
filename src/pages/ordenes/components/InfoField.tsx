import type { ReactNode } from "react";

interface InfoFieldProps {
    label: string;
    value: ReactNode;
}

const InfoField = ({ label, value }: InfoFieldProps) => (
    <div className="flex border-b border-gray-300">
        <div className="w-1/3 p-2 font-semibold text-sm text-gray-700 bg-[#C9B35E]">{label}</div>
        <div className="w-2/3 p-2 text-sm">{value}</div>
    </div>
);

export default InfoField;