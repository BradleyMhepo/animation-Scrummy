import React from "react";
import type { DrawingType } from "../types/drawing";

interface DrawingToolbarProps {
  isActive: boolean;
  currentType: DrawingType;
  currentColor: string;
  onClose: () => void;
  onTypeChange: (type: DrawingType) => void;
  onColorChange: (color: string) => void;
  onUndo: () => void;
  onAddText: () => void;
}

const colors = [
  { value: "#d13131", name: "Red" },
  { value: "#223fc8", name: "Blue" },
  { value: "#006c04", name: "Green" },
  { value: "#eded1e", name: "Yellow" },
  { value: "#202020", name: "Black" },
  { value: "#ebebeb", name: "White" },
  { value: "#ff9000", name: "Orange" },
  { value: "#ae5f00", name: "Brown" },
];

export const DrawingToolbar: React.FC<DrawingToolbarProps> = ({
  isActive,
  currentType,
  currentColor,
  onClose,
  onTypeChange,
  onColorChange,
  onUndo,
  onAddText,
}) => {
  if (!isActive) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "80px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "#1e293b",
        padding: "16px 24px",
        borderRadius: "12px",
        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.4)",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        zIndex: 100,
        border: "2px solid #334155",
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          padding: "8px 12px",
          backgroundColor: "#475569",
          color: "#f9fafb",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "20px",
          fontWeight: "bold",
        }}
      >
        ×
      </button>

      {/* Color picker */}
      <div style={{ display: "flex", gap: "8px" }}>
        {colors.map((color) => (
          <button
            key={color.value}
            onClick={() => onColorChange(color.value)}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: color.value,
              border: currentColor === color.value ? "3px solid #facc15" : "2px solid #000",
              cursor: "pointer",
              position: "relative",
            }}
            title={color.name}
          >
            {currentColor === color.value && (
              <span style={{ 
                color: color.value === "#eded1e" || color.value === "#ebebeb" ? "#000" : "#fff",
                fontSize: "18px"
              }}>
                ✓
              </span>
            )}
          </button>
        ))}
      </div>

      <div style={{ width: "2px", height: "40px", backgroundColor: "#475569" }} />

      {/* Text button */}
      <button
        onClick={onAddText}
        style={{
          padding: "8px 16px",
          backgroundColor: currentType === "text" ? "#facc15" : "#334155",
          color: currentType === "text" ? "#020617" : "#f9fafb",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        <div style={{ fontSize: "18px" }}>T</div>
        <div style={{ fontSize: "10px", marginTop: "2px" }}>Text</div>
      </button>

      {/* Drawing tools */}
      <button
        onClick={() => onTypeChange("sketch")}
        style={{
          padding: "8px 16px",
          backgroundColor: currentType === "sketch" ? "#facc15" : "#334155",
          color: currentType === "sketch" ? "#020617" : "#f9fafb",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
        title="Sketch"
      >
        ✏️
      </button>

      <button
        onClick={() => onTypeChange("line")}
        style={{
          padding: "8px 16px",
          backgroundColor: currentType === "line" ? "#facc15" : "#334155",
          color: currentType === "line" ? "#020617" : "#f9fafb",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
        title="Line"
      >
        📏
      </button>

      <button
        onClick={() => onTypeChange("arrow")}
        style={{
          padding: "8px 16px",
          backgroundColor: currentType === "arrow" ? "#facc15" : "#334155",
          color: currentType === "arrow" ? "#020617" : "#f9fafb",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
        title="Arrow"
      >
        ➡️
      </button>

      <button
        onClick={() => onTypeChange("box")}
        style={{
          padding: "8px 16px",
          backgroundColor: currentType === "box" ? "#facc15" : "#334155",
          color: currentType === "box" ? "#020617" : "#f9fafb",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
        title="Box"
      >
        ⬜
      </button>

      <button
        onClick={() => onTypeChange("circle")}
        style={{
          padding: "8px 16px",
          backgroundColor: currentType === "circle" ? "#facc15" : "#334155",
          color: currentType === "circle" ? "#020617" : "#f9fafb",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
        title="Circle"
      >
        ⭕
      </button>

      <div style={{ width: "2px", height: "40px", backgroundColor: "#475569" }} />

      {/* Undo button */}
      <button
        onClick={onUndo}
        style={{
          padding: "8px 16px",
          backgroundColor: "#334155",
          color: "#f9fafb",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
        title="Undo"
      >
        ↶
      </button>
    </div>
  );
};

