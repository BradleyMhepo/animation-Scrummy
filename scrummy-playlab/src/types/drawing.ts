export type DrawingType = "sketch" | "line" | "arrow" | "box" | "circle" | "text";

export interface DrawingPoint {
  x: number;
  y: number;
}

export interface Drawing {
  id: string;
  type: DrawingType;
  color: string;
  points: DrawingPoint[];
  text?: string;
  fontSize?: number;
  frameIndex?: number;
}

export interface TextAnnotation extends Drawing {
  type: "text";
  text: string;
  fontSize: number;
}

