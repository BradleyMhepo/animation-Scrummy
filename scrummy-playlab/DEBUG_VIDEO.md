# 🐛 Debugging Video Processing

## How to Check If It's Working

### Step 1: Open Browser Console

**Chrome/Edge:**
- Press `F12` or `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)
- Click "Console" tab

**Firefox:**
- Press `F12` or `Cmd+Option+K` (Mac) / `Ctrl+Shift+K` (Windows)

### Step 2: Watch the Logs

When you upload a video, you should see:

```
Loading TensorFlow.js model...
Model loaded successfully!
Starting video processing for: your_video.mp4
Video loaded: { duration: 15.2, width: 1920, height: 1080 }
Video info: { duration: 15.2, totalFrames: 30, ... }
Frame 1: Found 8 players
Frame 2: Found 8 players
...
Total frames processed: 30
Total detections: 240
Frames extracted: 30
Tracking players...
Players tracked: 8
Opening labeling modal...
```

### Step 3: Check What Happens

#### ✅ If You See "Players tracked: X" (X > 0)
- **Good!** Players were detected
- Labeling modal should open
- If it doesn't, check for errors below

#### ❌ If You See "Players tracked: 0"
- **Problem:** No players detected
- **Why:** Poor lighting, wrong angle, or video quality
- **Fix:** Try better video (see tips below)

#### ❌ If You See Errors
- **Red text** in console = error
- **Copy the error** and check what it says
- Common errors below

---

## Common Issues & Fixes

### Issue: "Model not initialized"
**Error:** `AI model not initialized. Please wait for model to load.`

**Fix:**
1. Wait 5-10 seconds after page loads
2. Check console for "Model loaded successfully!"
3. Button should change from "⏳" to normal
4. Then try uploading

### Issue: "No frames extracted"
**Error:** `No frames extracted from video`

**Fix:**
1. Video file might be corrupted
2. Try a different video format (MP4 works best)
3. Check video plays in browser first
4. Try shorter video (5-10 seconds)

### Issue: "No players detected"
**Error:** `No players detected in video`

**Fix:**
- **Better lighting** - daytime or bright stadium
- **Sideline angle** - see whole field
- **Higher resolution** - 720p minimum
- **Clearer view** - no obstructions
- **Shorter clip** - 10-15 seconds

### Issue: Processing Stuck
**Progress bar stops moving**

**Fix:**
1. Check console for errors
2. Try shorter video (5-10 seconds)
3. Close other browser tabs (free RAM)
4. Refresh page and try again

### Issue: Labeling Modal Doesn't Open
**Processing completes but nothing happens**

**Fix:**
1. Check console for "Opening labeling modal..."
2. Check for errors after that
3. Try refreshing page
4. Check if modal is behind other elements (z-index issue)

---

## Testing with Console Commands

### Test 1: Check Model Loaded
```javascript
// In browser console, type:
console.log('Model loaded:', window.videoProcessor?.model !== null);
```

### Test 2: Check Video File
```javascript
// After selecting file, check:
console.log('Video file:', document.querySelector('video')?.src);
```

### Test 3: Manual Detection Test
```javascript
// Test detection on a single frame:
const canvas = document.createElement('canvas');
canvas.width = 800;
canvas.height = 600;
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#000';
ctx.fillRect(0, 0, 800, 600);
// Draw something, then:
// await window.videoProcessor.model.detect(canvas);
```

---

## Expected Console Output

### Successful Processing:
```
Loading TensorFlow.js model...
Model loaded successfully!
Starting video processing for: rugby_play.mp4
Video loaded: { duration: 12.5, width: 1920, height: 1080 }
Video info: { duration: 12.5, totalFrames: 25, width: 1920, height: 1080 }
Frame 1: Found 14 players
Frame 2: Found 14 players
Frame 3: Found 15 players
...
Total frames processed: 25
Total detections: 350
Frames extracted: 25
Sample frame: { frameIndex: 0, detectedPlayers: Array(14), ... }
Tracking players...
Players tracked: 14
Sample tracks: [{ trackId: "track_0", detections: Array(20), ... }, ...]
Opening labeling modal...
Labeling modal opened with:
- Tracks: 14
- Frames: 25
- Sample track: { trackId: "track_0", ... }
- Sample frame: { frameIndex: 0, ... }
```

### If No Players Detected:
```
Frame 1: Found 0 players
Frame 2: Found 0 players
...
Total detections: 0
Players tracked: 0
⚠️ No Players Detected modal appears
```

---

## Quick Test Checklist

Before reporting issues, check:

- [ ] Browser console is open (F12)
- [ ] Model loaded message appears
- [ ] Video file is valid (plays in browser)
- [ ] Video is 10-30 seconds
- [ ] Video is 720p or better
- [ ] Good lighting in video
- [ ] Sideline camera angle
- [ ] No console errors (red text)

---

## Still Not Working?

### Get Debug Info:

1. **Open console** (F12)
2. **Upload video**
3. **Copy all console output**
4. **Check for:**
   - Model load messages
   - Frame extraction counts
   - Detection counts per frame
   - Tracking results
   - Any error messages

### Share:
- Console output
- Video specs (length, resolution, format)
- Browser version
- What step it fails at

---

## Expected Behavior

### What Should Happen:

1. **Upload video** → Small preview shows
2. **Click "Process Video"** → Progress bar appears
3. **Processing** → 30-60 seconds, progress updates
4. **Complete** → Labeling modal opens automatically
5. **Label players** → Click, type number, choose team
6. **Generate Play** → Play appears in list
7. **Animate** → Click play to see it!

### If Any Step Fails:
- Check console for errors
- See fixes above
- Try different video

---

## Performance Notes

### Normal Processing Times:
- **10 sec video:** ~30 seconds
- **20 sec video:** ~50 seconds
- **30 sec video:** ~80 seconds

### If Much Slower:
- Close other tabs
- Check CPU usage
- Try shorter video
- Check browser console for errors

---

## Success Indicators

✅ **Model loaded** - Console says "Model loaded successfully!"
✅ **Frames extracted** - Console shows frame count
✅ **Players detected** - Console shows "Found X players" per frame
✅ **Tracks created** - Console shows "Players tracked: X"
✅ **Modal opens** - Labeling screen appears
✅ **Play generated** - Alert says "Play generated successfully!"

If all these happen, **it's working!** 🎉

---

**Need more help?** Check the console output and share what you see!

