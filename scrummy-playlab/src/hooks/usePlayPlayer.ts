import { useCallback, useEffect, useRef, useState } from "react";
import type { Play } from "../types/play";

export const usePlayPlayer = (play: Play | null) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeMs, setCurrentTimeMs] = useState(0);
  const lastTimestampRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const stopAnimation = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const tick = useCallback(
    (timestamp: number) => {
      if (!play) return;

      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }
      const delta = timestamp - lastTimestampRef.current;
      lastTimestampRef.current = timestamp;

      setCurrentTimeMs((prev) => {
        const next = prev + delta;
        if (next >= play.durationMs) {
          // end of play
          setIsPlaying(false);
          stopAnimation();
          return play.durationMs;
        }
        return next;
      });

      if (isPlaying && play) {
        rafRef.current = requestAnimationFrame(tick);
      }
    },
    [isPlaying, play]
  );

  useEffect(() => {
    if (isPlaying && play) {
      lastTimestampRef.current = null;
      rafRef.current = requestAnimationFrame(tick);
    } else {
      stopAnimation();
    }
    return stopAnimation;
  }, [isPlaying, play, tick]);

  const playHandler = () => {
    if (!play) return;
    if (currentTimeMs >= play.durationMs) {
      setCurrentTimeMs(0);
    }
    setIsPlaying(true);
  };

  const pauseHandler = () => setIsPlaying(false);

  const restartHandler = () => {
    setCurrentTimeMs(0);
    setIsPlaying(true);
  };

  const setTime = (value: number) => {
    setCurrentTimeMs(value);
  };

  // Reset time when play changes
  useEffect(() => {
    setCurrentTimeMs(0);
    setIsPlaying(false);
  }, [play?.id]);

  return {
    isPlaying,
    currentTimeMs,
    play: playHandler,
    pause: pauseHandler,
    restart: restartHandler,
    setTime,
  };
};

