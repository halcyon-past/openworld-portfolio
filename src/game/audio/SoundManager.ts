import { VOICE_MANIFEST } from '@/data/voiceManifest';

function canonicalizeSpeechText(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\[.*?\]/g, '')
    .replace(/[✨⚡⭐★✓✉️🎒]/g, '')
    .replace(/['’"“”`]/g, '')
    .replace(/&/g, 'and')
    .replace(/->/g, 'to')
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const CANONICAL_VOICE_MANIFEST: Array<{ canon: string; url: string; speaker: string }> = Object.entries(VOICE_MANIFEST).map(([key, url]) => {
  const [speaker, ...rest] = key.split(':');
  return {
    canon: canonicalizeSpeechText(rest.join(':')),
    url,
    speaker
  };
});

/**
 * 8-Bit Web Audio API Sound & Music Synthesizer
 * Zero external audio file dependencies - 100% reliable, zero 404s, instantaneous response.
 */

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private beatboxBus: GainNode | null = null;
  private beatboxCompressor: DynamicsCompressorNode | null = null;
  private cachedNoiseBuffer: AudioBuffer | null = null;
  private isBgmPlaying: boolean = false;
  private bgmInterval: ReturnType<typeof setInterval> | null = null;
  private currentNoteIndex: number = 0;

  // Individual audio channel settings
  private bgmVolume: number = 0.5;
  private isBgmMuted: boolean = false;
  private sfxVolume: number = 0.7;
  private isSfxMuted: boolean = false;
  private voiceVolume: number = 0.85;
  private isVoiceMuted: boolean = false;
  private currentVoiceAudio: HTMLAudioElement | null = null;

  constructor() {
    this.loadSettings();
    this.initSpeechVoices();
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.bgmGain = this.ctx.createGain();
      const bgmVol = (this.isMuted || this.isBgmMuted) ? 0 : this.bgmVolume * 0.16;
      this.bgmGain.gain.value = bgmVol;
      this.bgmGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      const sfxVol = (this.isMuted || this.isSfxMuted) ? 0 : this.sfxVolume * 0.28;
      this.sfxGain.gain.value = sfxVol;
      this.sfxGain.connect(this.ctx.destination);

      // Dedicated Master Beatbox Bus with Punchy Dynamics Compressor
      this.beatboxCompressor = this.ctx.createDynamicsCompressor();
      this.beatboxCompressor.threshold.setValueAtTime(-14, this.ctx.currentTime);
      this.beatboxCompressor.knee.setValueAtTime(6, this.ctx.currentTime);
      this.beatboxCompressor.ratio.setValueAtTime(4.5, this.ctx.currentTime);
      this.beatboxCompressor.attack.setValueAtTime(0.002, this.ctx.currentTime);
      this.beatboxCompressor.release.setValueAtTime(0.12, this.ctx.currentTime);

      this.beatboxBus = this.ctx.createGain();
      const bbVol = (this.isMuted || this.isSfxMuted) ? 0 : Math.min(1.0, this.sfxVolume * 0.95);
      this.beatboxBus.gain.value = bbVol;

      this.beatboxCompressor.connect(this.beatboxBus);
      this.beatboxBus.connect(this.ctx.destination);

      // Pre-warm 1s noise buffer for zero-lag percussion triggers
      this.cachedNoiseBuffer = this.createNoiseBuffer(1.0);
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // --- Audio Channel Controls ---

  public getBgmVolume(): number { return this.bgmVolume; }
  public setBgmVolume(volume: number) {
    this.bgmVolume = Math.max(0, Math.min(1, volume));
    this.updateBgmGain();
    this.persistSettings();
  }

  public getBgmMuted(): boolean { return this.isBgmMuted; }
  public setBgmMuted(muted: boolean) {
    this.isBgmMuted = muted;
    this.updateBgmGain();
    this.persistSettings();
  }
  public toggleBgmMute(): boolean {
    this.setBgmMuted(!this.isBgmMuted);
    return this.isBgmMuted;
  }

  public getSfxVolume(): number { return this.sfxVolume; }
  public setSfxVolume(volume: number) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    this.updateSfxGain();
    this.persistSettings();
  }

  public getSfxMuted(): boolean { return this.isSfxMuted; }
  public setSfxMuted(muted: boolean) {
    this.isSfxMuted = muted;
    this.updateSfxGain();
    this.persistSettings();
  }
  public toggleSfxMute(): boolean {
    this.setSfxMuted(!this.isSfxMuted);
    return this.isSfxMuted;
  }

  public getVoiceVolume(): number { return this.voiceVolume; }
  public setVoiceVolume(volume: number) {
    this.voiceVolume = Math.max(0, Math.min(1, volume));
    if (this.currentVoiceAudio) {
      this.currentVoiceAudio.volume = Math.max(0.01, Math.min(1.0, this.voiceVolume));
    }
    this.persistSettings();
  }

  public getVoiceMuted(): boolean { return this.isVoiceMuted; }
  public setVoiceMuted(muted: boolean) {
    this.isVoiceMuted = muted;
    if (muted) this.stopSpeaking();
    this.persistSettings();
  }
  public toggleVoiceMute(): boolean {
    this.setVoiceMuted(!this.isVoiceMuted);
    return this.isVoiceMuted;
  }

  private updateBgmGain() {
    if (this.bgmGain && this.ctx) {
      const vol = (this.isMuted || this.isBgmMuted) ? 0 : this.bgmVolume * 0.16;
      this.bgmGain.gain.setValueAtTime(vol, this.ctx.currentTime);
    }
  }

  private updateSfxGain() {
    if (this.ctx) {
      if (this.sfxGain) {
        const vol = (this.isMuted || this.isSfxMuted) ? 0 : this.sfxVolume * 0.28;
        this.sfxGain.gain.setValueAtTime(vol, this.ctx.currentTime);
      }
      if (this.beatboxBus) {
        const bbVol = (this.isMuted || this.isSfxMuted) ? 0 : Math.min(1.0, this.sfxVolume * 0.95);
        this.beatboxBus.gain.setValueAtTime(bbVol, this.ctx.currentTime);
      }
    }
  }

  private persistSettings() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('openworld_audio_settings', JSON.stringify({
          bgmVolume: this.bgmVolume,
          bgmMuted: this.isBgmMuted,
          sfxVolume: this.sfxVolume,
          sfxMuted: this.isSfxMuted,
          voiceVolume: this.voiceVolume,
          voiceMuted: this.isVoiceMuted,
        }));
      } catch {
        // ignore
      }
    }
  }

  private loadSettings() {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('openworld_audio_settings');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (typeof parsed.bgmVolume === 'number') this.bgmVolume = parsed.bgmVolume;
          if (typeof parsed.bgmMuted === 'boolean') this.isBgmMuted = parsed.bgmMuted;
          if (typeof parsed.sfxVolume === 'number') this.sfxVolume = parsed.sfxVolume;
          if (typeof parsed.sfxMuted === 'boolean') this.isSfxMuted = parsed.sfxMuted;
          if (typeof parsed.voiceVolume === 'number') this.voiceVolume = parsed.voiceVolume;
          if (typeof parsed.voiceMuted === 'boolean') this.isVoiceMuted = parsed.voiceMuted;
        }
      } catch {
        // ignore
      }
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    this.updateBgmGain();
    this.updateSfxGain();
    if (this.isMuted) this.stopSpeaking();
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  private isSpeaking: boolean = false;
  private cachedVoices: SpeechSynthesisVoice[] = [];

  private initSpeechVoices() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const updateVoices = () => {
        try {
          this.cachedVoices = window.speechSynthesis.getVoices();
        } catch {
          // ignore
        }
      };
      updateVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = updateVoices;
      }
    }
  }

  public isVoiceSpeaking(): boolean {
    return this.isSpeaking;
  }

  /**
   * Character speech synthesis using Web Speech API with specific voice selections and pitch modulation
   */
  public speakText(text: string, speakerType: string = 'default') {
    // If Pixel Pup (pet), play playful synth barks and DO NOT speak text with speech synthesis
    if (speakerType === 'pet') {
      if (!this.isMuted && !this.isSfxMuted) {
        this.playPuppyBark('happy');
      }
      return;
    }

    if (this.isMuted || this.isVoiceMuted) return;

    // Stop any pending speech or audio clip
    this.stopSpeaking();

    // Clean text of action asterisks, brackets, and markdown
    const cleanText = text
      .replace(/\*.*?\*/g, '')
      .replace(/\[.*?\]/g, '')
      .replace(/[*_#~]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    // 1. High-Fidelity Studio ElevenLabs Audio Clips (100% consistent across all devices)
    let mappedSpeaker = speakerType;
    if (['house', 'lab', 'pokedex', 'mart', 'gym', 'bench', 'sign'].includes(speakerType)) {
      mappedSpeaker = 'sign';
    } else if (['fountain', 'nurse'].includes(speakerType)) {
      mappedSpeaker = 'nurse';
    } else if (['tv', 'arcade'].includes(speakerType)) {
      mappedSpeaker = 'arcade';
    } else if (['scientist', 'oak'].includes(speakerType)) {
      mappedSpeaker = 'scientist';
    }

    const rawKey = `${speakerType}:${cleanText}`.toLowerCase();
    const mappedRawKey = `${mappedSpeaker}:${cleanText}`.toLowerCase();
    const canonInput = canonicalizeSpeechText(text);

    let clipUrl =
      VOICE_MANIFEST[rawKey] ||
      VOICE_MANIFEST[mappedRawKey];

    if (!clipUrl && canonInput) {
      const speakerMatch = CANONICAL_VOICE_MANIFEST.find(
        (m) => (m.speaker === speakerType || m.speaker === mappedSpeaker) && m.canon === canonInput
      );
      if (speakerMatch) {
        clipUrl = speakerMatch.url;
      } else {
        const anyMatch = CANONICAL_VOICE_MANIFEST.find((m) => m.canon === canonInput);
        if (anyMatch) {
          clipUrl = anyMatch.url;
        } else if (canonInput.length > 15) {
          const subMatch = CANONICAL_VOICE_MANIFEST.find(
            (m) => m.canon.includes(canonInput) || canonInput.includes(m.canon)
          );
          if (subMatch) clipUrl = subMatch.url;
        }
      }
    }

    if (clipUrl && typeof window !== 'undefined') {
      try {
        const audio = new Audio(clipUrl);
        audio.volume = Math.max(0.01, Math.min(1.0, this.voiceVolume));
        this.isSpeaking = true;
        this.currentVoiceAudio = audio;

        audio.onended = () => {
          this.isSpeaking = false;
          if (this.currentVoiceAudio === audio) {
            this.currentVoiceAudio = null;
          }
        };

        audio.onerror = () => {
          this.isSpeaking = false;
          if (this.currentVoiceAudio === audio) {
            this.currentVoiceAudio = null;
          }
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            this.isSpeaking = false;
          });
        }
        return;
      } catch {
        this.isSpeaking = false;
      }
    }

    // 2. Fallback to browser Web Speech API if dynamic or unrendered
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {

        const utterance = new SpeechSynthesisUtterance(cleanText);
        const voices = this.cachedVoices.length > 0 ? this.cachedVoices : window.speechSynthesis.getVoices();

        // Categorize available system voices
        const enVoices = voices.filter((v) => v.lang.startsWith('en'));

        // Strict non-female voices filter
        const nonFemaleVoices = enVoices.filter((v) => 
          !/female|woman|girl|samantha|zira|victoria|karen|moira|fiona|sandy|shelley|tara|tessa|flo|grandma|kathy|agnes|vicki|allison|ava|susan|zoe/i.test(v.name)
        );

        // Explicit masculine voice targets
        // Direct match for Daniel voice
        const danielVoice = enVoices.find((v) => /^daniel\b/i.test(v.name)) || 
                            enVoices.find((v) => /\bdaniel\b/i.test(v.name));

        // For Dr. Oak: mature, resonant scholar/professor voice
        const oakVoices = [
          ...nonFemaleVoices.filter((v) => /albert|grandpa|arthur|george|en-gb|natural/i.test(v.name)),
          ...nonFemaleVoices.filter((v) => /alex|david|mark|wavenet-d|standard-d/i.test(v.name)),
          ...nonFemaleVoices
        ];

        // For Aritro Saha: Lock explicitly to Daniel, followed by clear British/American male voices
        const aritroVoice = danielVoice ||
          nonFemaleVoices.find((v) => /\b(alex|david|guy|oliver|james|wavenet-b|standard-b)\b/i.test(v.name)) ||
          nonFemaleVoices[0] ||
          null;

        const femaleVoice = enVoices.find((v) => 
          /female|woman|samantha|zira|victoria|karen|moira|fiona|sandy|shelley|tara|tessa|flo|grandma/i.test(v.name)
        );
        const naturalVoice = enVoices.find((v) => /natural|online|google/i.test(v.name));

        // Distinct voice profiles for every character
        switch (speakerType) {
          case 'pet': // Pixel Pup (Playful, excited, high-pitched cartoon puppy voice)
            utterance.voice = naturalVoice || femaleVoice || enVoices[0] || null;
            utterance.pitch = 1.95; // Adorable, energetic cartoon puppy pitch
            utterance.rate = 1.3;   // Zippy excited puppy pace
            break;

          case 'scientist': // Dr. / Prof. Oak (Distinguished, clear professor)
            utterance.voice = oakVoices[0] || null;
            utterance.pitch = 0.88;
            utterance.rate = 0.92;
            break;

          case 'nurse': // Nurse Joy (Sweet, bright, cheerful, high tone)
            utterance.voice = femaleVoice || enVoices[0] || null;
            utterance.pitch = 1.35;
            utterance.rate = 1.05;
            break;

          case 'clerk': // Shop Clerk (Polite, crisp, upbeat)
            utterance.voice = naturalVoice || femaleVoice || enVoices[0] || null;
            utterance.pitch = 1.15;
            utterance.rate = 1.1;
            break;

          case 'gymleader': // Aritro Saha (Locked directly to Daniel voice - clear, natural, confident)
            utterance.voice = aritroVoice;
            utterance.pitch = 1.0; // 1.0 natural authentic human pitch
            utterance.rate = 0.98; // Natural speaking pace
            break;

          case 'arcade': // Arcade Host (Energetic, upbeat)
            utterance.voice = naturalVoice || nonFemaleVoices[0] || null;
            utterance.pitch = 1.1;
            utterance.rate = 1.15;
            break;

          case 'sign': // Public announcement / town notice board narrator (crisp, modern, neutral guide voice)
            utterance.voice = naturalVoice || femaleVoice || aritroVoice || null;
            utterance.pitch = 1.05; // Bright, clear, neutral public system announcement tone
            utterance.rate = 1.02;  // Fluent, informative reading speed
            break;

          default:
            utterance.voice = naturalVoice || aritroVoice || null;
            utterance.pitch = 1.0;
            utterance.rate = 1.0;
            break;
        }

        utterance.volume = Math.max(0.01, Math.min(1.0, this.voiceVolume));

        utterance.onstart = () => {
          this.isSpeaking = true;
        };
        utterance.onend = () => {
          this.isSpeaking = false;
        };
        utterance.onerror = () => {
          this.isSpeaking = false;
        };

        window.speechSynthesis.speak(utterance);
      } catch {
        this.isSpeaking = false;
      }
    }
  }

  public stopSpeaking() {
    this.isSpeaking = false;
    if (this.currentVoiceAudio) {
      try {
        this.currentVoiceAudio.pause();
        this.currentVoiceAudio.currentTime = 0;
      } catch {
        // ignore
      }
      this.currentVoiceAudio = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
  }

  // --- Retro Sound Effects ---

  /**
   * Realistic synthesized Puppy Bark sound effect (playful energetic double/triple-bark: "Arf! Woof-woof!")
   */
  public playPuppyBark(variation: 'happy' | 'double' | 'single' = 'double') {
    if (this.isMuted || this.isSfxMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;

      // Synthesize a single realistic canine vocalization
      const triggerBark = (time: number, pitch: number, duration: number, vol: number) => {
        if (!this.ctx || !this.sfxGain) return;

        // 1. Dual oscillator for vocal body (warm triangle + rich sawtooth harmonic)
        const oscTri = this.ctx.createOscillator();
        const oscSaw = this.ctx.createOscillator();
        const vocalGain = this.ctx.createGain();

        // 2. Formant bandpass filter modeling canine vocal tract resonance
        const formant = this.ctx.createBiquadFilter();
        formant.type = 'bandpass';
        formant.frequency.setValueAtTime(1350, time);
        formant.Q.setValueAtTime(2.0, time);

        // 3. Bark breath onset / puff (short white noise transient)
        const noiseLen = Math.floor(this.ctx.sampleRate * 0.04);
        const noiseBuf = this.ctx.createBuffer(1, noiseLen, this.ctx.sampleRate);
        const data = noiseBuf.getChannelData(0);
        for (let i = 0; i < noiseLen; i++) data[i] = (Math.random() * 2 - 1) * 0.5;

        const noiseSource = this.ctx.createBufferSource();
        noiseSource.buffer = noiseBuf;

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(vol * 0.35, time);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.035);

        // Canine bark frequency trajectory: quick rising chirp followed by steep downward drop
        oscTri.type = 'triangle';
        oscSaw.type = 'sawtooth';

        oscTri.frequency.setValueAtTime(pitch * 0.9, time);
        oscTri.frequency.linearRampToValueAtTime(pitch * 1.3, time + duration * 0.18);
        oscTri.frequency.exponentialRampToValueAtTime(pitch * 0.65, time + duration);

        oscSaw.frequency.setValueAtTime(pitch * 0.9, time);
        oscSaw.frequency.linearRampToValueAtTime(pitch * 1.3, time + duration * 0.18);
        oscSaw.frequency.exponentialRampToValueAtTime(pitch * 0.65, time + duration);

        // Punchy vocal envelope
        vocalGain.gain.setValueAtTime(0.001, time);
        vocalGain.gain.linearRampToValueAtTime(vol, time + 0.012);
        vocalGain.gain.exponentialRampToValueAtTime(0.001, time + duration);

        oscTri.connect(vocalGain);
        oscSaw.connect(vocalGain);
        vocalGain.connect(formant);
        formant.connect(this.sfxGain);

        noiseSource.connect(noiseGain);
        noiseGain.connect(this.sfxGain);

        oscTri.start(time);
        oscTri.stop(time + duration);
        oscSaw.start(time);
        oscSaw.stop(time + duration);
        noiseSource.start(time);
        noiseSource.stop(time + 0.04);
      };

      // Happy energetic puppy bark sequence: "Arf! ... Arf-arf!"
      triggerBark(now, 720, 0.09, 0.28);
      triggerBark(now + 0.11, 860, 0.11, 0.32);

      if (variation === 'happy') {
        triggerBark(now + 0.24, 940, 0.08, 0.22);
      }
    } catch {
      // AudioContext state handling
    }
  }

  /** Dialogue character typewriter blip with pitch varied by character type */
  public playTextBeep(speakerType: string = 'default') {
    if (this.isMuted || this.isSfxMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = this.ctx.currentTime;

      if (speakerType === 'pet') {
        // Cute micro-bark yip with downward canine pitch drop
        const startFreq = 780 + (Math.random() * 80 - 40);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(startFreq, t);
        osc.frequency.exponentialRampToValueAtTime(startFreq * 0.7, t + 0.045);

        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(t);
        osc.stop(t + 0.045);
        return;
      }

      let baseFreq = 480;
      if (speakerType === 'scientist') baseFreq = 220; // Deep low-frequency professor rumble
      else if (speakerType === 'gymleader') baseFreq = 260; // Deep masculine punch
      else if (speakerType === 'nurse') baseFreq = 680;
      else if (speakerType === 'arcade') baseFreq = 620;

      // Randomize slightly for authentic animal crossing / undertale voice chatter
      const freq = baseFreq + (Math.random() * 60 - 30);

      osc.type = speakerType === 'nurse' ? 'triangle' : 'square';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.2, t + 0.035);

      gain.gain.setValueAtTime(0.06, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.035);
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

  /** Pokémon Battle: Normal attack hit impact */
  public playBattleHit() {
    if (this.isMuted || this.isSfxMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(220, t);
      osc.frequency.exponentialRampToValueAtTime(60, t + 0.12);

      gain.gain.setValueAtTime(0.22, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.12);
    } catch {
      // ignore
    }
  }

  /** Pokémon Battle: "It's super effective!" explosive hit */
  public playBattleSuperEffective() {
    if (this.isMuted || this.isSfxMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const t = this.ctx.currentTime;
      // High pitch attack beam + heavy bass impact
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, t);
      osc.frequency.exponentialRampToValueAtTime(120, t + 0.22);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.22);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.22);
    } catch {
      // ignore
    }
  }

  /** Pokémon Battle: Stat Buff / Architecture Boost chime */
  public playBattleBuff() {
    if (this.isMuted || this.isSfxMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const notes = [440, 554.37, 659.25, 880, 1108.73];
      const now = this.ctx.currentTime;
      notes.forEach((freq, i) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + i * 0.05;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.16, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(t);
        osc.stop(t + 0.1);
      });
    } catch {
      // ignore
    }
  }

  /** Pokémon Battle: Master Ball Catch / Hire Fanfare */
  public playBallCatch() {
    if (this.isMuted || this.isSfxMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      // 3 rhythmic wiggles then star click
      const now = this.ctx.currentTime;
      const wiggles = [0, 0.4, 0.8];
      wiggles.forEach((offset) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + offset;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, t);
        osc.frequency.exponentialRampToValueAtTime(659.25, t + 0.08);

        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(t);
        osc.stop(t + 0.15);
      });

      // Victory chime at t + 1.2s
      setTimeout(() => {
        this.playFanfare();
      }, 1200);
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

  /** Pre-warmed noise buffer provider */
  private getNoiseBuffer(): AudioBuffer | null {
    if (this.cachedNoiseBuffer) return this.cachedNoiseBuffer;
    this.cachedNoiseBuffer = this.createNoiseBuffer(1.0);
    return this.cachedNoiseBuffer;
  }

  /**
   * Authentic Studio-Mastered Acoustic Beatbox Synthesizer
   * Produces loud, punchy, authentic human vocal percussion with zero latency
   * Designed specifically for real-time MPC-style finger drumming!
   */
  public playBeatboxSound(type: 'kick' | 'snare' | 'hihat' | 'scratch' | 'throatbass' | 'click') {
    if (this.isMuted || this.isSfxMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      // Route through the dedicated beatbox compressor bus for maximum punch and zero clipping
      const dest = this.beatboxCompressor || this.beatboxBus || this.sfxGain;
      if (!dest) return;

      if (type === 'kick') {
        // 1. Beatbox Lip Kick ("B" Plosive):
        // Punchy sub-bass chest thump + lip air puff transient + warm low-end drive

        // A. Sub-bass chest thump (Sine wave with fast pitch plunge)
        const subOsc = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(260, t);
        subOsc.frequency.exponentialRampToValueAtTime(85, t + 0.03);
        subOsc.frequency.exponentialRampToValueAtTime(42, t + 0.18);

        subGain.gain.setValueAtTime(1.0, t);
        subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

        subOsc.connect(subGain);
        subGain.connect(dest);
        subOsc.start(t);
        subOsc.stop(t + 0.22);

        // B. Mid punch / mouth cavity harmonic (Triangle wave)
        const punchOsc = this.ctx.createOscillator();
        const punchGain = this.ctx.createGain();
        punchOsc.type = 'triangle';
        punchOsc.frequency.setValueAtTime(180, t);
        punchOsc.frequency.exponentialRampToValueAtTime(55, t + 0.07);

        punchGain.gain.setValueAtTime(0.75, t);
        punchGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

        punchOsc.connect(punchGain);
        punchGain.connect(dest);
        punchOsc.start(t);
        punchOsc.stop(t + 0.08);

        // C. Acoustic Lip Pop / Air Plosive (Low-pass noise burst)
        const noiseBuffer = this.getNoiseBuffer();
        if (noiseBuffer) {
          const noise = this.ctx.createBufferSource();
          noise.buffer = noiseBuffer;

          const filter = this.ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(480, t);
          filter.frequency.linearRampToValueAtTime(140, t + 0.05);

          const noiseGain = this.ctx.createGain();
          noiseGain.gain.setValueAtTime(0.85, t);
          noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

          noise.connect(filter);
          filter.connect(noiseGain);
          noiseGain.connect(dest);

          noise.start(t);
          noise.stop(t + 0.05);
        }
      } else if (type === 'snare') {
        // 2. Beatbox K-Snare / "Psh" Snare:
        // Acoustic tongue-palate crack transient + resonant hollow mouth bandpass + sizzling air spray

        // A. Sharp tongue-palate crack transient (fast downward chirp)
        const crackOsc = this.ctx.createOscillator();
        const crackGain = this.ctx.createGain();
        crackOsc.type = 'triangle';
        crackOsc.frequency.setValueAtTime(1600, t);
        crackOsc.frequency.exponentialRampToValueAtTime(180, t + 0.025);

        crackGain.gain.setValueAtTime(0.9, t);
        crackGain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

        crackOsc.connect(crackGain);
        crackGain.connect(dest);
        crackOsc.start(t);
        crackOsc.stop(t + 0.035);

        // B. Acoustic mouth body pop
        const bodyOsc = this.ctx.createOscillator();
        const bodyGain = this.ctx.createGain();
        bodyOsc.type = 'sine';
        bodyOsc.frequency.setValueAtTime(320, t);
        bodyOsc.frequency.exponentialRampToValueAtTime(95, t + 0.07);

        bodyGain.gain.setValueAtTime(0.65, t);
        bodyGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

        bodyOsc.connect(bodyGain);
        bodyGain.connect(dest);
        bodyOsc.start(t);
        bodyOsc.stop(t + 0.08);

        // C. Resonant hollow "K" acoustic noise spray
        const noiseBuffer = this.getNoiseBuffer();
        if (noiseBuffer) {
          const noise = this.ctx.createBufferSource();
          noise.buffer = noiseBuffer;

          // Bandpass centered at 3400Hz for the distinctive acoustic "K" snap
          const bandpass = this.ctx.createBiquadFilter();
          bandpass.type = 'bandpass';
          bandpass.frequency.setValueAtTime(3400, t);
          bandpass.Q.setValueAtTime(2.4, t);

          const noiseGain = this.ctx.createGain();
          noiseGain.gain.setValueAtTime(0.95, t);
          noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

          noise.connect(bandpass);
          bandpass.connect(noiseGain);
          noiseGain.connect(dest);

          noise.start(t);
          noise.stop(t + 0.16);
        }
      } else if (type === 'hihat') {
        // 3. Beatbox Hi-Hat (Vocal "Ts" Sound):
        // Ultra-crisp, bright dental burst designed for rapid 16th-note drum rolls
        const noiseBuffer = this.getNoiseBuffer();
        if (noiseBuffer) {
          const noise = this.ctx.createBufferSource();
          noise.buffer = noiseBuffer;

          const filter = this.ctx.createBiquadFilter();
          filter.type = 'highpass';
          filter.frequency.setValueAtTime(7600, t);
          filter.Q.setValueAtTime(2.8, t);

          const gain = this.ctx.createGain();
          gain.gain.setValueAtTime(0.9, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

          noise.connect(filter);
          filter.connect(gain);
          gain.connect(dest);

          noise.start(t);
          noise.stop(t + 0.045);
        }

        // Dental click needle attack
        const clickOsc = this.ctx.createOscillator();
        const clickGain = this.ctx.createGain();
        clickOsc.type = 'sine';
        clickOsc.frequency.setValueAtTime(9500, t);
        clickGain.gain.setValueAtTime(0.5, t);
        clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.008);

        clickOsc.connect(clickGain);
        clickGain.connect(dest);
        clickOsc.start(t);
        clickOsc.stop(t + 0.008);
      } else if (type === 'scratch') {
        // 4. Beatbox Vocal Turntable Scratch ("Wikki-Wikki"):
        // Expressive push-pull pitch sweep through resonant mouth formant filter
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(280, t);
        osc.frequency.linearRampToValueAtTime(920, t + 0.05); // push
        osc.frequency.linearRampToValueAtTime(360, t + 0.10); // pull
        osc.frequency.linearRampToValueAtTime(780, t + 0.15); // flick

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1400, t);
        filter.frequency.linearRampToValueAtTime(1900, t + 0.06);
        filter.frequency.linearRampToValueAtTime(1200, t + 0.15);
        filter.Q.setValueAtTime(5.5, t);

        gain.gain.setValueAtTime(0.85, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.18);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(dest);

        osc.start(t);
        osc.stop(t + 0.18);
      } else if (type === 'throatbass') {
        // 5. Throat Bass (Deep sub-harmonic vocal vibration):
        // Dual detuned oscillators for heavy acoustic rumble + resonant vocal tract filtering
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        // Guttural false-cord vibration: 55Hz base + octave overtone
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(55, t);
        osc1.frequency.linearRampToValueAtTime(52, t + 0.32);

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(110, t);
        osc2.frequency.linearRampToValueAtTime(104, t + 0.32);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(440, t);
        filter.Q.setValueAtTime(4.2, t);

        gain.gain.setValueAtTime(0.95, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(dest);

        osc1.start(t);
        osc2.start(t);
        osc1.stop(t + 0.35);
        osc2.stop(t + 0.35);
      } else if (type === 'click') {
        // 6. Tongue Click / Rimshot ("Ka" Click):
        // Ultra-snappy acoustic vacuum pop with hollow mouth resonance
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(2400, t);
        osc.frequency.exponentialRampToValueAtTime(420, t + 0.018);

        gain.gain.setValueAtTime(0.9, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(t);
        osc.stop(t + 0.025);

        // Acoustic rim snap transient
        const noiseBuffer = this.getNoiseBuffer();
        if (noiseBuffer) {
          const noise = this.ctx.createBufferSource();
          noise.buffer = noiseBuffer;

          const filter = this.ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(2200, t);
          filter.Q.setValueAtTime(4.0, t);

          const snapGain = this.ctx.createGain();
          snapGain.gain.setValueAtTime(0.7, t);
          snapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.012);

          noise.connect(filter);
          filter.connect(snapGain);
          snapGain.connect(dest);

          noise.start(t);
          noise.stop(t + 0.012);
        }
      }
    } catch {
      // ignore
    }
  }

  /** Crisp metronome tick for rhythm practice */
  public playMetronomeTick(isHigh: boolean = false) {
    if (this.isMuted || this.isSfxMuted) return;
    this.initContext();
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const dest = this.beatboxCompressor || this.beatboxBus || this.sfxGain;
      if (!dest) return;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(isHigh ? 1600 : 880, t);
      gain.gain.setValueAtTime(isHigh ? 0.45 : 0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(t);
      osc.stop(t + 0.035);
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
