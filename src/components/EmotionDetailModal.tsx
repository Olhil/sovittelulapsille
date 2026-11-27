import React, { useEffect, useState } from 'react';
import { CHARACTERS } from '../game/data';
import type { Emotion } from '../game/types';
import { playEmotionSound } from '../utils/audio';
import {
  buildEmotionCardSpeechText,
  speakFinnish,
  stopSpeech,
} from '../utils/speech';
import { BodilyMapSVG } from './BodilyMapSVG';
import { CharacterAvatar } from './CharacterAvatar';
import { MusicNoteIcon, StopIcon, VolumeOnIcon, XIcon } from './Icons';

type SpeakingTarget = 'all' | 'body' | 'need' | 'help' | 'region' | null;

interface EmotionDetailModalProps {
  emotion: Emotion | null;
  muted: boolean;
  onClose: () => void;
}

export const EmotionDetailModal: React.FC<EmotionDetailModalProps> = ({
  emotion,
  muted,
  onClose,
}) => {
  const [speakingTarget, setSpeakingTarget] = useState<SpeakingTarget>(null);

  useEffect(() => {
    if (!emotion) {
      stopSpeech();
      setSpeakingTarget(null);
      return;
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        stopSpeech();
        setSpeakingTarget(null);
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      stopSpeech();
      setSpeakingTarget(null);
    };
  }, [emotion, onClose]);

  useEffect(() => {
    if (muted) {
      stopSpeech();
      setSpeakingTarget(null);
    }
  }, [muted]);

  if (!emotion) return null;

  const handleToggleSpeech = (target: Exclude<SpeakingTarget, null>, text: string) => {
    if (speakingTarget === target) {
      stopSpeech();
      setSpeakingTarget(null);
      return;
    }
    setSpeakingTarget(target);
    const started = speakFinnish(text, {
      muted,
      onEnd: () => setSpeakingTarget(null),
    });
    if (!started) {
      setSpeakingTarget(null);
    }
  };

  const handleClose = () => {
    stopSpeech();
    setSpeakingTarget(null);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="emotion-detail-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-3 sm:p-5"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] shadow-2xl">
        {/* Header */}
        <div
          className="flex items-center justify-between gap-3 border-b border-[var(--border-hairline)] px-4 sm:px-6 py-3.5"
          style={{ backgroundColor: `${emotion.accentColor}16` }}
        >
          <div className="flex items-center gap-3">
            <CharacterAvatar
              character={CHARACTERS[0]}
              emotionId={emotion.id}
              size={54}
            />
            <div>
              <div className="text-sm font-bold uppercase tracking-wide text-[var(--text-muted)]">
                {emotion.houseTitle}
              </div>
              <h2
                id="emotion-detail-title"
                className="font-display text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]"
              >
                {emotion.emoji} {emotion.label}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Sulje tunnekortti"
            className="tactile-btn inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:brightness-95"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="grid grid-cols-1 gap-5 overflow-y-auto p-4 sm:p-6 md:grid-cols-12 md:items-start">
          {/* Interactive Scientific Bodily Map */}
          <div className="md:col-span-5">
            <BodilyMapSVG
              emotionId={emotion.id}
              isRegionSpeaking={speakingTarget === 'region'}
              onSpeakRegion={(label, text) =>
                handleToggleSpeech('region', `${label}. ${text}`)
              }
            />
          </div>

          {/* 3 Selkokieli Info Blocks + Voiceover & Sound Controls */}
          <div className="md:col-span-7 flex flex-col gap-3">
            <div
              className={`rounded-2xl border p-4 space-y-1 transition-colors ${
                speakingTarget === 'body'
                  ? 'border-[var(--accent-primary)] bg-[var(--accent-primary-soft)]'
                  : 'border-[var(--border-hairline)] bg-[var(--bg-subtle)]'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display text-base sm:text-lg font-extrabold text-[var(--accent-primary)]">
                  Missä tuntuu kehossa?
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    handleToggleSpeech(
                      'body',
                      `Missä tuntuu kehossa? ${emotion.bodyText}`
                    )
                  }
                  aria-label={
                    speakingTarget === 'body'
                      ? 'Pysäytä puhe'
                      : 'Kuuntele: Missä tuntuu kehossa?'
                  }
                  aria-pressed={speakingTarget === 'body'}
                  className={`tactile-btn inline-flex min-h-[40px] min-w-[40px] shrink-0 items-center justify-center rounded-xl border ${
                    speakingTarget === 'body'
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-white'
                      : 'border-[var(--border-hairline)] bg-[var(--bg-surface)] text-[var(--accent-primary)] hover:bg-[var(--accent-primary-soft)]'
                  }`}
                >
                  {speakingTarget === 'body' ? (
                    <StopIcon className="h-4 w-4" />
                  ) : (
                    <VolumeOnIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-base sm:text-lg leading-relaxed text-[var(--text-primary)]">
                {emotion.bodyText}
              </p>
            </div>

            <div
              className={`rounded-2xl border p-4 space-y-1 transition-colors ${
                speakingTarget === 'need'
                  ? 'border-[var(--accent-warning)] bg-[var(--accent-warning-soft)]'
                  : 'border-[var(--border-hairline)] bg-[var(--bg-subtle)]'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display text-base sm:text-lg font-extrabold text-[var(--accent-warning)]">
                  Mitä tunne kertoo?
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    handleToggleSpeech(
                      'need',
                      `Mitä tunne kertoo? ${emotion.needText}`
                    )
                  }
                  aria-label={
                    speakingTarget === 'need'
                      ? 'Pysäytä puhe'
                      : 'Kuuntele: Mitä tunne kertoo?'
                  }
                  aria-pressed={speakingTarget === 'need'}
                  className={`tactile-btn inline-flex min-h-[40px] min-w-[40px] shrink-0 items-center justify-center rounded-xl border ${
                    speakingTarget === 'need'
                      ? 'border-[var(--accent-warning)] bg-[var(--accent-warning)] text-white'
                      : 'border-[var(--border-hairline)] bg-[var(--bg-surface)] text-[var(--accent-warning)] hover:bg-[var(--accent-warning-soft)]'
                  }`}
                >
                  {speakingTarget === 'need' ? (
                    <StopIcon className="h-4 w-4" />
                  ) : (
                    <VolumeOnIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-base sm:text-lg leading-relaxed text-[var(--text-primary)]">
                {emotion.needText}
              </p>
            </div>

            <div
              className={`rounded-2xl border p-4 space-y-1 transition-colors ${
                speakingTarget === 'help'
                  ? 'border-[var(--accent-secondary)] bg-[var(--accent-secondary-soft)]'
                  : 'border-[var(--border-hairline)] bg-[var(--bg-subtle)]'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display text-base sm:text-lg font-extrabold text-[var(--accent-secondary)]">
                  Miten voin auttaa?
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    handleToggleSpeech(
                      'help',
                      `Miten voin auttaa? ${emotion.helpText}`
                    )
                  }
                  aria-label={
                    speakingTarget === 'help'
                      ? 'Pysäytä puhe'
                      : 'Kuuntele: Miten voin auttaa?'
                  }
                  aria-pressed={speakingTarget === 'help'}
                  className={`tactile-btn inline-flex min-h-[40px] min-w-[40px] shrink-0 items-center justify-center rounded-xl border ${
                    speakingTarget === 'help'
                      ? 'border-[var(--accent-secondary)] bg-[var(--accent-secondary)] text-white'
                      : 'border-[var(--border-hairline)] bg-[var(--bg-surface)] text-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-soft)]'
                  }`}
                >
                  {speakingTarget === 'help' ? (
                    <StopIcon className="h-4 w-4" />
                  ) : (
                    <VolumeOnIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-base sm:text-lg leading-relaxed text-[var(--text-primary)]">
                {emotion.helpText}
              </p>
            </div>

            <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() =>
                  handleToggleSpeech('all', buildEmotionCardSpeechText(emotion))
                }
                aria-pressed={speakingTarget === 'all'}
                className={`tactile-btn inline-flex min-h-[54px] w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-lg font-bold text-white ${
                  speakingTarget === 'all'
                    ? 'bg-[var(--accent-danger)] shadow-[0_5px_0_#991B1B] hover:brightness-95'
                    : 'bg-[var(--accent-primary)] shadow-[0_5px_0_var(--accent-primary-depth)] hover:bg-[var(--accent-primary-hover)]'
                }`}
              >
                {speakingTarget === 'all' ? (
                  <>
                    <StopIcon className="h-5 w-5 shrink-0" />
                    <span>Pysäytä</span>
                  </>
                ) : (
                  <>
                    <VolumeOnIcon className="h-5 w-5 shrink-0" />
                    <span>Kuuntele kortti</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  stopSpeech();
                  setSpeakingTarget(null);
                  playEmotionSound(emotion.id, muted);
                }}
                className="tactile-btn inline-flex min-h-[54px] w-full items-center justify-center gap-2 rounded-2xl border-2 border-[var(--border-hairline)] bg-[var(--bg-subtle)] px-4 py-3 text-lg font-bold text-[var(--text-primary)] hover:border-[var(--accent-primary)]/50 hover:brightness-95"
              >
                <MusicNoteIcon className="h-5 w-5 shrink-0 text-[var(--accent-primary)]" />
                <span>Tunteen ääni</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
