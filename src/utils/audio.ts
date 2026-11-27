import type { EmotionId } from '../game/types';

export type SoundType = 'tap' | 'error' | 'success';

let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctx) return null;
  if (!sharedAudioCtx) {
    sharedAudioCtx = new Ctx();
  }
  return sharedAudioCtx;
}

function scheduleNote(
  ctx: AudioContext,
  startOffset: number,
  duration: number,
  freqStart: number,
  freqEnd: number,
  wave: OscillatorType,
  peakGain = 0.14
): void {
  const now = ctx.currentTime + startOffset;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = wave;
  osc.frequency.setValueAtTime(freqStart, now);
  if (freqEnd !== freqStart) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(30, freqEnd), now + duration);
  }
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(peakGain, now + Math.min(0.025, duration * 0.25));
  gain.gain.exponentialRampToValueAtTime(0.002, now + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + duration + 0.02);
}

export function playTone(type: SoundType, muted = false): void {
  if (muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    if (ctx.state === 'suspended') {
      void ctx.resume();
    }

    if (type === 'tap') {
      scheduleNote(ctx, 0, 0.08, 520, 680, 'sine', 0.12);
      return;
    }

    if (type === 'error') {
      scheduleNote(ctx, 0, 0.24, 165, 110, 'sawtooth', 0.13);
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([70, 35, 70]);
      }
      return;
    }

    if (type === 'success') {
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        scheduleNote(ctx, i * 0.085, 0.34, freq, freq, 'triangle', 0.14);
      });
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(110);
      }
    }
  } catch {
    // Audio playback should never throw in restricted browsers
  }
}

export function playEmotionSound(emotionId: EmotionId, muted = false): void {
  if (muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    if (ctx.state === 'suspended') {
      void ctx.resume();
    }

    switch (emotionId) {
      case 'ilo': {
        // Cheerful bouncy major arpeggio
        [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
          scheduleNote(ctx, i * 0.075, 0.22, f, f * 1.03, 'triangle', 0.15);
        });
        break;
      }
      case 'rakkaus': {
        // Warm gentle rising third & fifth chime
        scheduleNote(ctx, 0, 0.42, 440, 440, 'sine', 0.12);
        scheduleNote(ctx, 0.12, 0.48, 554.37, 554.37, 'sine', 0.11);
        scheduleNote(ctx, 0.24, 0.56, 659.25, 659.25, 'sine', 0.12);
        break;
      }
      case 'viha': {
        // Firm low double thud
        scheduleNote(ctx, 0, 0.16, 175, 130, 'sawtooth', 0.14);
        scheduleNote(ctx, 0.19, 0.22, 160, 110, 'sawtooth', 0.15);
        break;
      }
      case 'raivo': {
        // Intense rumbling low bursts
        scheduleNote(ctx, 0, 0.14, 150, 95, 'sawtooth', 0.17);
        scheduleNote(ctx, 0.12, 0.14, 195, 105, 'square', 0.11);
        scheduleNote(ctx, 0.24, 0.26, 140, 82, 'sawtooth', 0.18);
        break;
      }
      case 'arsytys': {
        // Short prickly staccato buzzes
        [0, 0.11, 0.22].forEach((offset, idx) => {
          scheduleNote(ctx, offset, 0.08, 340 + idx * 45, 290, 'sawtooth', 0.11);
        });
        break;
      }
      case 'harmitus': {
        // Soft descending sigh
        scheduleNote(ctx, 0, 0.24, 415, 349, 'sine', 0.12);
        scheduleNote(ctx, 0.2, 0.34, 349, 293, 'sine', 0.11);
        break;
      }
      case 'pettymys': {
        // Slow deflating slide down
        scheduleNote(ctx, 0, 0.55, 392, 220, 'triangle', 0.13);
        break;
      }
      case 'suru': {
        // Gentle slow minor descent
        scheduleNote(ctx, 0, 0.32, 440, 430, 'sine', 0.11);
        scheduleNote(ctx, 0.28, 0.34, 349.23, 342, 'sine', 0.11);
        scheduleNote(ctx, 0.56, 0.48, 293.66, 280, 'sine', 0.12);
        break;
      }
      case 'pelko': {
        // Fast trembling high shiver
        [0, 0.07, 0.14, 0.21, 0.28].forEach((offset, idx) => {
          const f = idx % 2 === 0 ? 587 : 622;
          scheduleNote(ctx, offset, 0.065, f, f, 'sine', 0.12);
        });
        break;
      }
      case 'ahdistus': {
        // Fast uneven heartbeat + tense high hum
        scheduleNote(ctx, 0, 0.1, 110, 75, 'triangle', 0.17);
        scheduleNote(ctx, 0.14, 0.1, 118, 78, 'triangle', 0.15);
        scheduleNote(ctx, 0.32, 0.1, 110, 75, 'triangle', 0.17);
        scheduleNote(ctx, 0.46, 0.1, 118, 78, 'triangle', 0.15);
        scheduleNote(ctx, 0.05, 0.52, 466, 440, 'sine', 0.07);
        break;
      }
      case 'hapea': {
        // Quiet shy downward tuck
        scheduleNote(ctx, 0, 0.18, 370, 311, 'sine', 0.09);
        scheduleNote(ctx, 0.17, 0.26, 293, 246, 'sine', 0.08);
        break;
      }
    }
  } catch {
    // Audio playback should never throw in restricted browsers
  }
}
