import React from "react";
import type { Play } from "../types/play";

interface PlayDetailsProps {
  play: Play;
}

export const PlayDetails: React.FC<PlayDetailsProps> = ({ play }) => {
  const homeTeam = play.players.filter(p => p.team === "home");
  const awayTeam = play.players.filter(p => p.team === "away");
  
  return (
    <div style={{ 
      backgroundColor: "#1e293b", 
      padding: "16px", 
      borderRadius: "8px",
      marginBottom: "20px"
    }}>
      <h3 style={{ 
        color: "#facc15", 
        fontSize: "16px", 
        marginBottom: "8px",
        fontWeight: "bold"
      }}>
        {play.name}
      </h3>
      {play.description && (
        <p style={{ 
          color: "#cbd5e1", 
          fontSize: "14px", 
          marginBottom: "12px",
          lineHeight: "1.5"
        }}>
          {play.description}
        </p>
      )}
      <div style={{ 
        display: "flex", 
        gap: "16px", 
        fontSize: "12px",
        color: "#94a3b8"
      }}>
        <div>
          <strong style={{ color: "#facc15" }}>Duration:</strong> {(play.durationMs / 1000).toFixed(1)}s
        </div>
        <div>
          <strong style={{ color: "#facc15" }}>Home:</strong> {homeTeam.length}
        </div>
        <div>
          <strong style={{ color: "#facc15" }}>Away:</strong> {awayTeam.length}
        </div>
      </div>
    </div>
  );
};

