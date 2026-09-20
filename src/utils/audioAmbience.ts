// Web Audio Synthesizer for Cosmic Storytelling Ambience
// Pure Web Audio API: 100% offline, zero external audio files, zero latency.

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private ambientGain: GainNode | null = null;
  private oscInterval: any = null;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleAmbience(): boolean {
    this.initContext();
    if (!this.ctx) return false;

    this.isMuted = !this.isMuted;

    if (!this.isMuted) {
      this.startAmbientDrone();
      this.playChime([523.25, 659.25, 783.99, 1046.5]); // C Major triad chime
    } else {
      this.stopAmbientDrone();
    }

    return !this.isMuted;
  }

  public getIsPlaying(): boolean {
    return !this.isMuted;
  }

  private startAmbientDrone() {
    if (!this.ctx) return;

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    this.ambientGain.gain.exponentialRampToValueAtTime(0.04, this.ctx.currentTime + 3);
    this.ambientGain.connect(this.ctx.destination);

    // Ethereal pentatonic frequencies (Hz): D3, A3, C4, E4, G4
    const freqs = [146.83, 220.0, 261.63, 329.63, 392.0];

    const playRandomNote = () => {
      if (!this.ctx || this.isMuted || !this.ambientGain) return;

      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      const freq = freqs[Math.floor(Math.random() * freqs.length)];
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      noteGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      noteGain.gain.linearRampToValueAtTime(0.03, this.ctx.currentTime + 2);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 7);

      osc.connect(noteGain);
      noteGain.connect(this.ambientGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 7.5);
    };

    playRandomNote();
    this.oscInterval = setInterval(playRandomNote, 3200);
  }

  private stopAmbientDrone() {
    if (this.oscInterval) {
      clearInterval(this.oscInterval);
      this.oscInterval = null;
    }
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, this.ctx.currentTime);
      this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.5);
      setTimeout(() => {
        this.ambientGain?.disconnect();
        this.ambientGain = null;
      }, 1600);
    }
  }

  // Play a gentle starlight chime when a moment or chapter is connected
  public playChime(frequencies: number[] = [659.25, 880, 1174.66]) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    frequencies.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + i * 0.08);

      gain.gain.setValueAtTime(0.025, this.ctx!.currentTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx!.currentTime + i * 0.08 + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(this.ctx!.currentTime + i * 0.08);
      osc.stop(this.ctx!.currentTime + i * 0.08 + 1.3);
    });
  }
}

export const soundEngine = new SoundEngine();
