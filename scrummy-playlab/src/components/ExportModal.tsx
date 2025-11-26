import React from "react";

interface ExportModalProps {
  isOpen: boolean;
  isExporting: boolean;
  progress: number;
  onClose: () => void;
  onExportGIF: () => void;
  onExportVideo: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  isExporting,
  progress,
  onClose,
  onExportGIF,
  onExportVideo,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
      }}
      onClick={!isExporting ? onClose : undefined}
    >
      <div
        style={{
          backgroundColor: "#1e293b",
          padding: "40px",
          borderRadius: "12px",
          maxWidth: "500px",
          width: "90%",
          border: "2px solid #334155",
          textAlign: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {isExporting ? (
          <>
            <h2 style={{ color: "#facc15", marginBottom: "24px" }}>
              Exporting Animation...
            </h2>
            <div
              style={{
                width: "100%",
                height: "40px",
                backgroundColor: "#0f172a",
                borderRadius: "20px",
                overflow: "hidden",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  backgroundColor: "#facc15",
                  transition: "width 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ color: "#020617", fontWeight: "bold" }}>
                  {progress}%
                </span>
              </div>
            </div>
            <p style={{ color: "#94a3b8" }}>Please wait...</p>
          </>
        ) : (
          <>
            <h2 style={{ color: "#facc15", marginBottom: "24px" }}>
              Export Animation
            </h2>
            <p style={{ color: "#cbd5e1", marginBottom: "32px" }}>
              Choose your export format:
            </p>
            
            <button
              onClick={onExportVideo}
              style={{
                width: "100%",
                padding: "16px",
                backgroundColor: "#facc15",
                color: "#020617",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                marginBottom: "12px",
              }}
            >
              🎬 Export as Video (WebM)
            </button>

            <button
              onClick={onExportGIF}
              style={{
                width: "100%",
                padding: "16px",
                backgroundColor: "#334155",
                color: "#f9fafb",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                marginBottom: "24px",
              }}
            >
              🎞️ Export as GIF
            </button>

            <button
              onClick={onClose}
              style={{
                padding: "12px 24px",
                backgroundColor: "transparent",
                color: "#94a3b8",
                border: "1px solid #475569",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

