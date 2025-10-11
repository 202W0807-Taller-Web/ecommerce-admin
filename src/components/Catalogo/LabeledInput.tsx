export default function LabeledInput({
  label,
  value,
  onChange,
  type = "text",
  min,
  step,
}) {
  return (
    <>
      <label>{label}</label>
      <input
        type={type}
        value={value}
        min={min}
        step={step}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "6px 8px",
          borderRadius: 6,
          border: "1px solid #ccc",
        }}
      />
    </>
  );
}
