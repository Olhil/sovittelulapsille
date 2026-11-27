import type { Emotion } from '../game/types';

export interface SpeakOptions {
  muted?: boolean;
  rate?: number;
  pitch?: number;
  onStart?: () => void;
  onEnd?: () => void;
}

let activeSpeechToken = 0;
let cachedFinnishVoice: SpeechSynthesisVoice | null = null;

function resolveFinnishVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return null;
  }
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return cachedFinnishVoice;

  const exactLocal = voices.find(
    (v) => v.lang.toLowerCase() === 'fi-fi' && v.localService
  );
  const exactAny = voices.find((v) => v.lang.toLowerCase() === 'fi-fi');
  const prefixAny = voices.find((v) => v.lang.toLowerCase().startsWith('fi'));

  cachedFinnishVoice = exactLocal ?? exactAny ?? prefixAny ?? null;
  return cachedFinnishVoice;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  resolveFinnishVoice();
  if (typeof window.speechSynthesis.addEventListener === 'function') {
    window.speechSynthesis.addEventListener('voiceschanged', () => {
      resolveFinnishVoice();
    });
  }
}

export function isSpeechSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    typeof SpeechSynthesisUtterance !== 'undefined'
  );
}

export function stopSpeech(): void {
  activeSpeechToken += 1;
  if (!isSpeechSupported()) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    // Ignore restricted browser errors
  }
}

export function speakFinnish(text: string, options: SpeakOptions = {}): boolean {
  const { muted = false, rate = 0.92, pitch = 1.04, onStart, onEnd } = options;

  stopSpeech();

  const cleaned = text.replace(/[«»]/g, '').trim();
  if (muted || !cleaned || !isSpeechSupported()) {
    onEnd?.();
    return false;
  }

  const token = activeSpeechToken;

  try {
    const utterance = new SpeechSynthesisUtterance(cleaned);
    utterance.lang = 'fi-FI';
    utterance.rate = rate;
    utterance.pitch = pitch;

    const fiVoice = resolveFinnishVoice();
    if (fiVoice) {
      utterance.voice = fiVoice;
    }

    const handleFinish = () => {
      if (token === activeSpeechToken) {
        onEnd?.();
      }
    };

    utterance.onstart = () => {
      if (token === activeSpeechToken) {
        onStart?.();
      }
    };
    utterance.onend = handleFinish;
    utterance.onerror = handleFinish;

    window.speechSynthesis.speak(utterance);
    return true;
  } catch {
    onEnd?.();
    return false;
  }
}

export function buildEmotionCardSpeechText(emotion: Emotion): string {
  return [
    `${emotion.label}.`,
    `${emotion.houseTitle}.`,
    `Missä tuntuu kehossa? ${emotion.bodyText}`,
    `Mitä tunne kertoo? ${emotion.needText}`,
    `Miten voin auttaa? ${emotion.helpText}`,
  ].join(' ');
}

export function buildEmotionPreviewSpeechText(emotion: Emotion): string {
  return `${emotion.label}. ${emotion.houseTitle}. ${emotion.bodyText}`;
}
