import React from "react";

interface SpeedControlsProps {
  isOpen: boolean;
  globalSpeed: number;
  onClose: () => void;
  onSpeedChange: (speed: number) => void;
}

export const SpeedControls: React.FC<SpeedControlsProps> = ({
  isOpen,
  globalSpeed,
  onClose,
  onSpeedChange,
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
        minWidth: "400px",
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

      {/* Speed selector */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
        <label style={{ color: "#cbd5e1", fontSize: "14px" }}>
          Playback Speed: {globalSpeed}x
        </label>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {[0.5, 1, 1.5, 2].map((speed) => (
            <button
              key={speed}
              onClick={() => onSpeedChange(speed)}
              style={{
                padding: "10px 20px",
                backgroundColor: globalSpeed === speed ? "#facc15" : "#334155",
                color: globalSpeed === speed ? "#020617" : "#f9fafb",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>

      {/* Speed slider */}
      <div style={{ flex: 1 }}>
        <input
          type="range"
          min="10"
          max="300"
          value={globalSpeed * 100}
          onChange={(e) => onSpeedChange(Number(e.target.value) / 100)}
          style={{
            width: "100%",
          }}
        />
      </div>
    </div>
  );
};

