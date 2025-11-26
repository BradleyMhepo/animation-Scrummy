import React, { useRef, useState, useEffect } from "react";

interface Ball {
  id: string;
  x: number;
  y: number;
  color: string;
  number?: number;
}

interface BallPlacementCanvasProps {
  width: number;
  height: number;
  balls: Ball[];
  onBallsChange: (balls: Ball[]) => void;
  isBallMode: boolean;
  currentColor: string;
  currentNumber?: number;
  onBallSelect: (ballId: string | null) => void;
  selectedBallId: string | null;
}

export const BallPlacementCanvas: React.FC<BallPlacementCanvasProps> = ({
  width,
  height,
  balls,
  onBallsChange,
  isBallMode,
  currentColor,
  currentNumber,
  onBallSelect,
  selectedBallId,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragBallId, setDragBallId] = useState<string | null>(null);

  useEffect(() => {
    drawBalls();
  }, [balls, isBallMode, selectedBallId, isDragging, dragBallId]);

  const drawBalls = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Clear overlay
    ctx.clearRect(0, 0, width, height);
    
    if (!isBallMode) return;

    // Draw all balls
    balls.forEach((ball) => {
      const isSelected = ball.id === selectedBallId;

      // Convert field coordinates to canvas coordinates
      // Field: 0-100 (x), 0-70 (y)
      // Canvas: 100-800 (x), 50-550 (y) - field area
      const canvasX = 100 + (ball.x / 100) * 700;
      const canvasY = 50 + (ball.y / 70) * 500;

      // Draw ball circle
      ctx.beginPath();
      ctx.fillStyle = ball.color;
      ctx.arc(canvasX, canvasY, 12, 0, Math.PI * 2);
      ctx.fill();

      // Border
      ctx.strokeStyle = isSelected ? "#facc15" : "#000";
      ctx.lineWidth = isSelected ? 3 : 2;
      ctx.stroke();

      // Number if assigned
      if (ball.number !== undefined) {
        ctx.fillStyle = "#000";
        ctx.font = "bold 12px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(ball.number), canvasX, canvasY);
      }

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

  const canvasToFieldCoords = (canvasX: number, canvasY: number): { x: number; y: number } => {
    // Convert canvas coords to field coords
    const fieldX = ((canvasX - 100) / 700) * 100;
    const fieldY = ((canvasY - 50) / 500) * 70;
    return {
      x: Math.max(0, Math.min(100, fieldX)),
      y: Math.max(0, Math.min(70, fieldY)),
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isBallMode) return;

    const point = getMousePos(e);
    const fieldCoords = canvasToFieldCoords(point.x, point.y);

    // Check if clicking on existing ball
    for (const ball of balls) {
      const canvasX = 100 + (ball.x / 100) * 700;
      const canvasY = 50 + (ball.y / 70) * 500;
      const distance = Math.sqrt(
        Math.pow(point.x - canvasX, 2) + Math.pow(point.y - canvasY, 2)
      );

      if (distance < 20) {
        // Clicked on existing ball - select and start dragging
        onBallSelect(ball.id);
        setDragBallId(ball.id);
        setIsDragging(true);
        return;
      }
    }

    // Create new ball at click position
    const newBall: Ball = {
      id: `ball_${Date.now()}`,
      x: fieldCoords.x,
      y: fieldCoords.y,
      color: currentColor,
      number: currentNumber,
    };

    onBallsChange([...balls, newBall]);
        onBallSelect(newBall.id);
        setDragBallId(newBall.id);
        setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !dragBallId || !isBallMode) return;

    const point = getMousePos(e);
    const fieldCoords = canvasToFieldCoords(point.x, point.y);

    // Update ball position
    onBallsChange(
      balls.map((ball) =>
        ball.id === dragBallId
          ? { ...ball, x: fieldCoords.x, y: fieldCoords.y }
          : ball
      )
    );
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragBallId(null);
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
        cursor: isBallMode ? (isDragging ? "grabbing" : "grab") : "default",
        pointerEvents: isBallMode ? "auto" : "none",
      }}
    />
  );
};

