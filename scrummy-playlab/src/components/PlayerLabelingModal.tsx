import React, { useState, useRef, useEffect } from "react";
import type { TrackedPlayer, VideoFrame } from "../types/video";

interface PlayerLabelingModalProps {
  isOpen: boolean;
  tracks: TrackedPlayer[];
  frames: VideoFrame[];
  onClose: () => void;
  onComplete: (labeledTracks: TrackedPlayer[]) => void;
}

export const PlayerLabelingModal: React.FC<PlayerLabelingModalProps> = ({
  isOpen,
  tracks,
  frames,
  onClose,
  onComplete,
}) => {
  const [labeledTracks, setLabeledTracks] = useState<TrackedPlayer[]>(tracks);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [previewFrame, setPreviewFrame] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isOpen && frames.length > 0) {
      drawPreview();
    }
  }, [isOpen, previewFrame, labeledTracks, selectedTrackId]);

  if (!isOpen) {
    return null;
  }

  // Debug: Log what we have
  useEffect(() => {
    if (isOpen) {
      console.log('Labeling modal opened with:');
      console.log('- Tracks:', tracks.length);
      console.log('- Frames:', frames.length);
      console.log('- Sample track:', tracks[0]);
      console.log('- Sample frame:', frames[0]);
    }
  }, [isOpen, tracks, frames]);

  if (tracks.length === 0) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2000,
        }}
      >
        <div
          style={{
            backgroundColor: "#1e293b",
            padding: "40px",
            borderRadius: "16px",
            maxWidth: "500px",
            textAlign: "center",
            border: "2px solid #334155",
          }}
        >
          <h2 style={{ color: "#facc15", marginBottom: "16px" }}>
            ⚠️ No Players Detected
          </h2>
          <p style={{ color: "#cbd5e1", marginBottom: "24px" }}>
            The AI couldn't detect any players in your video.
          </p>
          <div style={{ 
            backgroundColor: "#0f172a", 
            padding: "16px", 
            borderRadius: "8px",
            textAlign: "left",
            marginBottom: "24px"
          }}>
            <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "8px" }}>
              <strong>Try:</strong>
            </p>
            <ul style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.8", paddingLeft: "24px" }}>
              <li>Better lighting (daytime or bright stadium)</li>
              <li>Sideline camera angle (see whole field)</li>
              <li>Higher resolution (720p or 1080p)</li>
              <li>Clearer view of players</li>
              <li>Shorter clip (10-15 seconds)</li>
            </ul>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: "12px 24px",
              backgroundColor: "#facc15",
              color: "#020617",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const drawPreview = () => {
    const canvas = canvasRef.current;
    if (!canvas || frames.length === 0) return;

    const ctx = canvas.getContext("2d")!;
    const frame = frames[previewFrame];
    
    // Create temp canvas to draw image data
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = frame.imageData.width;
    tempCanvas.height = frame.imageData.height;
    const tempCtx = tempCanvas.getContext("2d")!;
    tempCtx.putImageData(frame.imageData, 0, 0);

    // Scale to fit
    const scale = Math.min(canvas.width / tempCanvas.width, canvas.height / tempCanvas.height);
    const scaledWidth = tempCanvas.width * scale;
    const scaledHeight = tempCanvas.height * scale;
    const offsetX = (canvas.width - scaledWidth) / 2;
    const offsetY = (canvas.height - scaledHeight) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(tempCanvas, offsetX, offsetY, scaledWidth, scaledHeight);

    // Draw bounding boxes
    labeledTracks.forEach((track) => {
      const detection = track.detections.find((d) => d.frameIndex === previewFrame);
      if (!detection) return;

      const isSelected = track.trackId === selectedTrackId;
      const hasLabel = track.assignedNumber !== undefined;

      // Scale bbox
      const x = offsetX + detection.bbox.x * scale;
      const y = offsetY + detection.bbox.y * scale;
      const width = detection.bbox.width * scale;
      const height = detection.bbox.height * scale;

      // Draw box
      ctx.strokeStyle = isSelected ? "#facc15" : (hasLabel ? "#22c55e" : "#3b82f6");
      ctx.lineWidth = isSelected ? 4 : 2;
      ctx.strokeRect(x, y, width, height);

      // Draw label
      if (track.assignedNumber !== undefined) {
        const labelBg = track.assignedColor || "#facc15";
        const labelText = String(track.assignedNumber);
        
        ctx.fillStyle = labelBg;
        ctx.fillRect(x, y - 30, 50, 30);
        
        ctx.fillStyle = "#000";
        ctx.font = "bold 20px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(labelText, x + 25, y - 15);
      } else {
        // Draw track ID
        ctx.fillStyle = "rgba(59, 130, 246, 0.8)";
        ctx.font = "12px Arial";
        ctx.fillText(track.trackId, x + 5, y - 5);
      }
    });
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || frames.length === 0) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const frame = frames[previewFrame];
    const scale = Math.min(canvas.width / frame.imageData.width, canvas.height / frame.imageData.height);
    const scaledWidth = frame.imageData.width * scale;
    const scaledHeight = frame.imageData.height * scale;
    const offsetX = (canvas.width - scaledWidth) / 2;
    const offsetY = (canvas.height - scaledHeight) / 2;

    // Find clicked player
    for (const track of labeledTracks) {
      const detection = track.detections.find((d) => d.frameIndex === previewFrame);
      if (!detection) continue;

      const x = offsetX + detection.bbox.x * scale;
      const y = offsetY + detection.bbox.y * scale;
      const width = detection.bbox.width * scale;
      const height = detection.bbox.height * scale;

      if (clickX >= x && clickX <= x + width && clickY >= y && clickY <= y + height) {
        setSelectedTrackId(track.trackId);
        return;
      }
    }
  };

  const updateSelectedTrack = (updates: Partial<TrackedPlayer>) => {
    if (!selectedTrackId) return;

    setLabeledTracks(
      labeledTracks.map((track) =>
        track.trackId === selectedTrackId ? { ...track, ...updates } : track
      )
    );
  };

  const handleComplete = () => {
    const allLabeled = labeledTracks.every((track) => track.assignedNumber !== undefined);
    
    if (!allLabeled) {
      if (!confirm("Some players haven't been labeled. Continue anyway?")) {
        return;
      }
    }

    onComplete(labeledTracks);
  };

  const selectedTrack = labeledTracks.find((t) => t.trackId === selectedTrackId);
  const labeledCount = labeledTracks.filter((t) => t.assignedNumber !== undefined).length;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "#1e293b",
          padding: "24px",
          borderRadius: "16px",
          maxWidth: "1400px",
          width: "100%",
          maxHeight: "90vh",
          overflow: "auto",
          border: "2px solid #334155",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <div>
            <h2 style={{ color: "#facc15", margin: 0, marginBottom: "8px" }}>
              🏷️ Label Players
            </h2>
            <p style={{ color: "#94a3b8", margin: 0, fontSize: "14px" }}>
              Click on players to assign jersey numbers • {labeledCount}/{tracks.length} labeled
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#f9fafb",
              fontSize: "32px",
              cursor: "pointer",
              padding: 0,
            }}
          >
            ×
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
          {/* Video Preview */}
          <div>
            <canvas
              ref={canvasRef}
              width={800}
              height={450}
              onClick={handleCanvasClick}
              style={{
                width: "100%",
                borderRadius: "8px",
                cursor: "crosshair",
                backgroundColor: "#000",
                marginBottom: "16px",
              }}
            />

            {/* Frame Scrubber */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ color: "#cbd5e1", fontSize: "14px" }}>
                  Frame: {previewFrame + 1} / {frames.length}
                </span>
                <span style={{ color: "#64748b", fontSize: "12px" }}>
                  {(frames[previewFrame]?.timestamp || 0).toFixed(2)}s
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={frames.length - 1}
                value={previewFrame}
                onChange={(e) => setPreviewFrame(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>
          </div>

          {/* Player Labeling Panel */}
          <div>
            {selectedTrack ? (
              <div style={{ 
                backgroundColor: "#0f172a", 
                padding: "20px", 
                borderRadius: "8px",
                border: "2px solid #facc15"
              }}>
                <h3 style={{ color: "#facc15", fontSize: "16px", marginBottom: "16px" }}>
                  Selected Player
                </h3>

                {/* Jersey Number */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ color: "#cbd5e1", fontSize: "14px", display: "block", marginBottom: "8px" }}>
                    Jersey Number:
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={selectedTrack.assignedNumber || ""}
                    onChange={(e) =>
                      updateSelectedTrack({ assignedNumber: parseInt(e.target.value) || undefined })
                    }
                    placeholder="Enter number"
                    style={{
                      width: "100%",
                      padding: "10px",
                      fontSize: "16px",
                      borderRadius: "6px",
                      border: "2px solid #334155",
                      backgroundColor: "#1e293b",
                      color: "#f9fafb",
                    }}
                    autoFocus
                  />
                </div>

                {/* Team */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ color: "#cbd5e1", fontSize: "14px", display: "block", marginBottom: "8px" }}>
                    Team:
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => updateSelectedTrack({ assignedTeam: "home", assignedColor: "#facc15" })}
                      style={{
                        flex: 1,
                        padding: "10px",
                        backgroundColor: selectedTrack.assignedTeam === "home" ? "#facc15" : "#334155",
                        color: selectedTrack.assignedTeam === "home" ? "#020617" : "#f9fafb",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      Home
                    </button>
                    <button
                      onClick={() => updateSelectedTrack({ assignedTeam: "away", assignedColor: "#f9fafb" })}
                      style={{
                        flex: 1,
                        padding: "10px",
                        backgroundColor: selectedTrack.assignedTeam === "away" ? "#f9fafb" : "#334155",
                        color: selectedTrack.assignedTeam === "away" ? "#020617" : "#f9fafb",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      Away
                    </button>
                  </div>
                </div>

                {/* Track Info */}
                <div style={{ 
                  backgroundColor: "#1e293b", 
                  padding: "12px", 
                  borderRadius: "6px",
                  fontSize: "12px",
                  color: "#94a3b8"
                }}>
                  <div>Detections: {selectedTrack.detections.length}</div>
                  <div>Frames: {selectedTrack.firstFrame} - {selectedTrack.lastFrame}</div>
                  <div>Track ID: {selectedTrack.trackId}</div>
                </div>
              </div>
            ) : (
              <div style={{ 
                backgroundColor: "#0f172a", 
                padding: "40px 20px", 
                borderRadius: "8px",
                textAlign: "center",
                color: "#64748b"
              }}>
                Click on a player in the video to label them
              </div>
            )}

            {/* Player List */}
            <div style={{ marginTop: "20px" }}>
              <h3 style={{ color: "#cbd5e1", fontSize: "14px", marginBottom: "12px" }}>
                All Players ({labeledCount}/{tracks.length})
              </h3>
              <div style={{ 
                maxHeight: "300px", 
                overflowY: "auto",
                backgroundColor: "#0f172a",
                borderRadius: "8px",
                padding: "8px"
              }}>
                {labeledTracks.map((track) => (
                  <div
                    key={track.trackId}
                    onClick={() => setSelectedTrackId(track.trackId)}
                    style={{
                      padding: "8px 12px",
                      marginBottom: "4px",
                      borderRadius: "6px",
                      backgroundColor: track.trackId === selectedTrackId ? "#334155" : "transparent",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      color: track.assignedNumber ? "#22c55e" : "#94a3b8",
                      fontSize: "14px",
                    }}
                  >
                    <span>
                      {track.assignedNumber ? `#${track.assignedNumber}` : track.trackId}
                    </span>
                    <span style={{ fontSize: "12px" }}>
                      {track.assignedNumber ? "✓" : "❌"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ 
          marginTop: "24px", 
          display: "flex", 
          gap: "12px",
          justifyContent: "flex-end"
        }}>
          <button
            onClick={onClose}
            style={{
              padding: "12px 24px",
              backgroundColor: "#334155",
              color: "#f9fafb",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleComplete}
            style={{
              padding: "12px 24px",
              backgroundColor: "#facc15",
              color: "#020617",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Generate Play ({labeledCount} labeled)
          </button>
        </div>
      </div>
    </div>
  );
};

