export interface PlayerPath {
  playerId: string;
  points: { x: number; y: number }[];
  color: string;
  number?: number;
}

export interface Ball {
  id: string;
  path: { x: number; y: number; timeMs: number }[];
  color: string;
}

