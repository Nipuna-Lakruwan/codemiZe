import { useRef, useCallback, useEffect } from 'react';

/**
 * Custom hook for audio management in the application
 * @param {Object} options Configuration options
 * @param {boolean} options.enabled Whether sound effects are enabled
 * @returns {Object} Sound effect control methods
 */
export const useSound = (options = { enabled: true }) => {
  const { enabled } = options;
  const audioCache = useRef(new Map());
  const currentlyPlaying = useRef(new Set());

  // Preload sounds to avoid delay when playing
  const preloadSound = useCallback((soundName) => {
    if (!enabled) return null;

    if (!audioCache.current.has(soundName)) {
      const audio = new Audio(`/sounds/${soundName}`);
      audio.load();
      audioCache.current.set(soundName, audio);
    }

    return audioCache.current.get(soundName);
  }, [enabled]);

  // Play a sound with options
  const playSound = useCallback((soundName, options = {}) => {
    if (!enabled) return;

    const { volume = 1, loop = false, interrupt = true } = options;

    // If this sound is already playing and we don't want to interrupt
    if (!interrupt && currentlyPlaying.current.has(soundName)) {
      return;
    }

    try {
      const sound = preloadSound(soundName);
      if (!sound) return;

      // Create a new audio instance to allow overlapping sounds
      const playInstance = new Audio(`/sounds/${soundName}`);
      playInstance.volume = volume;
      playInstance.loop = loop;

      // Add to currently playing set
      currentlyPlaying.current.add(soundName);

      // Remove from playing set when done
      playInstance.onended = () => {
        currentlyPlaying.current.delete(soundName);
      };

      playInstance.play().catch(err => {
        console.warn(`Error playing sound ${soundName}:`, err);
        currentlyPlaying.current.delete(soundName);
      });

      // Return control functions
      return {
        stop: () => {
          playInstance.pause();
          playInstance.currentTime = 0;
          currentlyPlaying.current.delete(soundName);
        },
        setVolume: (newVolume) => {
          playInstance.volume = newVolume;
        }
      };
    } catch (err) {
      console.error(`Failed to play sound ${soundName}:`, err);
      return null;
    }
  }, [enabled, preloadSound]);

  // Stop all playing sounds
  const stopAllSounds = useCallback(() => {
    currentlyPlaying.current.forEach(soundName => {
      const sound = audioCache.current.get(soundName);
      if (sound) {
        sound.pause();
        sound.currentTime = 0;
      }
    });
    currentlyPlaying.current.clear();
  }, []);

  // Clean up all audio on unmount
  useEffect(() => {
    return () => {
      audioCache.current.forEach(audio => {
        audio.pause();
        audio.src = '';
      });
      audioCache.current.clear();
      currentlyPlaying.current.clear();
    };
  }, []);

  return {
    playSound,
    preloadSound,
    stopAllSounds
  };
};

export default useSound;
