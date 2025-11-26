import React from "react";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNew: () => void;
  onSave: () => void;
  onLoad: () => void;
  onExport: () => void;
  autoSave: boolean;
  onAutoSaveToggle: () => void;
  onTutorial?: () => void;
}

export const SideMenu: React.FC<SideMenuProps> = ({
  isOpen,
  onClose,
  onNew,
  onSave,
  onLoad,
  onExport,
  autoSave,
  onAutoSaveToggle,
  onTutorial,
}) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 998,
          }}
          onClick={onClose}
        />
      )}

      {/* Menu */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: isOpen ? 0 : "-250px",
          height: "100vh",
          width: "250px",
          backgroundColor: "#0f172a",
          transition: "left 0.3s ease",
          zIndex: 999,
          boxShadow: "4px 0 8px rgba(0, 0, 0, 0.3)",
          display: "flex",
          flexDirection: "column",
          padding: "20px",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            alignSelf: "flex-end",
            background: "none",
            border: "none",
            color: "#f9fafb",
            fontSize: "40px",
            cursor: "pointer",
            padding: 0,
            marginBottom: "20px",
          }}
        >
          ×
        </button>

        {/* Menu items */}
        <button onClick={onNew} className="side-menu-button">
          <span style={{ marginRight: "12px" }}>📄</span>
          New
        </button>

        <button onClick={onSave} className="side-menu-button">
          <span style={{ marginRight: "12px" }}>💾</span>
          Save
        </button>

        <button onClick={onLoad} className="side-menu-button">
          <span style={{ marginRight: "12px" }}>📂</span>
          Load
        </button>

        <button onClick={onExport} className="side-menu-button">
          <span style={{ marginRight: "12px" }}>🎬</span>
          Export Video
        </button>

        <div style={{ height: "2px", backgroundColor: "#334155", margin: "20px 0" }} />

        {/* Auto-save toggle */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            color: "#cbd5e1",
          }}
        >
          <span>Autosave</span>
          <label style={{ position: "relative", display: "inline-block", width: "48px", height: "26px" }}>
            <input
              type="checkbox"
              checked={autoSave}
              onChange={onAutoSaveToggle}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span
              style={{
                position: "absolute",
                cursor: "pointer",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: autoSave ? "#facc15" : "#475569",
                transition: "0.3s",
                borderRadius: "26px",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  content: "",
                  height: "20px",
                  width: "20px",
                  left: autoSave ? "25px" : "3px",
                  bottom: "3px",
                  backgroundColor: "white",
                  transition: "0.3s",
                  borderRadius: "50%",
                }}
              />
            </span>
          </label>
        </div>

        {onTutorial && (
          <button onClick={onTutorial} className="side-menu-button" style={{ marginTop: "20px" }}>
            <span style={{ marginRight: "12px" }}>🎓</span>
            Tutorial
          </button>
        )}

        {/* Logo */}
        <div style={{ marginTop: "auto", textAlign: "center", opacity: 0.3 }}>
          <div style={{ color: "#facc15", fontSize: "24px", fontWeight: "bold" }}>
            Scrummy
          </div>
          <div style={{ color: "#94a3b8", fontSize: "12px" }}>PlayLab</div>
        </div>
      </div>

      <style>
        {`
          .side-menu-button {
            width: 100%;
            padding: 14px 16px;
            margin-bottom: 8px;
            background-color: #1e293b;
            color: #f9fafb;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            text-align: left;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .side-menu-button:hover {
            background-color: #334155;
            transform: translateX(4px);
          }
        `}
      </style>
    </>
  );
};

