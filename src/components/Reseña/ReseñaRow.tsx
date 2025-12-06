import React from "react";
import { Star, Eye } from "lucide-react";

type ReseñaRowProps = {
    imagen: string;
    nombre: string;
    nroReseñas: number;
    valoracion: number;
};

const ReseñaRow: React.FC<ReseñaRowProps> = ({
    imagen,
    nombre,
    nroReseñas,
    valoracion,
}) => {
    return (
        <tr
        style={{
            height: 80,
            verticalAlign: "middle",
            transition: "background 0.2s",
        }}
        onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#e5e7eb")
        }
        onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
        }
        >
        <td style={{ padding: "12px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
                style={{
                width: 60,
                height: 60,
                borderRadius: 8,
                overflow: "hidden",
                flexShrink: 0,
                backgroundColor: "#d1d5db",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                }}
            >
                <img
                src={imagen}
                alt={nombre}
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                }}
                />
            </div>
            <span style={{ fontSize: 14, color: "#111827" }}>{nombre}</span>
            </div>
        </td>

        <td style={{ textAlign: "center", fontSize: 14, color: "#374151" }}>
            {nroReseñas}
        </td>

        <td style={{ textAlign: "center" }}>
            <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 6,
                height: "100%",
            }}
            >
            <span style={{ fontSize: 14 }}>{valoracion.toFixed(1)}</span>
            <Star size={16} color="#facc15" fill="#facc15" />
            </div>
        </td>

        <td style={{ textAlign: "center" }}>
            <button
            title="Ver reseñas"
            style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: "#3b82f6",
                padding: 6,
            }}
            >
            <Eye size={18} />
            </button>
        </td>
        </tr>
    );
};

export default ReseñaRow;

