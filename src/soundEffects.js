// Using shorter, more reliable sound effects
export const soundEffects = [
  'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAEAAABVgANTU1NTU1Q0NDQ0NDUFBQUFBQXl5eXl5ea2tra2tra3l5eXl5eYaGhoaGhpSUlJSUlKGhoaGhoaGvr6+vr6+8vLy8vLzKysrKysrY2NjY2Njm5ubm5ub09PT09PT///////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAABVjMPvL3AAAAAAAAAAAAAAAAAAAA/+QowAAAABkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+MYxAAAAANIAAAAAExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxDsAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxHYAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxLEAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV',
  'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAEAAABVgANTU1NTU1Q0NDQ0NDUFBQUFBQXl5eXl5ea2tra2tra3l5eXl5eYaGhoaGhpSUlJSUlKGhoaGhoaGvr6+vr6+8vLy8vLzKysrKysrY2NjY2Njm5ubm5ub09PT09PT///////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAABVjMPvL3AAAAAAAAAAAAAAAAAAAA/+QowAAAABkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+MYxAAAAANIAAAAAExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxDsAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxHYAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxLEAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV'
];

// Singleton AudioContext
let audioContext = null;

function initAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

// Create 8-bit style beep with more variations
export function createBeepSound(frequency = 440, duration = 0.1, volume = 0.1, type = 'square', pattern = 'single') {
  try {
    const context = initAudioContext();
    if (context.state === 'suspended') {
      context.resume();
    }
    
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    const filter = context.createBiquadFilter();

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.type = type;
    oscillator.frequency.value = frequency;

    filter.type = 'lowpass';
    filter.frequency.value = 2000;

    switch (pattern) {
      case 'double':
        // Quick double beep
        gainNode.gain.setValueAtTime(0, context.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, context.currentTime + 0.01);
        gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 0.05);
        gainNode.gain.linearRampToValueAtTime(volume, context.currentTime + 0.06);
        gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 0.1);
        break;
      case 'slide':
        // Sliding frequency
        oscillator.frequency.setValueAtTime(frequency * 1.5, context.currentTime);
        oscillator.frequency.linearRampToValueAtTime(frequency, context.currentTime + duration);
        gainNode.gain.setValueAtTime(0, context.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, context.currentTime + 0.01);
        gainNode.gain.linearRampToValueAtTime(0, context.currentTime + duration);
        break;
      case 'wobble':
        // Wobble effect
        gainNode.gain.setValueAtTime(0, context.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, context.currentTime + 0.01);
        for (let i = 0; i < 4; i++) {
          oscillator.frequency.setValueAtTime(frequency * (1 + (i % 2) * 0.1), context.currentTime + i * 0.03);
        }
        gainNode.gain.linearRampToValueAtTime(0, context.currentTime + duration);
        break;
      default:
        // Single beep
        gainNode.gain.setValueAtTime(0, context.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, context.currentTime + 0.01);
        gainNode.gain.setValueAtTime(volume, context.currentTime + duration - 0.01);
        gainNode.gain.linearRampToValueAtTime(0, context.currentTime + duration);
    }

    oscillator.start();
    setTimeout(() => oscillator.stop(), duration * 1000);
  } catch (error) {
    console.warn('Audio playback failed:', error);
  }
}

// Create a celebration sound effect (extended keygen style)
export function createCelebrationSound() {
  try {
    const context = initAudioContext();
    if (context.state === 'suspended') {
      context.resume();
    }

    // Define musical patterns for a longer sequence
    const patterns = [
      // Pattern 1: Rising arpeggio
      [440, 523.25, 659.25, 783.99, 880, 1046.50],
      // Pattern 2: Descending arpeggio
      [1046.50, 880, 783.99, 659.25, 523.25, 440],
      // Pattern 3: Bouncing pattern
      [440, 659.25, 440, 783.99, 440, 880],
      // Pattern 4: Final flourish
      [440, 523.25, 659.25, 880, 1046.50, 1318.51, 1567.98, 1760]
    ];

    const masterGain = context.createGain();
    const filter = context.createBiquadFilter();
    
    filter.type = 'lowpass';
    filter.frequency.value = 2000;
    filter.Q.value = 2;
    
    masterGain.connect(context.destination);
    masterGain.gain.value = 0.15;

    // Play each pattern in sequence
    patterns.forEach((pattern, patternIndex) => {
      pattern.forEach((freq, noteIndex) => {
        setTimeout(() => {
          const osc = context.createOscillator();
          const noteGain = context.createGain();
          
          // Alternate between square and sawtooth for variety
          osc.type = patternIndex % 2 === 0 ? 'square' : 'sawtooth';
          osc.frequency.value = freq;
          
          osc.connect(noteGain);
          noteGain.connect(filter);
          filter.connect(masterGain);
          
          // Different envelope for each pattern
          switch (patternIndex) {
            case 0:
              // Quick staccato
              noteGain.gain.setValueAtTime(0, context.currentTime);
              noteGain.gain.linearRampToValueAtTime(1, context.currentTime + 0.01);
              noteGain.gain.linearRampToValueAtTime(0, context.currentTime + 0.08);
              break;
            case 1:
              // Longer notes
              noteGain.gain.setValueAtTime(0, context.currentTime);
              noteGain.gain.linearRampToValueAtTime(1, context.currentTime + 0.02);
              noteGain.gain.linearRampToValueAtTime(0, context.currentTime + 0.15);
              break;
            case 2:
              // Bouncy effect
              noteGain.gain.setValueAtTime(0, context.currentTime);
              noteGain.gain.linearRampToValueAtTime(1, context.currentTime + 0.01);
              noteGain.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.05);
              noteGain.gain.linearRampToValueAtTime(0, context.currentTime + 0.1);
              break;
            case 3:
              // Final pattern with longer release
              noteGain.gain.setValueAtTime(0, context.currentTime);
              noteGain.gain.linearRampToValueAtTime(1, context.currentTime + 0.02);
              noteGain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.3);
              break;
          }
          
          osc.start();
          setTimeout(() => osc.stop(), 300);
        }, (patternIndex * pattern.length * 150) + (noteIndex * 150));
      });
    });
  } catch (error) {
    console.warn('Celebration sound playback failed:', error);
  }
}

// Create a sassy milestone sound (8-bit style)
export function createSassySound() {
  try {
    const context = initAudioContext();
    if (context.state === 'suspended') {
      context.resume();
    }

    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    const filter = context.createBiquadFilter();

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.type = 'square';
    filter.type = 'lowpass';
    filter.frequency.value = 1500;
    gainNode.gain.value = 0.1;

    oscillator.frequency.setValueAtTime(880, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(440, context.currentTime + 0.1);
    oscillator.frequency.exponentialRampToValueAtTime(523.25, context.currentTime + 0.2);
    
    oscillator.start();
    
    gainNode.gain.setValueAtTime(0.1, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, context.currentTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 0.3);

    setTimeout(() => oscillator.stop(), 300);
  } catch (error) {
    console.warn('Audio playback failed:', error);
  }
}

// Different sound variations (8-bit style)
export const soundVariations = [
  // Basic beeps
  () => createBeepSound(440, 0.1, 0.1, 'square', 'single'),      // A4 simple
  () => createBeepSound(523.25, 0.1, 0.1, 'square', 'double'),   // C5 double
  () => createBeepSound(659.25, 0.15, 0.1, 'square', 'slide'),   // E5 slide
  () => createBeepSound(783.99, 0.2, 0.1, 'square', 'wobble'),   // G5 wobble
  
  // Sawtooth variations
  () => createBeepSound(440, 0.1, 0.08, 'sawtooth', 'single'),   // A4 saw
  () => createBeepSound(523.25, 0.15, 0.08, 'sawtooth', 'slide'), // C5 saw slide
  
  // Triangle variations
  () => createBeepSound(659.25, 0.1, 0.12, 'triangle', 'double'), // E5 tri double
  () => createBeepSound(783.99, 0.2, 0.12, 'triangle', 'wobble'), // G5 tri wobble
]; 