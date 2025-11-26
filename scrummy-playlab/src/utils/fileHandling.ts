import type { Play } from "../types/play";

export const savePlayToFile = (play: Play, drawings: any[] = []) => {
  const dataToSave = {
    ...play,
    drawings,
    version: "1.0.0",
    savedAt: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(dataToSave, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${play.id}_${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const loadPlayFromFile = (file: File): Promise<Play> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        resolve(data as Play);
      } catch (error) {
        reject(new Error("Failed to parse JSON file"));
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsText(file);
  });
};

export const exportToJSON = (play: Play, drawings: any[] = []): string => {
  const dataToExport = {
    ...play,
    drawings,
    version: "1.0.0",
    exportedAt: new Date().toISOString(),
  };

  return JSON.stringify(dataToExport, null, 2);
};

