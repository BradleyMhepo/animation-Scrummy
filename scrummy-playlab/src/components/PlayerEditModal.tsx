import React, { useState, useEffect } from "react";
import type { Player } from "../types/play";

interface PlayerEditModalProps {
  isOpen: boolean;
  player: Player | null;
  onClose: () => void;
  onSave: (player: Player) => void;
  onDelete: () => void;
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

export const PlayerEditModal: React.FC<PlayerEditModalProps> = ({
  isOpen,
  player,
  onClose,
  onSave,
  onDelete,
}) => {
  const [editedPlayer, setEditedPlayer] = useState<Player | null>(null);
  const [showLines, setShowLines] = useState(true);

  useEffect(() => {
    if (player) {
      setEditedPlayer({ ...player });
    }
  }, [player]);

  if (!isOpen || !editedPlayer) return null;

  const handleSave = () => {
    if (editedPlayer) {
      onSave(editedPlayer);
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
          maxWidth: "450px",
          width: "90%",
          border: "2px solid #334155",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ color: "#facc15", margin: 0 }}>Player Edit</h2>
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

        {/* Player preview */}
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: editedPlayer.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "32px",
            fontWeight: "bold",
            color: editedPlayer.color === "#eded1e" || editedPlayer.color === "#ebebeb" ? "#000" : "#fff",
            margin: "0 auto 24px",
            border: "3px solid #000",
          }}
        >
          {editedPlayer.number}
        </div>

        {/* Color picker */}
        <div style={{ marginBottom: "24px" }}>
          <p style={{ color: "#cbd5e1", marginBottom: "12px" }}>Edit colour:</p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
            {colors.map((color) => (
              <button
                key={color.value}
                onClick={() => setEditedPlayer({ ...editedPlayer, color: color.value })}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: color.value,
                  border: editedPlayer.color === color.value ? "3px solid #facc15" : "2px solid #000",
                  cursor: "pointer",
                  position: "relative",
                }}
                title={color.name}
              >
                {editedPlayer.color === color.value && (
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

        {/* Number input */}
        <div style={{ marginBottom: "24px" }}>
          <p style={{ color: "#cbd5e1", marginBottom: "12px" }}>Edit Number:</p>
          <input
            type="text"
            value={editedPlayer.number}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || /^[0-9]{1,2}$/.test(value)) {
                setEditedPlayer({ ...editedPlayer, number: value === "" ? 0 : parseInt(value) });
              }
            }}
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "18px",
              borderRadius: "6px",
              border: "2px solid #334155",
              backgroundColor: "#0f172a",
              color: "#f9fafb",
              textAlign: "center",
            }}
            maxLength={2}
          />
        </div>

        {/* Show lines toggle */}
        <div style={{ marginBottom: "24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ color: "#cbd5e1", margin: 0 }}>Show Lines:</p>
          <label style={{ position: "relative", display: "inline-block", width: "48px", height: "26px" }}>
            <input
              type="checkbox"
              checked={showLines}
              onChange={(e) => setShowLines(e.target.checked)}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span
              style={{
                position: "absolute",
                cursor: "pointer",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: showLines ? "#facc15" : "#475569",
                transition: "0.3s",
                borderRadius: "26px",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  content: "",
                  height: "20px",
                  width: "20px",
                  left: showLines ? "25px" : "3px",
                  bottom: "3px",
                  backgroundColor: "white",
                  transition: "0.3s",
                  borderRadius: "50%",
                }}
              />
            </span>
          </label>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={handleSave}
            style={{
              flex: 1,
              padding: "14px",
              backgroundColor: "#facc15",
              color: "#020617",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Apply Changes
          </button>
          <button
            onClick={() => {
              onDelete();
              onClose();
            }}
            style={{
              flex: 1,
              padding: "14px",
              backgroundColor: "#dc2626",
              color: "#f9fafb",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Delete Player
          </button>
        </div>
      </div>
    </div>
  );
};

