import { useState, useRef, useEffect } from "react";
import { PlayCanvas } from "./components/PlayCanvas";
import { PlayList } from "./components/PlayList";
import { PlayDetails } from "./components/PlayDetails";
import { Controls } from "./components/Controls";
import { DrawingCanvas } from "./components/DrawingCanvas";
import { DrawingToolbar } from "./components/DrawingToolbar";
import { PathDrawingCanvas } from "./components/PathDrawingCanvas";
import { PlayerPathToolbar } from "./components/PlayerPathToolbar";
import { BallTool } from "./components/BallTool";
import { BallPlacementCanvas } from "./components/BallPlacementCanvas";
import { TextModal } from "./components/TextModal";
import { SideMenu } from "./components/SideMenu";
import { FileDropZone } from "./components/FileDropZone";
import { ExportModal } from "./components/ExportModal";
import { FieldControls } from "./components/FieldControls";
import { PlayerEditModal } from "./components/PlayerEditModal";
import { SpeedControls } from "./components/SpeedControls";
import { VideoUploadModal } from "./components/VideoUploadModal";
import { PlayerLabelingModal } from "./components/PlayerLabelingModal";
import { usePlayPlayer } from "./hooks/usePlayPlayer";
import { savePlayToFile, loadPlayFromFile } from "./utils/fileHandling";
import { recordCanvasToVideo, captureCanvasFrames, downloadBlob } from "./utils/exportVideo";
import { videoProcessor } from "./utils/videoProcessor";
import type { Play, Player } from "./types/play";
import type { Drawing, DrawingType } from "./types/drawing";
import type { ProcessingProgress, VideoFrame, TrackedPlayer, FieldCalibration } from "./types/video";
import type { PlayerPath } from "./types/path";
import { generatePlayFromPaths } from "./utils/pathToPlay";

// Import play data
import switchMoveData from "./data/switch_move.json";
import crashBallData from "./data/crash_ball.json";

const initialPlays: Play[] = [switchMoveData as Play, crashBallData as Play];

function App() {
  const [plays, setPlays] = useState<Play[]>(initialPlays);
  const [selectedPlayId, setSelectedPlayId] = useState<string | null>(plays[0]?.id || null);
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [autoSave, setAutoSave] = useState(true);
  
  // UI state
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [isPathMode, setIsPathMode] = useState(false);
  const [isBallMode, setIsBallMode] = useState(false);
  const [playerPaths, setPlayerPaths] = useState<PlayerPath[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [balls, setBalls] = useState<Array<{ id: string; x: number; y: number; color: string; number?: number }>>([]);
  const [selectedBallId, setSelectedBallId] = useState<string | null>(null);
  const [ballColor, setBallColor] = useState("#facc15");
  const [ballNumber, setBallNumber] = useState<number | undefined>(undefined);
  const [currentDrawingType, setCurrentDrawingType] = useState<DrawingType>("sketch");
  const [currentDrawingColor, setCurrentDrawingColor] = useState("#facc15");
  const [textModalOpen, setTextModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [fieldControlsOpen, setFieldControlsOpen] = useState(false);
  const [speedControlsOpen, setSpeedControlsOpen] = useState(false);
  const [playerEditModalOpen, setPlayerEditModalOpen] = useState(false);
  const [selectedPlayer] = useState<Player | null>(null);
  
  // Video processing state
  const [videoUploadModalOpen, setVideoUploadModalOpen] = useState(false);
  const [isProcessingVideo, setIsProcessingVideo] = useState(false);
  const [videoProcessingProgress, setVideoProcessingProgress] = useState<ProcessingProgress | null>(null);
  const [videoFrames, setVideoFrames] = useState<VideoFrame[]>([]);
  const [trackedPlayers, setTrackedPlayers] = useState<TrackedPlayer[]>([]);
  const [playerLabelingModalOpen, setPlayerLabelingModalOpen] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  
  // Field state
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isLandscape, setIsLandscape] = useState(true);
  const [playerSize, setPlayerSize] = useState(1);
  const [showLines] = useState(true);
  const [pitchType, setPitchType] = useState<"union" | "league" | "grid">("union");
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const selectedPlay = plays.find((p) => p.id === selectedPlayId) || null;
  const { isPlaying, currentTimeMs, play, pause, restart, setTime } = usePlayPlayer(selectedPlay);

  // Initialize video processor model
  useEffect(() => {
    const initModel = async () => {
      try {
        await videoProcessor.initialize();
        setIsModelLoaded(true);
        console.log('AI model loaded successfully!');
      } catch (error) {
        console.error('Failed to load AI model:', error);
      }
    };
    initModel();
  }, []);

  // Adjust playback speed
  useEffect(() => {
    if (playbackSpeed !== 1 && selectedPlay) {
      // This would need to be integrated into usePlayPlayer hook
      // For now, it's a placeholder
    }
  }, [playbackSpeed]);

  const handleDrawingsChange = (newDrawings: Drawing[]) => {
    setDrawings(newDrawings);
    if (autoSave) {
      // Auto-save logic here
    }
  };

  const handleUndoDrawing = () => {
    if (drawings.length > 0) {
      setDrawings(drawings.slice(0, -1));
    }
  };

  const handleAddText = (text: string, color: string, fontSize: number) => {
    // Text will be added on next click on canvas
    const newDrawing: Drawing = {
      id: Date.now().toString(),
      type: "text",
      color,
      points: [{ x: 450, y: 300 }], // Center of canvas
      text,
      fontSize,
    };
    setDrawings([...drawings, newDrawing]);
  };

  const handleSaveFile = () => {
    if (selectedPlay) {
      savePlayToFile(selectedPlay, drawings);
    }
  };

  const handleLoadFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const play = await loadPlayFromFile(file);
        setPlays([...plays, play]);
        setSelectedPlayId(play.id);
      } catch (error) {
        alert("Failed to load file");
      }
    }
  };

  const handleExportVideo = async () => {
    if (!selectedPlay) return;
    
    setIsExporting(true);
    setExportProgress(0);

    try {
      // Play the animation and record it
      restart();
      
      // Wait a bit for animation to start
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = document.querySelector('canvas') as HTMLCanvasElement;
      if (!canvas) throw new Error("Canvas not found");

      const blob = await recordCanvasToVideo(canvas, selectedPlay.durationMs, 30);
      downloadBlob(blob, `${selectedPlay.id}_${Date.now()}.webm`);
      
      setExportProgress(100);
      setTimeout(() => {
        setIsExporting(false);
        setExportModalOpen(false);
      }, 1000);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export video");
      setIsExporting(false);
    }
  };

  const handleExportGIF = async () => {
    if (!selectedPlay) return;
    
    setIsExporting(true);
    setExportProgress(0);

    try {
      const canvas = document.querySelector('canvas') as HTMLCanvasElement;
      if (!canvas) throw new Error("Canvas not found");

      const blob = await captureCanvasFrames(
        canvas, 
        selectedPlay.durationMs, 
        20, 
        (progress) => setExportProgress(progress)
      );
      
      downloadBlob(blob, `${selectedPlay.id}_${Date.now()}.gif`);
      
      setTimeout(() => {
        setIsExporting(false);
        setExportModalOpen(false);
      }, 1000);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export GIF");
      setIsExporting(false);
    }
  };

  const handleRecenter = () => {
    setOffsetX(0);
    setOffsetY(0);
    setZoom(1);
  };

  const handleRotate = () => {
    setIsLandscape(!isLandscape);
  };

  const handlePlayerSave = (updatedPlayer: Player) => {
    if (selectedPlay) {
      const updatedPlayers = selectedPlay.players.map(p => 
        p.id === updatedPlayer.id ? updatedPlayer : p
      );
      const updatedPlay = { ...selectedPlay, players: updatedPlayers };
      setPlays(plays.map(p => p.id === updatedPlay.id ? updatedPlay : p));
    }
  };

  const handlePlayerDelete = () => {
    if (selectedPlay && selectedPlayer) {
      const updatedPlayers = selectedPlay.players.filter(p => p.id !== selectedPlayer.id);
      const updatedPlay = { ...selectedPlay, players: updatedPlayers };
      setPlays(plays.map(p => p.id === updatedPlay.id ? updatedPlay : p));
    }
  };

  // Video processing functions
  const handleVideoSelect = async (file: File) => {
    if (!isModelLoaded) {
      alert('AI model is still loading. Please wait a few seconds and try again.');
      return;
    }

    setIsProcessingVideo(true);
    setVideoProcessingProgress({ stage: 'loading', progress: 0, message: 'Starting...' });
    
    try {
      console.log('Starting video processing for:', file.name);
      
      // Process video
      const frames = await videoProcessor.processVideo(file, (progress) => {
        console.log('Progress:', progress);
        setVideoProcessingProgress(progress);
      });

      console.log('Frames extracted:', frames.length);
      console.log('Sample frame:', frames[0]);

      if (frames.length === 0) {
        throw new Error('No frames extracted from video');
      }

      setVideoFrames(frames);

      // Track players across frames
      console.log('Tracking players...');
      const tracks = videoProcessor.trackPlayers(frames);
      console.log('Players tracked:', tracks.length);
      console.log('Sample tracks:', tracks);

      if (tracks.length === 0) {
        alert('No players detected in video. Try:\n- Better lighting\n- Sideline camera angle\n- Clearer view of players');
        setIsProcessingVideo(false);
        return;
      }

      setTrackedPlayers(tracks);

      // Switch to labeling modal
      console.log('Opening labeling modal...');
      setIsProcessingVideo(false);
      setVideoUploadModalOpen(false);
      setPlayerLabelingModalOpen(true);

    } catch (error) {
      console.error('Video processing failed:', error);
      alert(`Failed to process video: ${error instanceof Error ? error.message : 'Unknown error'}\n\nCheck browser console for details.`);
      setIsProcessingVideo(false);
      setVideoProcessingProgress(null);
    }
  };

  const handlePlayerLabeling = (labeledTracks: TrackedPlayer[]) => {
    console.log('Generating play from', labeledTracks.length, 'labeled tracks');

    if (labeledTracks.length === 0) {
      alert('No players to generate play from. Please label at least one player.');
      return;
    }

    try {
      // Create field calibration (default for now)
      const calibration: FieldCalibration = {
        topLeft: { x: 0, y: 0 },
        topRight: { x: 100, y: 0 },
        bottomLeft: { x: 0, y: 70 },
        bottomRight: { x: 100, y: 70 },
        fieldLength: 100,
        fieldWidth: 70
      };

      // Transform coordinates (simplified - video coords to field coords)
      const videoWidth = videoFrames[0]?.imageData.width || 1920;
      const videoHeight = videoFrames[0]?.imageData.height || 1080;
      console.log('Video dimensions:', videoWidth, 'x', videoHeight);

      const transformedTracks = videoProcessor.transformToFieldCoordinates(
        labeledTracks,
        calibration,
        videoWidth,
        videoHeight
      );

      console.log('Transformed tracks:', transformedTracks);

      // Generate play
      const durationMs = videoFrames[videoFrames.length - 1]?.timestamp * 1000 || 10000;
      console.log('Play duration:', durationMs, 'ms');

      const newPlay = videoProcessor.generatePlayFromTracks(
        transformedTracks,
        new File([], "video_play"),
        durationMs
      );

      console.log('Generated play:', newPlay);
      console.log('Players:', newPlay.players.length);
      console.log('Keyframes:', newPlay.keyframes.length);

      // Add to plays list
      setPlays([...plays, newPlay]);
      setSelectedPlayId(newPlay.id);
      setPlayerLabelingModalOpen(false);

      // Show success message
      alert(`Play generated successfully!\n\n${newPlay.players.length} players\n${newPlay.keyframes.length} keyframes\n\nPlay is now selected in your play list.`);

      // Clear video data
      setVideoFrames([]);
      setTrackedPlayers([]);
    } catch (error) {
      console.error('Play generation failed:', error);
      alert(`Failed to generate play: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#020617",
        color: "#f9fafb",
        padding: "24px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Header */}
      <header style={{ 
        marginBottom: "32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#facc15",
            padding: "8px 16px",
            backgroundColor: "#1e3a8a",
            borderRadius: "8px",
            border: "2px solid #facc15"
          }}>
            Scrummy
          </div>
          <h1 style={{ 
            fontSize: "32px", 
            fontWeight: "bold",
            margin: 0,
            background: "linear-gradient(135deg, #facc15 0%, #fde047 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            PlayLab
          </h1>
        </div>

        {/* Header buttons */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => setSideMenuOpen(true)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#334155",
              color: "#f9fafb",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            ☰ Menu
          </button>

          <button
            onClick={() => setFieldControlsOpen(!fieldControlsOpen)}
            style={{
              padding: "10px 20px",
              backgroundColor: fieldControlsOpen ? "#facc15" : "#334155",
              color: fieldControlsOpen ? "#020617" : "#f9fafb",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            ✏️ Edit Layout
          </button>

          {/* Video feature hidden for now */}
          {/* <button
            onClick={() => setVideoUploadModalOpen(true)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#10b981",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              opacity: isModelLoaded ? 1 : 0.5,
            }}
            disabled={!isModelLoaded}
            title={!isModelLoaded ? "Loading AI model..." : "Upload video and auto-generate play"}
          >
            🎬 Upload Video {!isModelLoaded && "⏳"}
          </button> */}

          <button
            onClick={() => {
              const wasPathMode = isPathMode;
              setIsPathMode(!isPathMode);
              setIsDrawingMode(false);
              setIsBallMode(false);
              
              // Clear paths when exiting animate mode
              if (wasPathMode) {
                setPlayerPaths([]);
                setSelectedPlayerId(null);
              }
            }}
            style={{
              padding: "10px 20px",
              backgroundColor: isPathMode ? "#facc15" : "#334155",
              color: isPathMode ? "#020617" : "#f9fafb",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            🎬 Animate
          </button>

          <button
            onClick={() => {
              setIsBallMode(!isBallMode);
              setIsPathMode(false);
              setIsDrawingMode(false);
            }}
            style={{
              padding: "10px 20px",
              backgroundColor: isBallMode ? "#facc15" : "#334155",
              color: isBallMode ? "#020617" : "#f9fafb",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            ⚽ Ball
          </button>

          <button
            onClick={() => {
              setIsDrawingMode(!isDrawingMode);
              setIsPathMode(false);
              setIsBallMode(false);
            }}
            style={{
              padding: "10px 20px",
              backgroundColor: isDrawingMode ? "#facc15" : "#334155",
              color: isDrawingMode ? "#020617" : "#f9fafb",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            ✏️ Annotate
          </button>

          <button
            onClick={() => setSpeedControlsOpen(!speedControlsOpen)}
            style={{
              padding: "10px 20px",
              backgroundColor: speedControlsOpen ? "#facc15" : "#334155",
              color: speedControlsOpen ? "#020617" : "#f9fafb",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            ⏱️ Speed
          </button>
        </div>
      </header>

      {/* Toolbars */}
      <PlayerPathToolbar
        isActive={isPathMode}
        playerPaths={playerPaths}
        selectedPlayerId={selectedPlayerId}
        currentColor={currentDrawingColor}
        balls={balls}
        selectedBallId={selectedBallId}
        onClose={() => {
          setIsPathMode(false);
          setSelectedBallId(null);
        }}
        onColorChange={setCurrentDrawingColor}
        onPlayerSelect={setSelectedPlayerId}
        onPlayerNumberChange={(playerId, number) => {
          setPlayerPaths(
            playerPaths.map((p) =>
              p.playerId === playerId ? { ...p, number } : p
            )
          );
        }}
        onPlayerDelete={(playerId) => {
          setPlayerPaths(playerPaths.filter((p) => p.playerId !== playerId));
          if (selectedPlayerId === playerId) {
            setSelectedPlayerId(null);
          }
        }}
        onGeneratePlay={() => {
          if (playerPaths.length === 0) {
            alert("Please draw at least one path (player or ball)!");
            return;
          }
          const newPlay = generatePlayFromPaths(playerPaths, 10000, balls);
          setPlays([...plays, newPlay]);
          setSelectedPlayId(newPlay.id);
          setIsPathMode(false);
          // Clear paths after generating play (but keep balls!)
          setPlayerPaths([]);
          setSelectedPlayerId(null);
          setSelectedBallId(null);
          // Clear drawings too
          setDrawings([]);
          // Keep balls - they stay on field!
          alert(`Play created with ${newPlay.players.length} players!`);
        }}
      />

      <BallTool
        isActive={isBallMode}
        balls={balls}
        selectedBallId={selectedBallId}
        currentColor={ballColor}
        currentNumber={ballNumber}
        onColorChange={setBallColor}
        onNumberChange={setBallNumber}
        onBallSelect={setSelectedBallId}
        onBallDelete={(ballId) => {
          setBalls(balls.filter((b) => b.id !== ballId));
          if (selectedBallId === ballId) {
            setSelectedBallId(null);
          }
        }}
      />

      <DrawingToolbar
        isActive={isDrawingMode}
        currentType={currentDrawingType}
        currentColor={currentDrawingColor}
        onClose={() => setIsDrawingMode(false)}
        onTypeChange={setCurrentDrawingType}
        onColorChange={setCurrentDrawingColor}
        onUndo={handleUndoDrawing}
        onAddText={() => setTextModalOpen(true)}
      />

      <FieldControls
        isOpen={fieldControlsOpen}
        zoom={zoom}
        playerSize={playerSize}
        pitchType={pitchType}
        onClose={() => setFieldControlsOpen(false)}
        onZoomChange={setZoom}
        onPlayerSizeChange={setPlayerSize}
        onPitchTypeChange={setPitchType}
        onRecenter={handleRecenter}
        onRotate={handleRotate}
        onEditField={() => {}}
      />

      <SpeedControls
        isOpen={speedControlsOpen}
        globalSpeed={playbackSpeed}
        onClose={() => setSpeedControlsOpen(false)}
        onSpeedChange={setPlaybackSpeed}
      />

      {/* Main Content */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(300px, 1fr) 2fr",
          gap: "24px",
          maxWidth: "1600px",
          margin: "0 auto",
        }}
      >
        {/* Left Panel */}
        <div>
          <PlayList
            plays={plays}
            selectedPlayId={selectedPlayId}
            onSelectPlay={setSelectedPlayId}
          />
          
          {selectedPlay && (
            <>
              <PlayDetails play={selectedPlay} />
              <Controls
                isPlaying={isPlaying}
                currentTimeMs={currentTimeMs}
                durationMs={selectedPlay.durationMs}
                onPlay={play}
                onPause={pause}
                onRestart={restart}
                onSeek={setTime}
              />
            </>
          )}
        </div>

        {/* Right Panel - Canvas */}
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "flex-start",
          position: "relative"
        }}>
          {selectedPlay && !isPathMode ? (
            <div style={{ position: "relative" }}>
              <PlayCanvas 
                play={selectedPlay} 
                currentTimeMs={currentTimeMs}
                zoom={zoom}
                offsetX={offsetX}
                offsetY={offsetY}
                isLandscape={isLandscape}
                playerSize={playerSize}
                showLines={showLines}
                balls={isBallMode ? balls : []} // Only show balls in ball mode
                showStaticBalls={isBallMode} // Only show static balls in ball placement mode
              />
              {isBallMode && (
                <BallPlacementCanvas
                  width={900}
                  height={600}
                  balls={balls}
                  onBallsChange={setBalls}
                  isBallMode={isBallMode}
                  currentColor={ballColor}
                  currentNumber={ballNumber}
                  selectedBallId={selectedBallId}
                  onBallSelect={setSelectedBallId}
                />
              )}
              <DrawingCanvas
                width={900}
                height={600}
                drawings={drawings}
                onDrawingsChange={handleDrawingsChange}
                isDrawingMode={isDrawingMode}
                currentDrawingType={currentDrawingType}
                currentColor={currentDrawingColor}
              />
            </div>
          ) : isPathMode ? (
            <div style={{ position: "relative" }}>
              {/* Empty field for path drawing */}
              <PlayCanvas 
                play={{
                  id: "empty",
                  name: "New Play",
                  durationMs: 10000,
                  field: { length: 100, width: 70 },
                  players: [],
                  keyframes: []
                }}
                currentTimeMs={0}
                zoom={zoom}
                offsetX={offsetX}
                offsetY={offsetY}
                isLandscape={isLandscape}
                playerSize={playerSize}
                showLines={showLines}
                balls={isBallMode ? balls : []} // Only show balls in ball mode
                showStaticBalls={isBallMode || isPathMode} // Show in ball or path mode
              />
              {isPathMode && (
                <PathDrawingCanvas
                  width={900}
                  height={600}
                  playerPaths={playerPaths}
                  onPathsChange={setPlayerPaths}
                  isPathMode={isPathMode}
                  currentColor={currentDrawingColor}
                  selectedPlayerId={selectedPlayerId}
                  onPlayerSelect={setSelectedPlayerId}
                  balls={balls}
                  selectedBallId={selectedBallId}
                  onBallSelect={setSelectedBallId}
                  onPathNumberChange={(pathId, number) => {
                    setPlayerPaths(
                      playerPaths.map((p) =>
                        p.playerId === pathId ? { ...p, number } : p
                      )
                    );
                  }}
                />
              )}
            </div>
          ) : (
            <div style={{ 
              padding: "40px", 
              textAlign: "center", 
              color: "#94a3b8" 
            }}>
              Select a play to begin
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <SideMenu
        isOpen={sideMenuOpen}
        onClose={() => setSideMenuOpen(false)}
        onNew={() => {
          if (confirm("Start a new play? Unsaved changes will be lost.")) {
            setSelectedPlayId(plays[0]?.id || null);
            setDrawings([]);
          }
          setSideMenuOpen(false);
        }}
        onSave={handleSaveFile}
        onLoad={handleLoadFile}
        onExport={() => {
          setExportModalOpen(true);
          setSideMenuOpen(false);
        }}
        autoSave={autoSave}
        onAutoSaveToggle={() => setAutoSave(!autoSave)}
      />

      <FileDropZone
        onFileLoad={(play) => {
          setPlays([...plays, play]);
          setSelectedPlayId(play.id);
        }}
      />

      <TextModal
        isOpen={textModalOpen}
        onClose={() => setTextModalOpen(false)}
        onAdd={handleAddText}
        defaultColor={currentDrawingColor}
      />

      <ExportModal
        isOpen={exportModalOpen}
        isExporting={isExporting}
        progress={exportProgress}
        onClose={() => setExportModalOpen(false)}
        onExportGIF={handleExportGIF}
        onExportVideo={handleExportVideo}
      />

      <PlayerEditModal
        isOpen={playerEditModalOpen}
        player={selectedPlayer}
        onClose={() => setPlayerEditModalOpen(false)}
        onSave={handlePlayerSave}
        onDelete={handlePlayerDelete}
      />

      <VideoUploadModal
        isOpen={videoUploadModalOpen}
        onClose={() => {
          if (!isProcessingVideo) {
            setVideoUploadModalOpen(false);
          }
        }}
        onVideoSelect={handleVideoSelect}
        isProcessing={isProcessingVideo}
        progress={videoProcessingProgress}
      />

      <PlayerLabelingModal
        isOpen={playerLabelingModalOpen}
        tracks={trackedPlayers}
        frames={videoFrames}
        onClose={() => setPlayerLabelingModalOpen(false)}
        onComplete={handlePlayerLabeling}
      />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: "none" }}
        onChange={handleFileSelect}
      />

      {/* Footer */}
      <footer style={{ 
        marginTop: "40px", 
        textAlign: "center", 
        color: "#475569",
        fontSize: "12px"
      }}>
        <p>
          Built with Scrummy PlayLab | Create, animate, and share rugby plays
        </p>
      </footer>
    </div>
  );
}

export default App;
