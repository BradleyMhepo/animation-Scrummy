import React, { useState } from "react";

interface TextModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (text: string, color: string, fontSize: number) => void;
  defaultColor?: string;
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

const fontSizes = [
  { value: 15, name: "Small" },
  { value: 20, name: "Medium" },
  { value: 26, name: "Large" },
];

export const TextModal: React.FC<TextModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  defaultColor = "#202020",
}) => {
  const [text, setText] = useState("");
  const [selectedColor, setSelectedColor] = useState(defaultColor);
  const [selectedFontSize, setSelectedFontSize] = useState(20);

  if (!isOpen) return null;

  const handleAdd = () => {
    if (text.trim()) {
      onAdd(text, selectedColor, selectedFontSize);
      setText("");
      onClose();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#1e293b",
          padding: "32px",
          borderRadius: "12px",
          maxWidth: "500px",
          width: "90%",
          border: "2px solid #334155",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ color: "#facc15", margin: 0 }}>Add Text</h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#f9fafb",
              fontSize: "32px",
              cursor: "pointer",
              padding: 0,
            }}
          >
            ×
          </button>
        </div>

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Text To Display"
          autoFocus
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "16px",
            borderRadius: "6px",
            border: "2px solid #334155",
            backgroundColor: "#0f172a",
            color: selectedColor,
            marginBottom: "24px",
          }}
        />

        <div style={{ marginBottom: "24px" }}>
          <p style={{ color: "#cbd5e1", marginBottom: "12px" }}>Edit colour:</p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {colors.map((color) => (
              <button
                key={color.value}
                onClick={() => setSelectedColor(color.value)}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: color.value,
                  border: selectedColor === color.value ? "3px solid #facc15" : "2px solid #000",
                  cursor: "pointer",
                  position: "relative",
                }}
                title={color.name}
              >
                {selectedColor === color.value && (
                  <span style={{ 
                    color: color.value === "#eded1e" || color.value === "#ebebeb" ? "#000" : "#fff",
                    fontSize: "20px"
                  }}>
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <p style={{ color: "#cbd5e1", marginBottom: "12px" }}>Edit Size:</p>
          <div style={{ display: "flex", gap: "16px" }}>
            {fontSizes.map((size) => (
              <button
                key={size.value}
                onClick={() => setSelectedFontSize(size.value)}
                style={{
                  padding: "16px 24px",
                  backgroundColor: selectedFontSize === size.value ? "#facc15" : "#334155",
                  color: selectedFontSize === size.value ? "#020617" : "#f9fafb",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div style={{ fontSize: `${size.value + 10}px`, fontWeight: "bold" }}>T</div>
                <div style={{ fontSize: "12px" }}>{size.name}</div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleAdd}
          disabled={!text.trim()}
          style={{
            width: "100%",
            padding: "14px",
            backgroundColor: text.trim() ? "#facc15" : "#475569",
            color: "#020617",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: text.trim() ? "pointer" : "not-allowed",
          }}
        >
          Add Text
        </button>
      </div>
    </div>
  );
};

