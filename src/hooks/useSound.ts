import { useState, useCallback } from 'react';
import { soundEngine } from '../utils/audioAmbience';

/**
 * Custom hook for managing ambient soundscapes and audio cues.
 */
export function useSound() {
  const [isPlaying, setIsPlaying] = useState<boolean>(() => soundEngine.getIsPlaying());

  const toggleSound = useCallback(() => {
    const newState = soundEngine.toggleAmbience();
    setIsPlaying(newState);
    return newState;
  }, []);

  const playChime = useCallback((frequencies?: number[]) => {
    soundEngine.playChime(frequencies);
  }, []);

  return {
    isPlaying,
    toggleSound,
    playChime,
  };
}
