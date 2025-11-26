import React, { useRef, useState, useEffect } from "react";
import type { Drawing, DrawingPoint, DrawingType } from "../types/drawing";

interface DrawingCanvasProps {
  width: number;
  height: number;
  drawings: Drawing[];
  onDrawingsChange: (drawings: Drawing[]) => void;
  isDrawingMode: boolean;
  currentDrawingType: DrawingType;
  currentColor: string;
  currentFontSize?: number;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  width,
  height,
  drawings,
  onDrawingsChange,
  isDrawingMode,
  currentDrawingType,
  currentColor,
  currentFontSize = 20,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentDrawing, setCurrentDrawing] = useState<Drawing | null>(null);
  const [startPoint, setStartPoint] = useState<DrawingPoint | null>(null);

  // Draw all existing drawings
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, width, height);

    drawings.forEach((drawing) => {
      drawShape(ctx, drawing);
    });

    // Draw current in-progress drawing
    if (currentDrawing) {
      drawShape(ctx, currentDrawing);
    }
  }, [drawings, currentDrawing, width, height]);

  const drawShape = (ctx: CanvasRenderingContext2D, drawing: Drawing) => {
    ctx.strokeStyle = drawing.color;
    ctx.fillStyle = drawing.color;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    switch (drawing.type) {
      case "sketch":
        if (drawing.points.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(drawing.points[0].x, drawing.points[0].y);
        for (let i = 1; i < drawing.points.length; i++) {
          ctx.lineTo(drawing.points[i].x, drawing.points[i].y);
        }
        ctx.stroke();
        break;

      case "line":
        if (drawing.points.length !== 2) return;
        ctx.beginPath();
        ctx.moveTo(drawing.points[0].x, drawing.points[0].y);
        ctx.lineTo(drawing.points[1].x, drawing.points[1].y);
        ctx.stroke();
        break;

      case "arrow":
        if (drawing.points.length !== 2) return;
        drawArrow(ctx, drawing.points[0], drawing.points[1]);
        break;

      case "box":
        if (drawing.points.length !== 2) return;
        const boxWidth = drawing.points[1].x - drawing.points[0].x;
        const boxHeight = drawing.points[1].y - drawing.points[0].y;
        ctx.strokeRect(drawing.points[0].x, drawing.points[0].y, boxWidth, boxHeight);
        break;

      case "circle":
        if (drawing.points.length !== 2) return;
        const radius = Math.sqrt(
          Math.pow(drawing.points[1].x - drawing.points[0].x, 2) +
          Math.pow(drawing.points[1].y - drawing.points[0].y, 2)
        );
        ctx.beginPath();
        ctx.arc(drawing.points[0].x, drawing.points[0].y, radius, 0, Math.PI * 2);
        ctx.stroke();
        break;

      case "text":
        if (drawing.text && drawing.points.length > 0) {
          ctx.font = `bold ${drawing.fontSize || 20}px Arial`;
          ctx.textAlign = "left";
          ctx.textBaseline = "top";
          ctx.fillText(drawing.text, drawing.points[0].x, drawing.points[0].y);
        }
        break;
    }
  };

  const drawArrow = (ctx: CanvasRenderingContext2D, from: DrawingPoint, to: DrawingPoint) => {
    const headLength = 20;
    const angle = Math.atan2(to.y - from.y, to.x - from.x);

    // Draw line
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();

    // Draw arrowhead
    ctx.beginPath();
    ctx.moveTo(to.x, to.y);
    ctx.lineTo(
      to.x - headLength * Math.cos(angle - Math.PI / 6),
      to.y - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(to.x, to.y);
    ctx.lineTo(
      to.x - headLength * Math.cos(angle + Math.PI / 6),
      to.y - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();
  };

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>): DrawingPoint => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingMode) return;
    
    const point = getMousePos(e);
    setIsDrawing(true);
    setStartPoint(point);

    const newDrawing: Drawing = {
      id: Date.now().toString(),
      type: currentDrawingType,
      color: currentColor,
      points: [point],
      fontSize: currentFontSize,
    };

    setCurrentDrawing(newDrawing);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentDrawing || !startPoint) return;

    const point = getMousePos(e);

    if (currentDrawingType === "sketch") {
      // For sketch, add points continuously
      setCurrentDrawing({
        ...currentDrawing,
        points: [...currentDrawing.points, point],
      });
    } else {
      // For shapes, update the end point
      setCurrentDrawing({
        ...currentDrawing,
        points: [startPoint, point],
      });
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing || !currentDrawing) return;

    // Add the finished drawing to the list
    if (currentDrawing.type !== "text") {
      onDrawingsChange([...drawings, currentDrawing]);
    }

    setIsDrawing(false);
    setCurrentDrawing(null);
    setStartPoint(null);
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
        cursor: isDrawingMode ? "crosshair" : "default",
        pointerEvents: isDrawingMode ? "auto" : "none",
      }}
    />
  );
};

