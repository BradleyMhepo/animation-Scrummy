export const captureCanvasFrames = async (
  canvas: HTMLCanvasElement,
  durationMs: number,
  fps: number = 30,
  onProgress?: (percent: number) => void
): Promise<Blob> => {
  return new Promise(async (resolve, reject) => {
    try {
      const frameCount = Math.ceil((durationMs / 1000) * fps);
      const frameInterval = durationMs / frameCount;

      // Import GIF dynamically
      // @ts-ignore - gif.js doesn't have types
      const GIF = (await import('gif.js')).default;
      
      const gif = new GIF({
        workers: 2,
        quality: 10,
        width: canvas.width,
        height: canvas.height,
        workerScript: '/node_modules/gif.js/dist/gif.worker.js'
      });

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Capture frames
      for (let i = 0; i < frameCount; i++) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        gif.addFrame(imageData, { delay: frameInterval });
        
        if (onProgress) {
          onProgress(Math.round((i / frameCount) * 100));
        }
        
        // Small delay to let UI update
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      gif.on('finished', (blob: Blob) => {
        resolve(blob);
      });

      gif.render();
    } catch (error) {
      reject(error);
    }
  });
};

export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Alternative: Capture using MediaRecorder (for video)
export const recordCanvasToVideo = async (
  canvas: HTMLCanvasElement,
  durationMs: number,
  fps: number = 30
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const stream = canvas.captureStream(fps);
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm',
      videoBitsPerSecond: 2500000
    });

    const chunks: Blob[] = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      resolve(blob);
    };

    mediaRecorder.onerror = (e) => {
      reject(e);
    };

    mediaRecorder.start();

    setTimeout(() => {
      mediaRecorder.stop();
    }, durationMs);
  });
};

