import React, { useEffect, useRef, useState } from "react";
import type { Play, Position, Keyframe } from "../types/play";

interface Ball {
  id: string;
  x: number;
  y: number;
  color: string;
  number?: number;
}

interface PlayCanvasProps {
  play: Play;
  currentTimeMs: number;
  zoom?: number;
  offsetX?: number;
  offsetY?: number;
  isLandscape?: boolean;
  playerSize?: number;
  showLines?: boolean;
  balls?: Ball[];
  showStaticBalls?: boolean; // Only show balls if true (for ball placement mode)
}

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 600;

const getPositionAtTime = (keyframes: Keyframe[], playerId: string, t: number): Position | null => {
  if (keyframes.length === 0) return null;

  // If before first or after last, clamp
  if (t <= keyframes[0].timeMs) {
    return keyframes[0].positions[playerId] ?? null;
  }
  if (t >= keyframes[keyframes.length - 1].timeMs) {
    return keyframes[keyframes.length - 1].positions[playerId] ?? null;
  }

  let prev = keyframes[0];
  let next = keyframes[keyframes.length - 1];

  for (let i = 0; i < keyframes.length - 1; i++) {
    const kf = keyframes[i];
    const kfNext = keyframes[i + 1];
    if (t >= kf.timeMs && t <= kfNext.timeMs) {
      prev = kf;
      next = kfNext;
      break;
    }
  }

  const p1 = prev.positions[playerId];
  const p2 = next.positions[playerId];
  if (!p1 || !p2) return p1 || p2 || null;

  const span = next.timeMs - prev.timeMs || 1;
  const alpha = Math.min(Math.max((t - prev.timeMs) / span, 0), 1);

  return {
    x: p1.x + (p2.x - p1.x) * alpha,
    y: p1.y + (p2.y - p1.y) * alpha,
  };
};

export const PlayCanvas: React.FC<PlayCanvasProps> = ({ 
  play, 
  currentTimeMs,
  zoom = 1,
  offsetX = 0,
  offsetY = 0,
  isLandscape = true,
  playerSize = 1,
  showLines = true,
  balls = [],
  showStaticBalls = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [playerPaths, setPlayerPaths] = useState<Map<string, Position[]>>(new Map());

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const { field, players, keyframes } = play;

    // Clear
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.save();

    // Background
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Apply transformations
    ctx.translate(CANVAS_WIDTH / 2 + offsetX, CANVAS_HEIGHT / 2 + offsetY);
    ctx.scale(zoom, zoom);
    ctx.translate(-CANVAS_WIDTH / 2, -CANVAS_HEIGHT / 2);

    // Rugby pitch rendering
    const pitchX = 100;
    const pitchY = 50;
    const pitchWidth = 700;
    const pitchHeight = 500;

    // Pitch green
    ctx.fillStyle = "#2d5016";
    ctx.fillRect(pitchX, pitchY, pitchWidth, pitchHeight);

    // Grass stripes
    ctx.fillStyle = "#34601a";
    for (let i = 0; i < 15; i++) {
      if (i % 2 === 0) {
        ctx.fillRect(pitchX, pitchY + (i * pitchHeight / 15), pitchWidth, pitchHeight / 15);
      }
    }

    // White lines
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;

    // Border
    ctx.strokeRect(pitchX, pitchY, pitchWidth, pitchHeight);

    // Halfway line
    ctx.beginPath();
    ctx.moveTo(pitchX + pitchWidth / 2, pitchY);
    ctx.lineTo(pitchX + pitchWidth / 2, pitchY + pitchHeight);
    ctx.stroke();

    // 22m lines
    ctx.setLineDash([8, 8]);
    ctx.lineWidth = 2;
    
    // Left 22m
    ctx.beginPath();
    ctx.moveTo(pitchX + pitchWidth * 0.22, pitchY);
    ctx.lineTo(pitchX + pitchWidth * 0.22, pitchY + pitchHeight);
    ctx.stroke();
    
    // Right 22m
    ctx.beginPath();
    ctx.moveTo(pitchX + pitchWidth * 0.78, pitchY);
    ctx.lineTo(pitchX + pitchWidth * 0.78, pitchY + pitchHeight);
    ctx.stroke();

    // 10m lines
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.5;
    
    // Left 10m
    ctx.beginPath();
    ctx.moveTo(pitchX + pitchWidth * 0.1, pitchY);
    ctx.lineTo(pitchX + pitchWidth * 0.1, pitchY + pitchHeight);
    ctx.stroke();
    
    // Right 10m
    ctx.beginPath();
    ctx.moveTo(pitchX + pitchWidth * 0.9, pitchY);
    ctx.lineTo(pitchX + pitchWidth * 0.9, pitchY + pitchHeight);
    ctx.stroke();

    ctx.setLineDash([]);

    // Goal lines (thicker)
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(pitchX, pitchY);
    ctx.lineTo(pitchX, pitchY + pitchHeight);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(pitchX + pitchWidth, pitchY);
    ctx.lineTo(pitchX + pitchWidth, pitchY + pitchHeight);
    ctx.stroke();

    // Try line markers (small dashes at 5m intervals on sides)
    ctx.lineWidth = 2;
    for (let i = 1; i < 10; i++) {
      const x = pitchX + (pitchWidth / 10) * i;
      // Top
      ctx.beginPath();
      ctx.moveTo(x, pitchY);
      ctx.lineTo(x, pitchY + 15);
      ctx.stroke();
      // Bottom
      ctx.beginPath();
      ctx.moveTo(x, pitchY + pitchHeight);
      ctx.lineTo(x, pitchY + pitchHeight - 15);
      ctx.stroke();
    }

    // Update player paths and draw players
    const newPaths = new Map(playerPaths);
    const basePlayerRadius = 15 * playerSize;

    players.forEach((player) => {
      const pos = getPositionAtTime(keyframes, player.id, currentTimeMs);
      if (!pos) return;

      // Track path
      if (!newPaths.has(player.id)) {
        newPaths.set(player.id, []);
      }
      const path = newPaths.get(player.id)!;
      
      // Add current position to path (limit to last 50 positions)
      if (path.length === 0 || path[path.length - 1].x !== pos.x || path[path.length - 1].y !== pos.y) {
        path.push({ ...pos });
        if (path.length > 50) path.shift();
      }

      const xNorm = pos.x / field.length;
      const yNorm = pos.y / field.width;

      const playerX = pitchX + xNorm * pitchWidth;
      const playerY = pitchY + yNorm * pitchHeight;

      // Draw path line if showLines is true
      if (showLines && path.length > 1) {
        ctx.strokeStyle = player.color;
        ctx.lineWidth = 2;
        ctx.setLineDash([]);
        ctx.globalAlpha = 0.5;
        
        ctx.beginPath();
        const firstPathPos = path[0];
        const firstX = pitchX + (firstPathPos.x / field.length) * pitchWidth;
        const firstY = pitchY + (firstPathPos.y / field.width) * pitchHeight;
        ctx.moveTo(firstX, firstY);
        
        for (let i = 1; i < path.length; i++) {
          const pathPos = path[i];
          const pathX = pitchX + (pathPos.x / field.length) * pitchWidth;
          const pathY = pitchY + (pathPos.y / field.width) * pitchHeight;
          ctx.lineTo(pathX, pathY);
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Player circle with shadow
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      ctx.beginPath();
      ctx.fillStyle = player.color;
      ctx.arc(playerX, playerY, basePlayerRadius, 0, Math.PI * 2);
      ctx.fill();

      // Border
      ctx.shadowColor = "transparent";
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Number
      ctx.fillStyle = player.color === "#facc15" || player.color === "#f9fafb" ? "#000000" : "#ffffff";
      ctx.font = `bold ${Math.floor(basePlayerRadius * 1.2)}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(player.number), playerX, playerY);
    });

    setPlayerPaths(newPaths);

    // Draw balls (only in ball placement mode, not when animating)
    // When a play is generated, balls become animated players, so hide static balls
    if (showStaticBalls && players.length === 0) {
      // Only show static balls if there are no animated players
      balls.forEach((ball) => {
        const xNorm = ball.x / field.length;
        const yNorm = ball.y / field.width;

        const ballX = pitchX + xNorm * pitchWidth;
        const ballY = pitchY + yNorm * pitchHeight;

        // Ball circle
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
        ctx.shadowBlur = 6;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        ctx.beginPath();
        ctx.fillStyle = ball.color;
        ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowColor = "transparent";
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Ball number if assigned
        if (ball.number !== undefined) {
          ctx.fillStyle = "#000";
          ctx.font = "bold 10px Arial";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(String(ball.number), ballX, ballY);
        }
      });
    }

    // Watermark
    ctx.shadowColor = "transparent";
    ctx.fillStyle = "rgba(250, 204, 21, 0.8)";
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "right";
    ctx.fillText("SCRUMMY", CANVAS_WIDTH - 30, CANVAS_HEIGHT - 40);
    ctx.fillStyle = "rgba(249, 250, 251, 0.6)";
    ctx.font = "14px Arial";
    ctx.fillText("PlayLab", CANVAS_WIDTH - 30, CANVAS_HEIGHT - 20);

    ctx.restore();
  }, [play, currentTimeMs, zoom, offsetX, offsetY, isLandscape, playerSize, showLines, playerPaths, balls]);

  // Reset paths when play changes
  useEffect(() => {
    setPlayerPaths(new Map());
  }, [play.id]);

  return (
    <canvas 
      ref={canvasRef} 
      width={CANVAS_WIDTH} 
      height={CANVAS_HEIGHT}
      style={{
        border: "2px solid #334155",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
        backgroundColor: "#000"
      }}
    />
  );
};

