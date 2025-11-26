import React, { useState } from "react";
import { loadPlayFromFile } from "../utils/fileHandling";
import type { Play } from "../types/play";

interface FileDropZoneProps {
  onFileLoad: (play: Play) => void;
}

export const FileDropZone: React.FC<FileDropZoneProps> = ({ onFileLoad }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const jsonFile = files.find((file) => file.name.endsWith(".json"));

    if (jsonFile) {
      try {
        const play = await loadPlayFromFile(jsonFile);
        onFileLoad(play);
      } catch (error) {
        console.error("Error loading file:", error);
        alert("Failed to load play file. Please check the file format.");
      }
    }
  };

  if (!isDragging) return null;

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
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
        zIndex: 9999,
      }}
    >
      <div
        style={{
          textAlign: "center",
          color: "#facc15",
        }}
      >
        <div style={{ fontSize: "80px", marginBottom: "20px" }}>📁</div>
        <div style={{ fontSize: "32px", fontWeight: "bold" }}>
          Drop To Load The File
        </div>
      </div>
    </div>
  );
};

