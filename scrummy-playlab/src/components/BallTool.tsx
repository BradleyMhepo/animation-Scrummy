import React from "react";

interface Ball {
  id: string;
  x: number;
  y: number;
  color: string;
  number?: number;
}

interface BallToolProps {
  isActive: boolean;
  balls: Ball[];
  selectedBallId: string | null;
  currentColor: string;
  currentNumber?: number;
  onColorChange: (color: string) => void;
  onNumberChange: (number: number | undefined) => void;
  onBallSelect: (ballId: string | null) => void;
  onBallDelete: (ballId: string) => void;
}

const colors = [
  { value: "#facc15", name: "Yellow" },
  { value: "#f9fafb", name: "White" },
  { value: "#d13131", name: "Red" },
  { value: "#223fc8", name: "Blue" },
  { value: "#006c04", name: "Green" },
  { value: "#ff9000", name: "Orange" },
];

export const BallTool: React.FC<BallToolProps> = ({
  isActive,
  balls,
  selectedBallId,
  currentColor,
  currentNumber,
  onColorChange,
  onNumberChange,
  onBallSelect,
  onBallDelete,
}) => {
  if (!isActive) return null;

  const selectedBall = balls.find((b) => b.id === selectedBallId);

  return (
    <div
      style={{
        position: "fixed",
        top: "80px",
        right: "24px",
        backgroundColor: "#1e293b",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.4)",
        border: "2px solid #334155",
        zIndex: 100,
        minWidth: "250px",
      }}
    >
      <h3 style={{ color: "#facc15", fontSize: "18px", marginBottom: "16px" }}>
        ⚽ Ball Placement
      </h3>

      <div style={{ marginBottom: "20px" }}>
        <p style={{ color: "#cbd5e1", fontSize: "14px", marginBottom: "12px" }}>
          Choose color and number, then click & drag on field
        </p>

        {/* Color picker */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ color: "#cbd5e1", fontSize: "14px", display: "block", marginBottom: "8px" }}>
            Color:
          </label>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
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
                    color: color.value === "#facc15" || color.value === "#f9fafb" ? "#000" : "#fff",
                    fontSize: "16px"
                  }}>
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Number input */}
        <div>
          <label style={{ color: "#cbd5e1", fontSize: "14px", display: "block", marginBottom: "8px" }}>
            Number (optional):
          </label>
          <input
            type="number"
            min="1"
            max="99"
            value={currentNumber || ""}
            onChange={(e) => {
              const num = parseInt(e.target.value);
              onNumberChange(isNaN(num) ? undefined : num);
            }}
            placeholder="Enter number"
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "14px",
              borderRadius: "6px",
              border: "2px solid #334155",
              backgroundColor: "#0f172a",
              color: "#f9fafb",
              textAlign: "center",
            }}
          />
        </div>
      </div>

      {/* Ball list */}
      {balls.length > 0 && (
        <div>
          <div style={{ 
            height: "2px", 
            backgroundColor: "#475569", 
            marginBottom: "12px" 
          }} />
          <p style={{ color: "#cbd5e1", fontSize: "14px", marginBottom: "8px" }}>
            Placed Balls ({balls.length}):
          </p>
          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
            {balls.map((ball) => (
              <div
                key={ball.id}
                onClick={() => onBallSelect(ball.id)}
                style={{
                  padding: "8px 12px",
                  backgroundColor: ball.id === selectedBallId ? "#facc15" : "#0f172a",
                  color: ball.id === selectedBallId ? "#020617" : "#cbd5e1",
                  borderRadius: "6px",
                  marginBottom: "4px",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "14px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      backgroundColor: ball.color,
                      border: "2px solid #000",
                    }}
                  />
                  <span>
                    {ball.number !== undefined ? `#${ball.number}` : "Ball"}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onBallDelete(ball.id);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: ball.id === selectedBallId ? "#020617" : "#dc2626",
                    cursor: "pointer",
                    fontSize: "18px",
                    padding: "0 4px",
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected ball info */}
      {selectedBall && (
        <div style={{ 
          marginTop: "16px",
          padding: "12px",
          backgroundColor: "#0f172a",
          borderRadius: "6px",
          fontSize: "12px",
          color: "#94a3b8"
        }}>
          <div>Position: ({Math.round(selectedBall.x)}, {Math.round(selectedBall.y)})</div>
          <div>Click & drag on field to move</div>
        </div>
      )}
    </div>
  );
};
