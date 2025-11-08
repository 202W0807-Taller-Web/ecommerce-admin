import type { ChangeEventHandler } from "react";

interface LabeledInputProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  min?: number;
  step?: number;
}

export default function LabeledInput({
  label,
  value,
  onChange,
  type = "text",
  min,
  step,
}: LabeledInputProps) {
  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) =>
    onChange(e.target.value);

  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-gray-700 font-medium text-sm">{label}</label>
      <input
        type={type}
        value={value}
        min={min}
        step={step}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
      />
    </div>
  );
}
