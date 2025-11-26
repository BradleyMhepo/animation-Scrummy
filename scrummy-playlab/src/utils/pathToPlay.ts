import type { PlayerPath } from "../types/path";
import type { Play, Player, Keyframe } from "../types/play";

interface Ball {
  id: string;
  x: number;
  y: number;
  color: string;
  number?: number;
}

export const generatePlayFromPaths = (
  playerPaths: PlayerPath[],
  durationMs: number = 10000,
  balls: Ball[] = []
): Play => {
  // Create players from paths
  const players: Player[] = [];
  let playerIndex = 1;
  
  playerPaths.forEach((path) => {
    // Check if this is a ball path
    const isBallPath = path.playerId.startsWith("ball_path_");
    
    if (isBallPath) {
      // Find the corresponding ball
      const ballId = path.playerId.replace("ball_path_", "");
      const ball = balls.find(b => b.id === ballId);
      
      if (ball) {
        // Create player from ball - USE BALL'S NUMBER!
        players.push({
          id: path.playerId,
          name: ball.number !== undefined ? `Ball ${ball.number}` : `Ball ${playerIndex}`,
          team: ball.color === "#facc15" ? "home" : "away",
          number: ball.number !== undefined ? ball.number : playerIndex, // Use ball's number!
          color: ball.color,
        });
        if (ball.number === undefined) playerIndex++;
      }
    } else {
      // Regular player path - use path's number
      players.push({
        id: path.playerId,
        name: path.number !== undefined ? `Player ${path.number}` : `Player ${playerIndex}`,
        team: path.color === "#facc15" ? "home" : "away",
        number: path.number !== undefined ? path.number : playerIndex, // Use path's number!
        color: path.color,
      });
      if (path.number === undefined) playerIndex++;
    }
  });

  // Generate keyframes from paths
  const keyframes: Keyframe[] = [];
  const numKeyframes = 20; // 20 keyframes for smooth animation
  const timeStep = durationMs / (numKeyframes - 1);

  for (let i = 0; i < numKeyframes; i++) {
    const timeMs = Math.round(i * timeStep);
    const progress = i / (numKeyframes - 1); // 0 to 1

    const positions: Record<string, { x: number; y: number }> = {};

    playerPaths.forEach((path) => {
      if (path.points.length < 2) return;

      // Find position along path based on progress
      const totalPathLength = calculatePathLength(path.points);
      const targetLength = totalPathLength * progress;

      let currentLength = 0;
      let position = { ...path.points[0] };

      for (let j = 0; j < path.points.length - 1; j++) {
        const segmentLength = distance(path.points[j], path.points[j + 1]);
        
        if (currentLength + segmentLength >= targetLength) {
          // Interpolate within this segment
          const segmentProgress = (targetLength - currentLength) / segmentLength;
          position = {
            x: path.points[j].x + (path.points[j + 1].x - path.points[j].x) * segmentProgress,
            y: path.points[j].y + (path.points[j + 1].y - path.points[j].y) * segmentProgress,
          };
          break;
        }

        currentLength += segmentLength;
      }

      // Check if this is a ball path
      const isBallPath = path.playerId.startsWith("ball_path_");
      
      if (isBallPath) {
        // For ball paths, use the ball's starting position
        const ballId = path.playerId.replace("ball_path_", "");
        const ball = balls.find(b => b.id === ballId);
        
        if (ball) {
          // Start from ball's actual position on field
          if (progress === 0) {
            // At start, use ball's exact position
            positions[path.playerId] = {
              x: ball.x,
              y: ball.y,
            };
          } else {
            // Move along path from ball's starting position
            const fieldX = ((position.x - 100) / 700) * 100;
            const fieldY = ((position.y - 50) / 500) * 70;
            
            positions[path.playerId] = {
              x: Math.max(0, Math.min(100, fieldX)),
              y: Math.max(0, Math.min(70, fieldY)),
            };
          }
        }
      } else {
        // Convert canvas coordinates to field coordinates (0-100, 0-70)
        // Assuming canvas is 900x600, field area is roughly 700x500
        const fieldX = ((position.x - 100) / 700) * 100;
        const fieldY = ((position.y - 50) / 500) * 70;

        positions[path.playerId] = {
          x: Math.max(0, Math.min(100, fieldX)),
          y: Math.max(0, Math.min(70, fieldY)),
        };
      }
    });

    keyframes.push({
      timeMs,
      positions,
    });
  }

  return {
    id: `path_play_${Date.now()}`,
    name: "Path-Based Play",
    description: "Generated from drawn paths",
    durationMs,
    field: {
      length: 100,
      width: 70,
    },
    players,
    keyframes,
  };
};

function calculatePathLength(points: { x: number; y: number }[]): number {
  let length = 0;
  for (let i = 0; i < points.length - 1; i++) {
    length += distance(points[i], points[i + 1]);
  }
  return length;
}

function distance(
  p1: { x: number; y: number },
  p2: { x: number; y: number }
): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

