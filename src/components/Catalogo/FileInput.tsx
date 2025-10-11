import { useState } from "react";

export default function FileInput({ label, onChange }) {
  const [fileName, setFileName] = useState("Ningún archivo seleccionado");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFileName(file ? file.name : "Ningún archivo seleccionado");
    onChange(file);
  };

  return (
    <div
      style={{
        gridColumn: "1 / -1",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 12,
        whiteSpace: "nowrap",
        overflow: "hidden",
      }}
    >
      <label style={{ color: "#444", fontWeight: 500, flexShrink: 0 }}>
        {label}
      </label>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          flex: 1,
          minWidth: 0,
        }}
      >
        <label
          htmlFor="file-upload"
          style={{
            backgroundColor: "#1f2937", // gray-800
            color: "white",
            padding: "6px 14px",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 500,
            flexShrink: 0,
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#374151")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#1f2937")
          }
        >
          Seleccionar archivo
        </label>

        <input
          id="file-upload"
          type="file"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        <span
          style={{
            fontSize: 14,
            color: "#555",
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
            flex: 1,
          }}
        >
          {fileName}
        </span>
      </div>
    </div>
  );
}
