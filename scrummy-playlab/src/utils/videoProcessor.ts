import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as tf from '@tensorflow/tfjs';
import type { DetectedPlayer, VideoFrame, TrackedPlayer, FieldCalibration, ProcessingProgress } from '../types/video';
import type { Play, Player, Keyframe } from '../types/play';

export class VideoProcessor {
  private model: cocoSsd.ObjectDetection | null = null;
  private video: HTMLVideoElement | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;

  async initialize() {
    console.log('Loading TensorFlow.js model...');
    await tf.ready();
    this.model = await cocoSsd.load();
    console.log('Model loaded successfully!');
  }

  async processVideo(
    videoFile: File,
    onProgress: (progress: ProcessingProgress) => void
  ): Promise<VideoFrame[]> {
    if (!this.model) {
      throw new Error('AI model not initialized. Please wait for model to load.');
    }

    onProgress({ stage: 'loading', progress: 0, message: 'Loading video...' });

    // Create video element
    this.video = document.createElement('video');
    this.video.src = URL.createObjectURL(videoFile);
    this.video.muted = true;
    this.video.preload = 'metadata';

    await new Promise((resolve, reject) => {
      this.video!.onloadedmetadata = () => {
        console.log('Video loaded:', {
          duration: this.video!.duration,
          width: this.video!.videoWidth,
          height: this.video!.videoHeight
        });
        resolve(null);
      };
      this.video!.onerror = (e) => {
        console.error('Video load error:', e);
        reject(new Error('Failed to load video file'));
      };
      // Timeout after 10 seconds
      setTimeout(() => {
        if (!this.video!.readyState) {
          reject(new Error('Video loading timeout'));
        }
      }, 10000);
    });

    const duration = this.video.duration;
    if (!duration || duration === 0) {
      throw new Error('Invalid video duration');
    }

    const fps = 2; // Extract 2 frames per second
    const frameInterval = 1 / fps;
    const totalFrames = Math.floor(duration * fps);

    console.log('Video info:', {
      duration,
      totalFrames,
      width: this.video.videoWidth,
      height: this.video.videoHeight
    });

    // Create canvas for frame extraction
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;
    this.ctx = this.canvas.getContext('2d')!;

    const frames: VideoFrame[] = [];

    onProgress({ stage: 'extracting', progress: 0, message: 'Extracting frames...' });

    // Extract frames
    for (let i = 0; i < totalFrames; i++) {
      const timestamp = i * frameInterval;
      
      try {
        this.video.currentTime = timestamp;

        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error(`Frame seek timeout at ${timestamp}s`));
          }, 5000);

          this.video!.onseeked = () => {
            clearTimeout(timeout);
            resolve();
          };
        });

        // Draw frame to canvas
        this.ctx!.drawImage(this.video, 0, 0);
        const imageData = this.ctx!.getImageData(0, 0, this.canvas.width, this.canvas.height);

        onProgress({
          stage: 'detecting',
          progress: Math.round((i / totalFrames) * 100),
          message: `Detecting players in frame ${i + 1}/${totalFrames}...`
        });

        // Detect players
        const detectedPlayers = await this.detectPlayersInFrame(imageData, i, timestamp);
        console.log(`Frame ${i + 1}: Found ${detectedPlayers.length} players`);

        frames.push({
          frameIndex: i,
          timestamp,
          imageData,
          detectedPlayers
        });
      } catch (error) {
        console.warn(`Error processing frame ${i + 1}:`, error);
        // Continue with next frame
      }
    }

    console.log(`Total frames processed: ${frames.length}`);
    console.log(`Total detections: ${frames.reduce((sum, f) => sum + f.detectedPlayers.length, 0)}`);

    onProgress({ stage: 'complete', progress: 100, message: 'Processing complete!' });

    // Cleanup
    URL.revokeObjectURL(this.video.src);

    return frames;
  }

  private async detectPlayersInFrame(
    imageData: ImageData,
    frameIndex: number,
    timestamp: number
  ): Promise<DetectedPlayer[]> {
    if (!this.model) {
      throw new Error('Model not initialized');
    }

    try {
      // Create temporary canvas for detection
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = imageData.width;
      tempCanvas.height = imageData.height;
      const tempCtx = tempCanvas.getContext('2d')!;
      tempCtx.putImageData(imageData, 0, 0);

      // Run detection
      const predictions = await this.model.detect(tempCanvas);

      // Filter for persons only
      const players: DetectedPlayer[] = predictions
        .filter(pred => pred.class === 'person' && pred.score > 0.5)
        .map((pred, index) => {
          const [x, y, width, height] = pred.bbox;
          return {
            id: `frame${frameIndex}_player${index}`,
            bbox: { x, y, width, height },
            confidence: pred.score,
            frameIndex,
            timestamp,
            centerX: x + width / 2,
            centerY: y + height / 2
          };
        });

      return players;
    } catch (error) {
      console.error(`Detection error in frame ${frameIndex}:`, error);
      return []; // Return empty array on error, don't crash
    }
  }

  trackPlayers(frames: VideoFrame[]): TrackedPlayer[] {
    const tracks: TrackedPlayer[] = [];
    const maxDistance = 100; // pixels - max movement between frames

    frames.forEach((frame) => {
      frame.detectedPlayers.forEach((detection) => {
        // Try to match with existing track
        let matched = false;

        for (const track of tracks) {
          const lastDetection = track.detections[track.detections.length - 1];
          
          // Check if detection is close to last position in track
          const distance = Math.sqrt(
            Math.pow(detection.centerX - lastDetection.centerX, 2) +
            Math.pow(detection.centerY - lastDetection.centerY, 2)
          );

          // Check if it's the next frame or close enough
          const frameDiff = detection.frameIndex - lastDetection.frameIndex;
          
          if (distance < maxDistance && frameDiff <= 2) {
            track.detections.push(detection);
            track.lastFrame = detection.frameIndex;
            track.averagePosition = this.calculateAveragePosition(track.detections);
            matched = true;
            break;
          }
        }

        // Create new track if no match
        if (!matched) {
          tracks.push({
            trackId: `track_${tracks.length}`,
            detections: [detection],
            averagePosition: { x: detection.centerX, y: detection.centerY },
            firstFrame: detection.frameIndex,
            lastFrame: detection.frameIndex
          });
        }
      });
    });

    // Filter out short tracks (likely false detections)
    return tracks.filter(track => track.detections.length >= 3);
  }

  private calculateAveragePosition(detections: DetectedPlayer[]): { x: number; y: number } {
    const sum = detections.reduce(
      (acc, det) => ({ x: acc.x + det.centerX, y: acc.y + det.centerY }),
      { x: 0, y: 0 }
    );
    return {
      x: sum.x / detections.length,
      y: sum.y / detections.length
    };
  }

  transformToFieldCoordinates(
    tracks: TrackedPlayer[],
    calibration: FieldCalibration,
    videoWidth: number,
    videoHeight: number
  ): TrackedPlayer[] {
    // Simple perspective transformation
    // In a real implementation, use homography matrix
    
    return tracks.map(track => ({
      ...track,
      detections: track.detections.map(det => {
        // Normalize to 0-1
        const normX = det.centerX / videoWidth;
        const normY = det.centerY / videoHeight;

        // Map to field coordinates
        const fieldX = normX * calibration.fieldLength;
        const fieldY = normY * calibration.fieldWidth;

        return {
          ...det,
          centerX: fieldX,
          centerY: fieldY
        };
      })
    }));
  }

  generatePlayFromTracks(
    tracks: TrackedPlayer[],
    videoFile: File,
    durationMs: number
  ): Play {
    const players: Player[] = tracks.map((track, index) => ({
      id: track.trackId,
      name: track.assignedNumber ? `Player ${track.assignedNumber}` : `Player ${index + 1}`,
      team: track.assignedTeam || "home",
      number: track.assignedNumber || index + 1,
      color: track.assignedColor || (track.assignedTeam === "away" ? "#f9fafb" : "#facc15")
    }));

    // Generate keyframes from detections
    const keyframeMap = new Map<number, Record<string, { x: number; y: number }>>();

    tracks.forEach(track => {
      track.detections.forEach(det => {
        const timeMs = Math.round(det.timestamp * 1000);
        
        if (!keyframeMap.has(timeMs)) {
          keyframeMap.set(timeMs, {});
        }

        const positions = keyframeMap.get(timeMs)!;
        positions[track.trackId] = {
          x: det.centerX,
          y: det.centerY
        };
      });
    });

    const keyframes: Keyframe[] = Array.from(keyframeMap.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([timeMs, positions]) => ({
        timeMs,
        positions
      }));

    return {
      id: `video_${Date.now()}`,
      name: videoFile.name.replace(/\.[^/.]+$/, ''),
      description: 'Generated from video',
      durationMs,
      field: {
        length: 100,
        width: 70
      },
      players,
      keyframes
    };
  }
}

export const videoProcessor = new VideoProcessor();

