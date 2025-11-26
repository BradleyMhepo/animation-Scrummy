export interface Field {
  length: number; // meters
  width: number;  // meters
}

export interface Player {
  id: string;
  name: string;
  team: "home" | "away";
  number: number;
  color: string;
}

export interface Position {
  x: number; // 0–length
  y: number; // 0–width
}

export interface Keyframe {
  timeMs: number;
  positions: Record<string, Position>; // playerId -> position
}

export interface Play {
  id: string;
  name: string;
  description?: string;
  durationMs: number;
  field: Field;
  players: Player[];
  keyframes: Keyframe[];
}

