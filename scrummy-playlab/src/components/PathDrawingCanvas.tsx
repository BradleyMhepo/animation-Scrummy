import React, { useRef, useState, useEffect } from "react";
import type { PlayerPath } from "../types/path";

interface Ball {
  id: string;
  x: number;
  y: number;
  color: string;
  number?: number;
}

interface PathDrawingCanvasProps {
  width: number;
  height: number;
  playerPaths: PlayerPath[];
  onPathsChange: (paths: PlayerPath[]) => void;
  isPathMode: boolean;
  currentColor: string;
  selectedPlayerId: string | null;
  onPlayerSelect: (playerId: string | null) => void;
  balls?: Ball[];
  selectedBallId?: string | null;
  onBallSelect?: (ballId: string | null) => void;
  onPathNumberChange?: (pathId: string, number: number | undefined) => void;
}

export const PathDrawingCanvas: React.FC<PathDrawingCanvasProps> = ({
  width,
  height,
  playerPaths,
  onPathsChange,
  isPathMode,
  currentColor,
  selectedPlayerId,
  onPlayerSelect,
  balls = [],
  selectedBallId = null,
  onBallSelect,
  onPathNumberChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
  const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(null);

  useEffect(() => {
    drawPaths();
  }, [playerPaths, selectedPlayerId, isPathMode, currentPath, isDrawing, balls, selectedBallId]);

  const drawPaths = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Clear the overlay canvas (field is drawn below)
    ctx.clearRect(0, 0, width, height);
    
    // Only draw if in path mode
    if (!isPathMode) return;

    // Draw balls (for reference when drawing paths)
    if (onBallSelect && balls.length > 0) {
      balls.forEach((ball) => {
        const canvasX = 100 + (ball.x / 100) * 700;
        const canvasY = 50 + (ball.y / 70) * 500;
        const isSelected = ball.id === selectedBallId;

        // Draw ball
        ctx.beginPath();
        ctx.fillStyle = ball.color;
        ctx.arc(canvasX, canvasY, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = isSelected ? "#facc15" : "#000";
        ctx.lineWidth = isSelected ? 3 : 2;
        ctx.stroke();

        // Selection indicator
        if (isSelected) {
          ctx.strokeStyle = "#facc15";
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          ctx.beginPath();
          ctx.arc(canvasX, canvasY, 18, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });
    }

    // Draw all player paths
    playerPaths.forEach((path) => {
      if (path.points.length < 2) return;

      const isSelected = path.playerId === selectedPlayerId;

      // Draw path line
      ctx.strokeStyle = isSelected ? "#facc15" : path.color;
      ctx.lineWidth = isSelected ? 4 : 3;
      ctx.setLineDash([]);
      ctx.globalAlpha = 0.8;

      ctx.beginPath();
      ctx.moveTo(path.points[0].x, path.points[0].y);
      for (let i = 1; i < path.points.length; i++) {
        ctx.lineTo(path.points[i].x, path.points[i].y);
      }
      ctx.stroke();

      // Draw start point (player position)
      ctx.globalAlpha = 1;
      ctx.fillStyle = path.color;
      ctx.beginPath();
      ctx.arc(path.points[0].x, path.points[0].y, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw player number
      if (path.number !== undefined) {
        ctx.fillStyle = "#000";
        ctx.font = "bold 14px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(path.number), path.points[0].x, path.points[0].y);
      }

      // Draw end point
      const endPoint = path.points[path.points.length - 1];
      ctx.fillStyle = path.color;
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.arc(endPoint.x, endPoint.y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      // Draw waypoints
      for (let i = 1; i < path.points.length - 1; i++) {
        ctx.fillStyle = path.color;
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.arc(path.points[i].x, path.points[i].y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    });

    // Draw current path being drawn
    if (currentPath.length > 0 && isDrawing) {
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.globalAlpha = 0.6;

      ctx.beginPath();
      ctx.moveTo(currentPath[0].x, currentPath[0].y);
      for (let i = 1; i < currentPath.length; i++) {
        ctx.lineTo(currentPath[i].x, currentPath[i].y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
    }
  };

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>): { x: number; y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPathMode) return;

    const point = getMousePos(e);

    // First check if clicking on a ball (for ball animation)
    if (onBallSelect && balls.length > 0) {
      for (const ball of balls) {
        // Convert field coords to canvas coords
        const canvasX = 100 + (ball.x / 100) * 700;
        const canvasY = 50 + (ball.y / 70) * 500;
        const distance = Math.sqrt(
          Math.pow(point.x - canvasX, 2) + Math.pow(point.y - canvasY, 2)
        );

        if (distance < 20) {
          // Clicked on ball - select it and start drawing path
          onBallSelect(ball.id);
          const ballPathId = `ball_path_${ball.id}`;
          const existingPath = playerPaths.find(p => p.playerId === ballPathId);
          
        if (existingPath) {
          setCurrentPlayerId(ballPathId);
          setIsDrawing(true);
          setCurrentPath([...existingPath.points]);
          onPlayerSelect(ballPathId);
        } else {
          setCurrentPlayerId(ballPathId);
          setIsDrawing(true);
          setCurrentPath([{ x: canvasX, y: canvasY }]);
          onPlayerSelect(ballPathId);
          // Set the path number to match the ball's number
          if (onPathNumberChange && ball.number !== undefined) {
            onPathNumberChange(ballPathId, ball.number);
          }
        }
          return;
        }
      }
    }

    // Check if clicking on existing player start point
    for (const path of playerPaths) {
      const startPoint = path.points[0];
      const distance = Math.sqrt(
        Math.pow(point.x - startPoint.x, 2) + Math.pow(point.y - startPoint.y, 2)
      );

      if (distance < 20) {
        // Clicked on existing player - select it
        onPlayerSelect(path.playerId);
        setCurrentPlayerId(path.playerId);
        setIsDrawing(true);
        setCurrentPath([...path.points]);
        return;
      }
    }

    // New player - create new path
    const newPlayerId = `player_${Date.now()}`;
    setCurrentPlayerId(newPlayerId);
    setIsDrawing(true);
    setCurrentPath([point]);
    onPlayerSelect(newPlayerId);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !isPathMode) return;

    const point = getMousePos(e);
    setCurrentPath([...currentPath, point]);
    drawPaths();
  };

  const handleMouseUp = () => {
    if (!isDrawing || !currentPlayerId || currentPath.length < 2) {
      setIsDrawing(false);
      setCurrentPath([]);
      setCurrentPlayerId(null);
      return;
    }

    // Get ball number if this is a ball path
    let pathNumber: number | undefined = undefined;
    if (currentPlayerId.startsWith("ball_path_")) {
      const ballId = currentPlayerId.replace("ball_path_", "");
      const ball = balls.find(b => b.id === ballId);
      if (ball && ball.number !== undefined) {
        pathNumber = ball.number;
      }
    }

    // Save the path
    const newPath: PlayerPath = {
      playerId: currentPlayerId,
      points: currentPath,
      color: currentColor,
      number: pathNumber,
    };

    // Update or add path
    const existingIndex = playerPaths.findIndex((p) => p.playerId === currentPlayerId);
    if (existingIndex >= 0) {
      const updated = [...playerPaths];
      // Preserve existing number if path already had one
      const existingPath = updated[existingIndex];
      updated[existingIndex] = {
        ...newPath,
        number: newPath.number !== undefined ? newPath.number : existingPath.number,
      };
      onPathsChange(updated);
    } else {
      onPathsChange([...playerPaths, newPath]);
    }

    setIsDrawing(false);
    setCurrentPath([]);
    setCurrentPlayerId(null);
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        cursor: isPathMode ? "crosshair" : "default",
        pointerEvents: isPathMode ? "auto" : "none",
      }}
    />
  );
};

