/**
 * Utility for playing sound effects in the application with settings control
 */

// Default settings
let soundEnabled = true;
let volume = 0.5; // 0 to 1

// Track if sounds are available
let startSoundAvailable = true;
let stopSoundAvailable = true;

// Create audio elements with relative paths to the public directory
const startListeningSound = new Audio('/processing-beep.mp3');
const stopListeningSound = new Audio('/processing-beep.mp3');

// Apply initial settings
startListeningSound.volume = volume;
stopListeningSound.volume = volume;

// Check if sounds are available
startListeningSound.addEventListener('error', () => {
  console.warn('Start listening sound file not found or unsupported format');
  startSoundAvailable = false;
});

stopListeningSound.addEventListener('error', () => {
  console.warn('Stop listening sound file not found or unsupported format');
  stopSoundAvailable = false;
});

// Preload the sounds
startListeningSound.load();
stopListeningSound.load();

/**
 * Plays the sound when the agent starts listening
 */
export const playStartListeningSound = () => {
  if (soundEnabled && startSoundAvailable) {
    try {
      startListeningSound.currentTime = 0;
      const playPromise = startListeningSound.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Error playing start listening sound:', error);
          // If autoplay policy is the issue, we can handle it specially
          if (error.name === 'NotAllowedError') {
            console.warn('Audio playback was prevented by browser autoplay policy');
          }
        });
      }
    } catch (error) {
      console.error('Error in playStartListeningSound:', error);
    }
  }
};

/**
 * Plays the sound when the agent stops listening
 */
export const playStopListeningSound = () => {
  if (soundEnabled && stopSoundAvailable) {
    try {
      stopListeningSound.currentTime = 0;
      const playPromise = stopListeningSound.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Error playing stop listening sound:', error);
          if (error.name === 'NotAllowedError') {
            console.warn('Audio playback was prevented by browser autoplay policy');
          }
        });
      }
    } catch (error) {
      console.error('Error in playStopListeningSound:', error);
    }
  }
};

/**
 * Update sound settings
 */
export const updateSoundSettings = (enabled: boolean, newVolume?: number) => {
  soundEnabled = enabled;
  
  if (newVolume !== undefined) {
    volume = Math.min(1, Math.max(0, newVolume)); // Ensure volume is between 0 and 1
    startListeningSound.volume = volume;
    stopListeningSound.volume = volume;
  }
};

/**
 * Check if the sound files are available
 * @returns {boolean} true if at least one sound file is available
 */
export const areSoundsAvailable = () => {
  return startSoundAvailable || stopSoundAvailable;
};
