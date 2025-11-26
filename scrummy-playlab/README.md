# Scrummy PlayLab 🏉

**Rugby Play Animator** - Create, animate, and share rugby plays with ease.

## 🎬 NEW! AI-Powered Video Processing

**Upload rugby gameplay videos → AI automatically generates animated plays!**

- 🤖 **TensorFlow.js AI** detects players automatically
- 📹 **Video Upload** with drag & drop support
- 🎯 **Smart Tracking** follows players across frames
- 🏷️ **Interactive Labeling** to assign jersey numbers
- ⚡ **One-Click Generation** creates complete plays
- 🚀 **No Backend Required** - all processing in your browser!

[**Read the full Video Feature Guide →**](VIDEO_FEATURE.md)

## Features

### Animation & Playback
- 🎬 **Smooth Animation**: Interpolation between keyframes with player path tracking
- 🎮 **Interactive Controls**: Play, pause, restart, and timeline scrubbing
- ⏱️ **Variable Speed**: 0.5x to 3x playback speed control
- 📊 **Professional Pitch**: Realistic rugby field with grass stripes, 22m lines, and proper markings

### Drawing & Annotation Tools
- ✏️ **Sketch Tool**: Freehand drawing
- 📏 **Line Tool**: Straight lines
- ➡️ **Arrow Tool**: Directional arrows for play design
- ⬜ **Box Tool**: Rectangle shapes
- ⭕ **Circle Tool**: Circle shapes
- 📝 **Text Annotations**: Multiple sizes and colors
- ↶ **Undo System**: Remove unwanted drawings

### Field Customization
- 🔍 **Zoom & Pan**: Navigate the field easily
- 🔄 **Rotate View**: Landscape/portrait orientation
- 📐 **Pitch Types**: Union, League, Grid layouts
- 👥 **Player Sizes**: Small, medium, large options
- 🎯 **Recenter**: Quick reset to default view

### Player Management
- 🎨 **8 Color Options**: Customize team colors
- 🔢 **Jersey Numbers**: Edit player numbers
- ➖ **Path Lines**: Toggle movement lines on/off
- ✏️ **Edit Players**: Click to edit individual players
- 🗑️ **Delete Players**: Remove players from plays

### File Management
- 💾 **Save to JSON**: Export plays with all settings
- 📂 **Load from JSON**: Import plays with drag & drop support
- 🔄 **Auto-save**: Optional automatic keyframe saving
- 📁 **Play Library**: Manage multiple plays

### Export & Sharing
- 🎬 **Export to Video**: High-quality WebM format
- 🎞️ **Export to GIF**: Shareable animated GIFs
- 📹 **Progress Tracking**: Visual export progress
- 🎨 **Watermarked**: Scrummy branding included

### UI/UX
- 🎨 **Scrummy Branding**: Navy + neon yellow aesthetic
- 📱 **Responsive Design**: Works on desktop and mobile
- 🌓 **Dark Theme**: Eye-friendly dark interface
- 🎓 **Tutorial System**: (Ready for implementation)

## Quick Start

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
```

Visit `http://localhost:5173` to see the app in action!

## Project Structure

```
src/
├── components/
│   ├── PlayCanvas.tsx       # Canvas renderer with animation
│   ├── PlayList.tsx         # Play selection list
│   ├── PlayDetails.tsx      # Play metadata display
│   └── Controls.tsx         # Play/pause/restart controls
├── hooks/
│   └── usePlayPlayer.ts     # Animation state management
├── types/
│   └── play.ts             # TypeScript interfaces
├── data/
│   ├── switch_move.json    # Sample play: Switch move
│   └── crash_ball.json     # Sample play: Crash ball
├── App.tsx                 # Main application
└── main.tsx               # Entry point
```

## Adding New Plays

Create a new JSON file in `src/data/` following this structure:

```json
{
  "id": "my_play",
  "name": "My Play Name",
  "description": "What happens in this play",
  "durationMs": 5000,
  "field": {
    "length": 100,
    "width": 70
  },
  "players": [
    {
      "id": "p10",
      "name": "Fly Half",
      "team": "home",
      "number": 10,
      "color": "#facc15"
    }
  ],
  "keyframes": [
    {
      "timeMs": 0,
      "positions": {
        "p10": { "x": 35, "y": 30 }
      }
    }
  ]
}
```

Then import it in `App.tsx` and add to the `plays` array.

## Tech Stack

- **React 19** with TypeScript
- **Vite** for build tooling
- **HTML5 Canvas** for rendering
- **gif.js** for GIF export
- **MediaRecorder API** for video export
- **pnpm** for package management

## Branding Colors

- **Background**: `#020617` (Deep Navy)
- **Accent**: `#facc15` (Neon Yellow)
- **Pitch Green**: `#16a34a`
- **Text**: `#f9fafb` (Off-white)

## Usage Guide

### Basic Workflow

1. **Select a Play** - Choose from the play library on the left
2. **Customize Field** - Use "Edit Layout" to adjust zoom, pitch type, player size
3. **Annotate** - Click "Draw" to add arrows, text, shapes to explain the play
4. **Playback** - Adjust speed, play/pause, scrub through the timeline
5. **Export** - Save as JSON for later, or export as video/GIF for sharing

### Keyboard Shortcuts

- **Space**: Play/Pause
- **R**: Restart
- **D**: Toggle drawing mode
- **Esc**: Close modals/toolbars
- **Ctrl+S**: Save (if implemented)
- **Ctrl+Z**: Undo last drawing

### Drawing Tips

- Use **arrows** to show player movement direction
- Add **text** to label key moments
- Use **circles** to highlight important areas
- Draw **boxes** around defensive structures
- Change **colors** to differentiate attacking vs defensive notes

### Export Tips

- **Video (WebM)** is best for high quality and small file size
- **GIF** is best for social media and easy sharing
- Exports capture the entire animation with all drawings
- Watermark is automatically included

## Next Steps

### Future Enhancements
- [x] Variable play speed (0.5x - 3x)
- [x] Export play JSON to file
- [ ] Play editor mode (create plays from scratch)
- [ ] Multiple camera angles
- [ ] Formation templates library
- [ ] Share plays via URL
- [ ] Team management (save team rosters)
- [ ] Collaborative editing
- [ ] Cloud storage integration
- [ ] Mobile app version

## Recording Plays

To create videos:
1. Select a play
2. Hit Play
3. Use screen recording (QuickTime, OBS, etc.)
4. Add voiceover for play breakdowns
5. Share on social media with Scrummy branding intact!

---

Built with ❤️ for rugby coaches and players worldwide.
