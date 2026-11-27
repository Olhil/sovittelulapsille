import { sanitizeSavedConflicts } from '../game/conflictAnalysis';
import { sanitizeStickerIds } from '../game/rules';
import type { SavedCustomConflict } from '../game/types';

const PROGRESS_KEY = 'tunnetutka_progress_v1';
const LEGACY_KEY = 'emo_stickers_fi';
const MUTE_KEY = 'tunnetutka_muted_v1';
const CUSTOM_CONFLICTS_KEY = 'tunnetutka_custom_conflicts_v1';
const INTEGRITY_SALT = 'tunnetutka-local-integrity-v1';

interface StoredProgress {
  v: 1;
  stickers: string[];
  digest?: string;
}

async function computeDigest(stickers: string[]): Promise<string | undefined> {
  if (typeof window === 'undefined' || !window.crypto?.subtle) {
    return undefined;
  }
  try {
    const payload = `${INTEGRITY_SALT}:${stickers.join(',')}`;
    const bytes = new TextEncoder().encode(payload);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', bytes);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return undefined;
  }
}

export async function loadProgress(): Promise<string[]> {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<StoredProgress>;
      if (parsed && parsed.v === 1 && Array.isArray(parsed.stickers)) {
        const clean = sanitizeStickerIds(parsed.stickers);
        if (parsed.digest) {
          const expected = await computeDigest(clean);
          if (expected && expected !== parsed.digest) {
            return [];
          }
        }
        return clean;
      }
    }

    const legacyRaw = window.localStorage.getItem(LEGACY_KEY);
    if (legacyRaw) {
      const legacyParsed = JSON.parse(legacyRaw);
      const clean = sanitizeStickerIds(legacyParsed);
      await saveProgress(clean);
      return clean;
    }
  } catch {
    return [];
  }
  return [];
}

export async function saveProgress(stickers: string[]): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const clean = sanitizeStickerIds(stickers);
    const digest = await computeDigest(clean);
    const payload: StoredProgress = {
      v: 1,
      stickers: clean,
      ...(digest ? { digest } : {}),
    };
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(payload));
    window.localStorage.setItem(LEGACY_KEY, JSON.stringify(clean));
  } catch {
    // Ignore storage quota / private mode failures cleanly
  }
}

export function clearAllLocalProgress(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(PROGRESS_KEY);
    window.localStorage.removeItem(LEGACY_KEY);
    window.localStorage.removeItem(MUTE_KEY);
    window.localStorage.removeItem(CUSTOM_CONFLICTS_KEY);
  } catch {
    // Ignore
  }
}

export function loadCustomConflicts(): SavedCustomConflict[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(CUSTOM_CONFLICTS_KEY);
    if (!raw) return [];
    return sanitizeSavedConflicts(JSON.parse(raw));
  } catch {
    return [];
  }
}

export function saveCustomConflicts(items: SavedCustomConflict[]): void {
  if (typeof window === 'undefined') return;
  try {
    const clean = sanitizeSavedConflicts(items);
    window.localStorage.setItem(CUSTOM_CONFLICTS_KEY, JSON.stringify(clean));
  } catch {
    // Ignore storage quota / private mode failures cleanly
  }
}

export function loadMutedPreference(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(MUTE_KEY) === '1';
  } catch {
    return false;
  }
}

export function saveMutedPreference(muted: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(MUTE_KEY, muted ? '1' : '0');
  } catch {
    // Ignore
  }
}
