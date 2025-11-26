import React from "react";

interface FieldControlsProps {
  isOpen: boolean;
  zoom: number;
  playerSize: number;
  pitchType: "union" | "league" | "grid";
  onClose: () => void;
  onZoomChange: (zoom: number) => void;
  onPlayerSizeChange: (size: number) => void;
  onPitchTypeChange: (type: "union" | "league" | "grid") => void;
  onRecenter: () => void;
  onRotate: () => void;
  onEditField: () => void;
}

export const FieldControls: React.FC<FieldControlsProps> = ({
  isOpen,
  zoom,
  playerSize,
  pitchType,
  onClose,
  onZoomChange,
  onPlayerSizeChange,
  onPitchTypeChange,
  onRecenter,
  onRotate,
  onEditField,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "80px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "#1e293b",
        padding: "20px 32px",
        borderRadius: "12px",
        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.4)",
        display: "flex",
        alignItems: "center",
        gap: "24px",
        zIndex: 100,
        border: "2px solid #334155",
        minWidth: "700px",
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

      {/* Pitch Type */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label style={{ color: "#cbd5e1", fontSize: "14px" }}>Field:</label>
        <select
          value={pitchType}
          onChange={(e) => onPitchTypeChange(e.target.value as any)}
          style={{
            padding: "8px 12px",
            backgroundColor: "#0f172a",
            color: "#f9fafb",
            border: "1px solid #334155",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          <option value="union">Union</option>
          <option value="league">League</option>
          <option value="grid">Grid</option>
        </select>
      </div>

      {/* Edit Field button */}
      <button
        onClick={onEditField}
        style={{
          padding: "10px 20px",
          backgroundColor: "#334155",
          color: "#f9fafb",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        ⚙️ Edit Field
      </button>

      {/* Player Size */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label style={{ color: "#cbd5e1", fontSize: "14px" }}>Player Size:</label>
        <div style={{ display: "flex", gap: "8px" }}>
          {[0.8, 1, 1.2].map((size, index) => (
            <button
              key={size}
              onClick={() => onPlayerSizeChange(size)}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: playerSize === size ? "#facc15" : "#334155",
                color: playerSize === size ? "#020617" : "#f9fafb",
                border: playerSize === size ? "2px solid #facc15" : "2px solid transparent",
                cursor: "pointer",
                fontSize: `${14 + index * 4}px`,
                fontWeight: "bold",
              }}
            >
              {playerSize === size ? "✓" : ""}
            </button>
          ))}
        </div>
      </div>

      {/* Zoom controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button
          onClick={onRecenter}
          style={{
            padding: "10px 16px",
            backgroundColor: "#334155",
            color: "#f9fafb",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
          title="Recenter"
        >
          🎯
        </button>
        <button
          onClick={onRotate}
          style={{
            padding: "10px 16px",
            backgroundColor: "#334155",
            color: "#f9fafb",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
          title="Rotate"
        >
          🔄
        </button>
      </div>

      <div style={{ width: "2px", height: "40px", backgroundColor: "#475569" }} />

      {/* Zoom slider */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", minWidth: "150px" }}>
        <label style={{ color: "#cbd5e1", fontSize: "14px" }}>
          Zoom: {Math.round(zoom * 100)}%
        </label>
        <input
          type="range"
          min="50"
          max="200"
          value={zoom * 100}
          onChange={(e) => onZoomChange(Number(e.target.value) / 100)}
          style={{
            width: "100%",
          }}
        />
      </div>
    </div>
  );
};

