import React from "react";
import type { PlayerPath } from "../types/path";

interface Ball {
  id: string;
  x: number;
  y: number;
  color: string;
  number?: number;
}

interface PlayerPathToolbarProps {
  isActive: boolean;
  playerPaths: PlayerPath[];
  selectedPlayerId: string | null;
  currentColor: string;
  balls?: Ball[];
  selectedBallId?: string | null;
  onClose: () => void;
  onColorChange: (color: string) => void;
  onPlayerSelect: (playerId: string | null) => void;
  onPlayerNumberChange: (playerId: string, number: number) => void;
  onPlayerDelete: (playerId: string) => void;
  onGeneratePlay: () => void;
}

const colors = [
  { value: "#facc15", name: "Home (Yellow)" },
  { value: "#f9fafb", name: "Away (White)" },
  { value: "#d13131", name: "Red" },
  { value: "#223fc8", name: "Blue" },
  { value: "#006c04", name: "Green" },
];

export const PlayerPathToolbar: React.FC<PlayerPathToolbarProps> = ({
  isActive,
  playerPaths,
  selectedPlayerId,
  currentColor,
  balls = [],
  selectedBallId = null,
  onClose,
  onColorChange,
  onPlayerSelect,
  onPlayerNumberChange,
  onPlayerDelete,
  onGeneratePlay,
}) => {
  if (!isActive) return null;

  const selectedPath = playerPaths.find((p) => p.playerId === selectedPlayerId);

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
        maxWidth: "90%",
        flexWrap: "wrap",
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

      {/* Instructions */}
      <div style={{ color: "#cbd5e1", fontSize: "14px", minWidth: "250px" }}>
        <strong style={{ color: "#facc15" }}>Animate Mode:</strong> Click ball/player, drag to draw movement path
      </div>

      {/* Color picker */}
      <div style={{ display: "flex", gap: "8px" }}>
        {colors.map((color) => (
          <button
            key={color.value}
            onClick={() => onColorChange(color.value)}
            style={{
              width: "36px",
              height: "36px",
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
                color: color.value === "#facc15" || color.value === "#f9fafb" ? "#000" : "#fff",
                fontSize: "18px"
              }}>
                ✓
              </span>
            )}
          </button>
        ))}
      </div>

      <div style={{ width: "2px", height: "40px", backgroundColor: "#475569" }} />

      {/* Ball list (if any) */}
      {balls.length > 0 && (
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap", marginBottom: "8px" }}>
          {balls.map((ball) => {
            const ballPathId = `ball_path_${ball.id}`;
            const hasPath = playerPaths.some(p => p.playerId === ballPathId);
            return (
              <div
                key={ball.id}
                style={{
                  padding: "6px 10px",
                  backgroundColor: ball.id === selectedBallId ? "#facc15" : "#1e3a8a",
                  color: ball.id === selectedBallId ? "#020617" : "#f9fafb",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  border: hasPath ? "2px solid #22c55e" : "2px solid transparent",
                }}
                title={hasPath ? "Path drawn" : "Click ball on field to draw path"}
              >
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    backgroundColor: ball.color,
                    border: "2px solid #000",
                  }}
                />
                ⚽ {ball.number !== undefined ? `#${ball.number}` : "Ball"}
                {hasPath && <span style={{ fontSize: "10px" }}>✓</span>}
              </div>
            );
          })}
        </div>
      )}

      {/* Player list */}
      <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
        {playerPaths.filter(p => !p.playerId.startsWith("ball_path_")).map((path) => (
          <div
            key={path.playerId}
            onClick={() => onPlayerSelect(path.playerId)}
            style={{
              padding: "8px 12px",
              backgroundColor: path.playerId === selectedPlayerId ? "#facc15" : "#334155",
              color: path.playerId === selectedPlayerId ? "#020617" : "#f9fafb",
              borderRadius: "6px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: path.color,
                border: "2px solid #000",
              }}
            />
            {path.number !== undefined ? `#${path.number}` : "Player"}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPlayerDelete(path.playerId);
              }}
              style={{
                background: "none",
                border: "none",
                color: path.playerId === selectedPlayerId ? "#020617" : "#f9fafb",
                cursor: "pointer",
                fontSize: "16px",
                padding: "0 4px",
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Selected player controls */}
      {selectedPath && (
        <>
          <div style={{ width: "2px", height: "40px", backgroundColor: "#475569" }} />
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <label style={{ color: "#cbd5e1", fontSize: "14px" }}>Number:</label>
            <input
              type="number"
              min="1"
              max="99"
              value={selectedPath.number || ""}
              onChange={(e) => {
                const num = parseInt(e.target.value);
                if (!isNaN(num) && num > 0) {
                  onPlayerNumberChange(selectedPath.playerId, num);
                }
              }}
              placeholder="?"
              style={{
                width: "60px",
                padding: "6px",
                fontSize: "14px",
                borderRadius: "4px",
                border: "2px solid #334155",
                backgroundColor: "#0f172a",
                color: "#f9fafb",
                textAlign: "center",
              }}
            />
          </div>
        </>
      )}

      {/* Generate button */}
      {playerPaths.length > 0 && (
        <>
          <div style={{ width: "2px", height: "40px", backgroundColor: "#475569" }} />
          <button
            onClick={onGeneratePlay}
            style={{
              padding: "10px 20px",
              backgroundColor: "#22c55e",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            ✨ Generate Play
          </button>
        </>
      )}
    </div>
  );
};

