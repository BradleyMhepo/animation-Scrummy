# Scrummy PlayLab - Quick Start Guide

## 🚀 Getting Started (1 Minute)

```bash
cd "/Users/b-rad/Desktop/animation Scrummy/scrummy-playlab"
pnpm dev
```

Open `http://localhost:5173` in your browser.

## 📖 5-Minute Tutorial

### Step 1: Select a Play (10 seconds)
- Click "Switch Move - Left Channel" in the left panel
- You'll see the play details appear below

### Step 2: Watch the Animation (10 seconds)
- Click the **▶ Play** button at the bottom
- Watch the players move across the field
- Yellow dots = Home team (attacking)
- White dots = Away team (defending)

### Step 3: Add Annotations (2 minutes)
1. Click **✏️ Draw** button in the top-right
2. Drawing toolbar appears at the top
3. Click the **Arrow** tool (➡️)
4. Draw on the field to show player movement
5. Click **T Text** to add labels
6. Type "Switch angle here" and place it on the field
7. Click **↶ Undo** to remove last drawing

### Step 4: Customize the View (1 minute)
1. Click **✏️ Edit Layout**
2. Try the **Zoom** slider (50% - 200%)
3. Change **Player Size** (small/medium/large)
4. Click **🔄 Rotate** to flip the field
5. Click **🎯 Recenter** to reset

### Step 5: Export Your Work (1 minute)
1. Click **☰ Menu** (top-right)
2. Click **🎬 Export Video**
3. Choose **Export as Video (WebM)** or **Export as GIF**
4. Wait for export (shows progress)
5. Video downloads automatically!

## 🎨 Common Workflows

### Creating a Play Breakdown Video

```
1. Select play → 2. Add arrows showing movement → 
3. Add text labels for key moments → 4. Export to video → 
5. Add voiceover in editing software → 6. Share!
```

### Analyzing Defensive Patterns

```
1. Select play → 2. Use circles to highlight defensive holes → 
3. Use boxes to mark defensive structures → 
4. Add text to label defender numbers → 5. Save as JSON
```

### Creating Social Media Content

```
1. Select play → 2. Keep annotations minimal → 
3. Export as GIF → 4. Post to Twitter/Instagram → 
5. Scrummy watermark included!
```

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play/Pause animation |
| `R` | Restart animation |
| `D` | Toggle drawing mode |
| `Esc` | Close open modal/toolbar |
| `←` / `→` | Scrub timeline (when slider focused) |

## 🎯 Pro Tips

### Pitch Design
- The field has **realistic grass stripes** for professional look
- **22m lines** are dashed (standard rugby marking)
- **Halfway line** is solid (divides field)
- **Watermark** auto-applies to all exports

### Drawing Tips
- **Arrows**: Best for showing player movement direction
- **Circles**: Highlight key areas or decision points
- **Text**: Label players, formations, or key moments
- **Colors**: Use yellow/white to match team colors

### Performance Tips
- Keep plays under **60 seconds** for smooth export
- Limit to **30 players max** for best performance
- Use **Video (WebM)** for high quality + small file size
- Use **GIF** for social media (larger file size)

### File Management
- **Save frequently** (Menu → Save)
- **Use descriptive IDs** in JSON (e.g., "u16_switch_left")
- **Enable auto-save** for automatic keyframe saving
- **Drag & drop** JSON files directly onto the page to load

## 🔧 Customization Guide

### Changing Team Colors

Edit your play JSON:
```json
{
  "players": [
    {
      "id": "p10",
      "color": "#facc15"  ← Change this to any hex color
    }
  ]
}
```

Available preset colors:
- `#d13131` - Red
- `#223fc8` - Blue
- `#006c04` - Green
- `#eded1e` - Yellow
- `#202020` - Black
- `#ebebeb` - White
- `#ff9000` - Orange
- `#ae5f00` - Brown

### Creating New Plays

1. Copy `src/data/switch_move.json`
2. Rename to your play name (e.g., `crash_ball_right.json`)
3. Edit the JSON:
   - Change `id`, `name`, `description`
   - Update `players` array
   - Edit `keyframes` (positions at different times)
4. Import in `App.tsx`:
   ```typescript
   import newPlay from "./data/crash_ball_right.json";
   const initialPlays = [..., newPlay as Play];
   ```

### Play JSON Structure

```json
{
  "id": "unique_id",
  "name": "Display Name",
  "description": "What happens in this play",
  "durationMs": 5000,  // 5 seconds
  "field": {
    "length": 100,  // meters
    "width": 70     // meters
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
      "timeMs": 0,  // Start position
      "positions": {
        "p10": { "x": 35, "y": 30 }
      }
    },
    {
      "timeMs": 5000,  // End position
      "positions": {
        "p10": { "x": 60, "y": 35 }
      }
    }
  ]
}
```

## 🐛 Troubleshooting

### Drawing not working?
- Make sure Drawing Mode is ON (✏️ Draw button should be yellow)
- Check that a drawing tool is selected in the toolbar

### Export stuck at 0%?
- Make sure the animation has played at least once
- Try exporting as Video instead of GIF (GIF is slower)
- Check browser console for errors

### Players not showing?
- Verify JSON structure matches the format above
- Check that player IDs in keyframes match player IDs in players array
- Ensure positions are within field bounds (0-100, 0-70)

### File won't load?
- Verify it's valid JSON (use jsonlint.com)
- Check file extension is `.json`
- Make sure it has all required fields (id, name, durationMs, etc.)

## 📚 Additional Resources

- **README.md** - Full feature documentation
- **FEATURES.md** - Detailed feature comparison with AnimationSlate
- **Sample Plays** - `src/data/` folder has examples

## 🆘 Need Help?

Common questions:

**Q: Can I create plays from scratch without JSON?**
A: Not yet - this is a planned feature. For now, copy and edit an existing JSON file.

**Q: Can I add more than 2 teams?**
A: Currently limited to home/away. Multi-team support is a future enhancement.

**Q: Can I export to MP4?**
A: Use WebM format, which works on all modern platforms. Convert to MP4 in post if needed.

**Q: How do I add more keyframes?**
A: Edit the JSON file and add more entries to the `keyframes` array with different `timeMs` values.

**Q: Can I share plays online?**
A: Export to video/GIF and share anywhere. URL sharing is a planned feature.

---

**Ready to create amazing rugby content!** 🏉✨

Start with the sample plays, add your annotations, and export to share with your team.

