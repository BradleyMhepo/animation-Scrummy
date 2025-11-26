import React from "react";

interface ControlsProps {
  isPlaying: boolean;
  currentTimeMs: number;
  durationMs: number;
  onPlay: () => void;
  onPause: () => void;
  onRestart: () => void;
  onSeek: (timeMs: number) => void;
}

export const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  currentTimeMs,
  durationMs,
  onPlay,
  onPause,
  onRestart,
  onSeek,
}) => {
  const formatTime = (ms: number) => {
    const seconds = ms / 1000;
    return seconds.toFixed(1) + "s";
  };

  return (
    <div style={{ 
      backgroundColor: "#1e293b", 
      padding: "16px", 
      borderRadius: "8px" 
    }}>
      <div style={{ 
        display: "flex", 
        gap: "12px", 
        marginBottom: "16px",
        alignItems: "center"
      }}>
        {!isPlaying ? (
          <button
            onClick={onPlay}
            style={{
              padding: "10px 20px",
              backgroundColor: "#facc15",
              color: "#020617",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "bold",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#fde047";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#facc15";
            }}
          >
            ▶ Play
          </button>
        ) : (
          <button
            onClick={onPause}
            style={{
              padding: "10px 20px",
              backgroundColor: "#94a3b8",
              color: "#020617",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "bold",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#cbd5e1";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#94a3b8";
            }}
          >
            ⏸ Pause
          </button>
        )}
        
        <button
          onClick={onRestart}
          style={{
            padding: "10px 20px",
            backgroundColor: "#334155",
            color: "#f9fafb",
            border: "1px solid #475569",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "bold",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#475569";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#334155";
          }}
        >
          ↻ Restart
        </button>

        <div style={{ 
          marginLeft: "auto", 
          color: "#cbd5e1",
          fontSize: "14px",
          fontFamily: "monospace"
        }}>
          {formatTime(currentTimeMs)} / {formatTime(durationMs)}
        </div>
      </div>

      <div>
        <input
          type="range"
          min="0"
          max={durationMs}
          value={currentTimeMs}
          onChange={(e) => onSeek(Number(e.target.value))}
          style={{
            width: "100%",
            height: "8px",
            borderRadius: "4px",
            outline: "none",
            cursor: "pointer",
          }}
        />
      </div>
    </div>
  );
};

