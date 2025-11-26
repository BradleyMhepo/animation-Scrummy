export interface DetectedPlayer {
  id: string;
  bbox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  confidence: number;
  frameIndex: number;
  timestamp: number;
  centerX: number;
  centerY: number;
  assignedNumber?: number;
  assignedTeam?: "home" | "away";
  assignedColor?: string;
}

export interface VideoFrame {
  frameIndex: number;
  timestamp: number;
  imageData: ImageData;
  detectedPlayers: DetectedPlayer[];
}

export interface TrackedPlayer {
  trackId: string;
  detections: DetectedPlayer[];
  averagePosition: { x: number; y: number };
  firstFrame: number;
  lastFrame: number;
  assignedNumber?: number;
  assignedTeam?: "home" | "away";
  assignedColor?: string;
}

export interface FieldCalibration {
  topLeft: { x: number; y: number };
  topRight: { x: number; y: number };
  bottomLeft: { x: number; y: number };
  bottomRight: { x: number; y: number };
  fieldLength: number; // meters
  fieldWidth: number; // meters
}

export interface ProcessingProgress {
  stage: "loading" | "extracting" | "detecting" | "tracking" | "complete";
  progress: number;
  message: string;
}

