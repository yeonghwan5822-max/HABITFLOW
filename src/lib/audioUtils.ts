export function playSystemSound() {
  if (typeof window === 'undefined') return;
  
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const audioCtx = new AudioContext();
    
    // First beep
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(900, audioCtx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
    
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.15);

    // Second beep (higher pitch, delayed)
    const osc2 = audioCtx.createOscillator();
    const gainNode2 = audioCtx.createGain();
    
    osc2.connect(gainNode2);
    gainNode2.connect(audioCtx.destination);
    
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(900, audioCtx.currentTime + 0.15);
    osc2.frequency.exponentialRampToValueAtTime(1400, audioCtx.currentTime + 0.25);
    
    gainNode2.gain.setValueAtTime(0, audioCtx.currentTime + 0.15);
    gainNode2.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.17);
    gainNode2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
    
    osc2.start(audioCtx.currentTime + 0.15);
    osc2.stop(audioCtx.currentTime + 0.4);
    
  } catch (e) {
    console.warn('Audio playback failed check browser permissions', e);
  }
}
