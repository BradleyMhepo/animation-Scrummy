import React from "react";
import type { Play } from "../types/play";

interface PlayListProps {
  plays: Play[];
  selectedPlayId: string | null;
  onSelectPlay: (playId: string) => void;
}

export const PlayList: React.FC<PlayListProps> = ({ plays, selectedPlayId, onSelectPlay }) => {
  return (
    <div style={{ marginBottom: "20px" }}>
      <h3 style={{ 
        color: "#facc15", 
        fontSize: "18px", 
        marginBottom: "12px",
        fontWeight: "bold"
      }}>
        Available Plays
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {plays.map((play) => (
          <button
            key={play.id}
            onClick={() => onSelectPlay(play.id)}
            style={{
              padding: "12px 16px",
              backgroundColor: selectedPlayId === play.id ? "#1e3a8a" : "#334155",
              color: selectedPlayId === play.id ? "#facc15" : "#f9fafb",
              border: selectedPlayId === play.id ? "2px solid #facc15" : "2px solid transparent",
              borderRadius: "8px",
              cursor: "pointer",
              textAlign: "left",
              fontSize: "14px",
              fontWeight: selectedPlayId === play.id ? "bold" : "normal",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (selectedPlayId !== play.id) {
                e.currentTarget.style.backgroundColor = "#475569";
              }
            }}
            onMouseLeave={(e) => {
              if (selectedPlayId !== play.id) {
                e.currentTarget.style.backgroundColor = "#334155";
              }
            }}
          >
            {play.name}
          </button>
        ))}
      </div>
    </div>
  );
};

