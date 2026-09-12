/**
 * 8-Bit Web Audio API Sound & Music Synthesizer
 * Zero external audio file dependencies - 100% reliable, zero 404s, instantaneous response.
 */

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isBgmPlaying: boolean = false;
  private bgmInterval: ReturnType<typeof setInterval> | null = null;
  private currentNoteIndex: number = 0;

  constructor() {
    // AudioContext initialized upon user gesture
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.value = 0.12; // gentle retro background music volume
      this.bgmGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.22; // crisp sound effects
      this.sfxGain.connect(this.ctx.destination);
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.ctx) {
      if (this.bgmGain) this.bgmGain.gain.value = this.isMuted ? 0 : 0.12;
      if (this.sfxGain) this.sfxGain.gain.value = this.isMuted ? 0 : 0.22;
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // --- Retro Sound Effects ---

  /** Dialogue character typewriter blip */
  public playTextBeep() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = this.ctx.currentTime;

      osc.type = 'square';
      osc.frequency.setValueAtTime(520, t);
      osc.frequency.exponentialRampToValueAtTime(780, t + 0.04);

      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.04);
    } catch {
      // AudioContext state handling
    }
  }

  /** Menu navigation click */
  public playMenuCursor() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = this.ctx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, t);
      osc.frequency.setValueAtTime(880, t + 0.03);

      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.06);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.06);
    } catch {
      // ignore
    }
  }

  /** Menu item confirmation / Open window */
  public playSelect() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(587.33, t); // D5
      osc.frequency.setValueAtTime(880, t + 0.08); // A5

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.16);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.16);
    } catch {
      // ignore
    }
  }

  /** Menu cancel / Close window */
  public playCancel() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(659.25, t); // E5
      osc.frequency.setValueAtTime(440, t + 0.07); // A4

      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.14);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.14);
    } catch {
      // ignore
    }
  }

  /** Solid collision bump against trees or walls */
  public playBump() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(110, t);
      osc.frequency.exponentialRampToValueAtTime(55, t + 0.08);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.08);
    } catch {
      // ignore
    }
  }

  /** Building warp door chime */
  public playWarp() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const notes = [440, 554.37, 659.25, 880];
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + idx * 0.06;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(t);
        osc.stop(t + 0.12);
      });
    } catch {
      // ignore
    }
  }

  /** Pokémon encounter "!" alert chirp */
  public playWildAlert() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, t);
      osc.frequency.linearRampToValueAtTime(1600, t + 0.08);
      osc.frequency.setValueAtTime(1900, t + 0.1);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.2);
    } catch {
      // ignore
    }
  }

  /** Victory / Item Received 4-note retro fanfare */
  public playFanfare() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + idx * 0.12;

        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + (idx === 3 ? 0.4 : 0.15));

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(t);
        osc.stop(t + (idx === 3 ? 0.4 : 0.15));
      });
    } catch {
      // ignore
    }
  }

  /** Helper to generate realistic noise buffers for percussion */
  private createNoiseBuffer(duration: number): AudioBuffer | null {
    if (!this.ctx) return null;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  /**
   * Authentic Acoustic Beatbox Synthesizer
   * Accurately synthesizes human vocal percussion (Kicks, K-Snares, Hi-Hats, Scratches, Throat Bass, Clicks)
   */
  public playBeatboxSound(type: 'kick' | 'snare' | 'hihat' | 'scratch' | 'throatbass' | 'click') {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const t = this.ctx.currentTime;

      if (type === 'kick') {
        // 1. Beatbox Lip Kick ("B" Plosive):
        // Air puff transient (low-pass noise burst) + deep tonal chest drop (220Hz -> 45Hz)
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(240, t);
        osc.frequency.exponentialRampToValueAtTime(45, t + 0.16);

        oscGain.gain.setValueAtTime(0.6, t);
        oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

        osc.connect(oscGain);
        oscGain.connect(this.sfxGain);

        osc.start(t);
        osc.stop(t + 0.18);

        // Lip pop noise puff
        const noiseBuffer = this.createNoiseBuffer(0.04);
        if (noiseBuffer) {
          const noise = this.ctx.createBufferSource();
          noise.buffer = noiseBuffer;

          const filter = this.ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(280, t);

          const noiseGain = this.ctx.createGain();
          noiseGain.gain.setValueAtTime(0.35, t);
          noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.04);

          noise.connect(filter);
          filter.connect(noiseGain);
          noiseGain.connect(this.sfxGain);

          noise.start(t);
        }
      } else if (type === 'snare') {
        // 2. Beatbox K-Snare / "Psh" Snare:
        // Acoustic tongue-palate air release using bandpass-filtered noise + resonant body snap
        const noiseBuffer = this.createNoiseBuffer(0.16);
        if (noiseBuffer) {
          const noise = this.ctx.createBufferSource();
          noise.buffer = noiseBuffer;

          // Bandpass filter centered at 3400Hz gives the distinctive hollow acoustic "K" texture
          const bandpass = this.ctx.createBiquadFilter();
          bandpass.type = 'bandpass';
          bandpass.frequency.setValueAtTime(3400, t);
          bandpass.Q.setValueAtTime(2.2, t);

          const noiseGain = this.ctx.createGain();
          noiseGain.gain.setValueAtTime(0.5, t);
          noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

          noise.connect(bandpass);
          bandpass.connect(noiseGain);
          noiseGain.connect(this.sfxGain);

          noise.start(t);
        }

        // Tonal palate release click
        const toneOsc = this.ctx.createOscillator();
        const toneGain = this.ctx.createGain();
        toneOsc.type = 'triangle';
        toneOsc.frequency.setValueAtTime(360, t);
        toneOsc.frequency.exponentialRampToValueAtTime(90, t + 0.05);

        toneGain.gain.setValueAtTime(0.25, t);
        toneGain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);

        toneOsc.connect(toneGain);
        toneGain.connect(this.sfxGain);

        toneOsc.start(t);
        toneOsc.stop(t + 0.05);
      } else if (type === 'hihat') {
        // 3. Beatbox Hi-Hat (Vocal "Ts" Sound):
        // High-pass filtered noise with ultra-fast attack and 35ms crisp decay
        const noiseBuffer = this.createNoiseBuffer(0.05);
        if (noiseBuffer) {
          const noise = this.ctx.createBufferSource();
          noise.buffer = noiseBuffer;

          const filter = this.ctx.createBiquadFilter();
          filter.type = 'highpass';
          filter.frequency.setValueAtTime(8000, t);
          filter.Q.setValueAtTime(2.5, t);

          const gain = this.ctx.createGain();
          gain.gain.setValueAtTime(0.35, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

          noise.connect(filter);
          filter.connect(gain);
          gain.connect(this.sfxGain);

          noise.start(t);
        }
      } else if (type === 'scratch') {
        // 4. Beatbox Vocal Turntable Scratch ("Wikki-Wikki"):
        // Sawtooth frequency sweep with resonant vocal formant bandpass filter
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, t);
        osc.frequency.linearRampToValueAtTime(860, t + 0.07);
        osc.frequency.linearRampToValueAtTime(420, t + 0.15);

        // Resonant bandpass for mouth cavity resonance
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1300, t);
        filter.Q.setValueAtTime(4.5, t);

        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(t);
        osc.stop(t + 0.15);
      } else if (type === 'throatbass') {
        // 5. Throat Bass (Deep sub-harmonic vocal vibration):
        // 58Hz sub-bass with harmonic grit and gentle lowpass
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(58, t);
        osc.frequency.setValueAtTime(55, t + 0.2);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(380, t);
        filter.Q.setValueAtTime(3.0, t);

        gain.gain.setValueAtTime(0.45, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.28);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(t);
        osc.stop(t + 0.28);
      } else if (type === 'click') {
        // 6. Tongue Click / Rimshot ("Ka" Click):
        // Ultra fast 15ms resonant tongue pop
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1800, t);
        osc.frequency.exponentialRampToValueAtTime(480, t + 0.02);

        gain.gain.setValueAtTime(0.4, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(t);
        osc.stop(t + 0.025);
      }
    } catch {
      // ignore
    }
  }

  // --- Authentic GBA Background Music (Pallet Town / Littleroot Town Chiptune) ---

  public startBGM() {
    if (this.isBgmPlaying) return;
    this.initContext();
    if (!this.ctx || !this.bgmGain) return;

    this.isBgmPlaying = true;
    this.currentNoteIndex = 0;

    // Pallet Town / Littleroot inspired nostalgic 8-bit melody sequence (Hz)
    // C Major / G Major friendly nostalgic progression
    const melody: { f: number; dur: number }[] = [
      { f: 523.25, dur: 0.28 }, // C5
      { f: 587.33, dur: 0.14 }, // D5
      { f: 659.25, dur: 0.28 }, // E5
      { f: 783.99, dur: 0.28 }, // G5
      { f: 659.25, dur: 0.14 }, // E5
      { f: 523.25, dur: 0.42 }, // C5
      { f: 0, dur: 0.14 },      // rest
      { f: 440.00, dur: 0.28 }, // A4
      { f: 523.25, dur: 0.28 }, // C5
      { f: 587.33, dur: 0.42 }, // D5
      { f: 0, dur: 0.14 },      // rest
      { f: 659.25, dur: 0.28 }, // E5
      { f: 783.99, dur: 0.28 }, // G5
      { f: 880.00, dur: 0.28 }, // A5
      { f: 783.99, dur: 0.28 }, // G5
      { f: 659.25, dur: 0.28 }, // E5
      { f: 587.33, dur: 0.56 }, // D5
      { f: 0, dur: 0.14 },      // rest
      // Second phrase
      { f: 523.25, dur: 0.28 }, // C5
      { f: 659.25, dur: 0.28 }, // E5
      { f: 783.99, dur: 0.42 }, // G5
      { f: 880.00, dur: 0.28 }, // A5
      { f: 783.99, dur: 0.28 }, // G5
      { f: 659.25, dur: 0.28 }, // E5
      { f: 523.25, dur: 0.28 }, // C5
      { f: 587.33, dur: 0.28 }, // D5
      { f: 523.25, dur: 0.70 }, // C5
      { f: 0, dur: 0.28 },      // rest
    ];

    const playNextNote = () => {
      if (!this.isBgmPlaying || !this.ctx || !this.bgmGain) return;

      const current = melody[this.currentNoteIndex];
      this.currentNoteIndex = (this.currentNoteIndex + 1) % melody.length;

      if (current.f > 0 && !this.isMuted) {
        try {
          const t = this.ctx.currentTime;
          // Lead melody (warm square wave)
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'square';
          osc.frequency.setValueAtTime(current.f, t);

          gain.gain.setValueAtTime(0.06, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + current.dur * 0.9);

          osc.connect(gain);
          gain.connect(this.bgmGain);

          osc.start(t);
          osc.stop(t + current.dur);

          // Sub-bass counter-note (triangle wave, 1 octave lower)
          const bassOsc = this.ctx.createOscillator();
          const bassGain = this.ctx.createGain();

          bassOsc.type = 'triangle';
          bassOsc.frequency.setValueAtTime(current.f / 2, t);

          bassGain.gain.setValueAtTime(0.07, t);
          bassGain.gain.exponentialRampToValueAtTime(0.001, t + current.dur * 0.85);

          bassOsc.connect(bassGain);
          bassGain.connect(this.bgmGain);

          bassOsc.start(t);
          bassOsc.stop(t + current.dur);
        } catch {
          // ignore
        }
      }

      this.bgmInterval = setTimeout(playNextNote, current.dur * 1000);
    };

    playNextNote();
  }

  public stopBGM() {
    this.isBgmPlaying = false;
    if (this.bgmInterval) {
      clearTimeout(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

// Export singleton instance
export const soundManager = new SoundManager();
