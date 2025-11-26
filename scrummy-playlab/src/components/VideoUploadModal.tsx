import React, { useState, useRef } from "react";
import type { ProcessingProgress } from "../types/video";

interface VideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVideoSelect: (file: File) => void;
  isProcessing: boolean;
  progress: ProcessingProgress | null;
}

export const VideoUploadModal: React.FC<VideoUploadModalProps> = ({
  isOpen,
  onClose,
  onVideoSelect,
  isProcessing,
  progress,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("video/")) {
      setSelectedFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("video/")) {
      setSelectedFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleProcess = () => {
    if (selectedFile) {
      onVideoSelect(selectedFile);
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "loading": return "#3b82f6";
      case "extracting": return "#8b5cf6";
      case "detecting": return "#facc15";
      case "tracking": return "#10b981";
      case "complete": return "#22c55e";
      default: return "#6b7280";
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
      }}
      onClick={!isProcessing ? onClose : undefined}
    >
      <div
        style={{
          backgroundColor: "#1e293b",
          padding: "40px",
          borderRadius: "16px",
          maxWidth: "700px",
          width: "90%",
          border: "2px solid #334155",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {isProcessing && progress ? (
          // Processing view
          <>
            <h2 style={{ color: "#facc15", marginBottom: "24px", textAlign: "center" }}>
              🎬 Processing Video...
            </h2>
            
            <div style={{ marginBottom: "24px" }}>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                marginBottom: "12px",
                color: "#cbd5e1"
              }}>
                <span style={{ textTransform: "capitalize" }}>{progress.stage}</span>
                <span>{progress.progress}%</span>
              </div>
              
              <div
                style={{
                  width: "100%",
                  height: "32px",
                  backgroundColor: "#0f172a",
                  borderRadius: "16px",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: `${progress.progress}%`,
                    height: "100%",
                    backgroundColor: getStageColor(progress.stage),
                    transition: "width 0.3s ease, background-color 0.5s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                />
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: "bold",
                  textShadow: "0 1px 2px rgba(0,0,0,0.5)"
                }}>
                  {progress.progress}%
                </div>
              </div>

              <p style={{ 
                color: "#94a3b8", 
                marginTop: "12px", 
                fontSize: "14px",
                textAlign: "center"
              }}>
                {progress.message}
              </p>
            </div>

            <div style={{ 
              backgroundColor: "#0f172a", 
              padding: "16px", 
              borderRadius: "8px",
              marginBottom: "24px"
            }}>
              <div style={{ color: "#cbd5e1", fontSize: "14px", lineHeight: "1.8" }}>
                <div>✅ Loading video...</div>
                <div style={{ opacity: progress.stage !== "loading" ? 1 : 0.5 }}>
                  ✅ Extracting frames...
                </div>
                <div style={{ opacity: ["detecting", "tracking", "complete"].includes(progress.stage) ? 1 : 0.5 }}>
                  🔍 Detecting players with AI...
                </div>
                <div style={{ opacity: progress.stage === "complete" ? 1 : 0.5 }}>
                  ✨ Complete!
                </div>
              </div>
            </div>

            {progress.stage !== "complete" && (
              <p style={{ 
                color: "#94a3b8", 
                fontSize: "12px", 
                textAlign: "center",
                fontStyle: "italic"
              }}>
                This may take 30-60 seconds depending on video length...
              </p>
            )}
          </>
        ) : (
          // Upload view
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ color: "#facc15", margin: 0 }}>Upload Rugby Video</h2>
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

            {!selectedFile ? (
              <>
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: "3px dashed #475569",
                    borderRadius: "12px",
                    padding: "60px 40px",
                    textAlign: "center",
                    cursor: "pointer",
                    backgroundColor: "#0f172a",
                    transition: "all 0.3s ease",
                    marginBottom: "24px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#facc15";
                    e.currentTarget.style.backgroundColor = "#1e293b";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#475569";
                    e.currentTarget.style.backgroundColor = "#0f172a";
                  }}
                >
                  <div style={{ fontSize: "64px", marginBottom: "16px" }}>🎥</div>
                  <p style={{ color: "#cbd5e1", fontSize: "18px", marginBottom: "8px" }}>
                    Drop video here or click to browse
                  </p>
                  <p style={{ color: "#64748b", fontSize: "14px" }}>
                    Supports MP4, MOV, AVI • Max 100MB • 10-60 seconds recommended
                  </p>
                </div>

                <div style={{ 
                  backgroundColor: "#0f172a", 
                  padding: "20px", 
                  borderRadius: "8px",
                  border: "1px solid #334155"
                }}>
                  <h3 style={{ color: "#facc15", fontSize: "16px", marginBottom: "12px" }}>
                    📋 Tips for Best Results:
                  </h3>
                  <ul style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.8", paddingLeft: "24px" }}>
                    <li>Use sideline or elevated camera angle</li>
                    <li>Good lighting conditions</li>
                    <li>720p or higher resolution</li>
                    <li>Clear view of the field</li>
                    <li>10-30 seconds works best</li>
                  </ul>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  style={{ display: "none" }}
                />
              </>
            ) : (
              <>
                <div style={{ marginBottom: "24px" }}>
                  {/* Compact video preview - small thumbnail */}
                  <div style={{
                    backgroundColor: "#0f172a",
                    padding: "20px",
                    borderRadius: "8px",
                    border: "2px solid #334155"
                  }}>
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center",
                      gap: "16px",
                      marginBottom: "16px"
                    }}>
                      <div style={{ 
                        fontSize: "48px",
                        flexShrink: 0
                      }}>
                        🎥
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          color: "#facc15",
                          fontSize: "16px",
                          fontWeight: "bold",
                          marginBottom: "4px",
                          wordBreak: "break-word"
                        }}>
                          {selectedFile.name}
                        </div>
                        <div style={{ 
                          color: "#94a3b8",
                          fontSize: "14px"
                        }}>
                          📊 {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                    </div>

                    {/* Small preview video */}
                    <video
                      src={videoPreview || ""}
                      controls
                      style={{
                        width: "100%",
                        maxHeight: "200px",
                        borderRadius: "6px",
                        backgroundColor: "#000",
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setVideoPreview(null);
                    }}
                    style={{
                      flex: 1,
                      padding: "14px",
                      backgroundColor: "#334155",
                      color: "#f9fafb",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "16px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    Choose Different Video
                  </button>
                  <button
                    onClick={handleProcess}
                    style={{
                      flex: 1,
                      padding: "14px",
                      backgroundColor: "#facc15",
                      color: "#020617",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "16px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    🚀 Process Video
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

