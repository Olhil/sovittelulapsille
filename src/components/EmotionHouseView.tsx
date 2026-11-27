import React, { useEffect, useState } from 'react';
import { EMOTIONS } from '../game/data';
import type { Emotion, EmotionId } from '../game/types';
import { playTone } from '../utils/audio';
import {
  buildEmotionPreviewSpeechText,
  speakFinnish,
  stopSpeech,
} from '../utils/speech';
import { EmotionDetailModal } from './EmotionDetailModal';
import { EmotionHouseIllustration } from './EmotionHouseIllustration';
import { ArrowLeftIcon, HomeIcon, StopIcon, VolumeOnIcon } from './Icons';

interface EmotionHouseViewProps {
  muted: boolean;
  onBack: () => void;
}

export const EmotionHouseView: React.FC<EmotionHouseViewProps> = ({
  muted,
  onBack,
}) => {
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [speakingId, setSpeakingId] = useState<EmotionId | null>(null);

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  useEffect(() => {
    if (muted) {
      stopSpeech();
      setSpeakingId(null);
    }
  }, [muted]);

  const handleOpenCard = (emo: Emotion) => {
    stopSpeech();
    setSpeakingId(null);
    playTone('tap', muted);
    setSelectedEmotion(emo);
  };

  const handleSpeakCard = (emo: Emotion) => {
    if (speakingId === emo.id) {
      stopSpeech();
      setSpeakingId(null);
      return;
    }
    setSpeakingId(emo.id);
    const started = speakFinnish(buildEmotionPreviewSpeechText(emo), {
      muted,
      onEnd: () => setSpeakingId(null),
    });
    if (!started) {
      setSpeakingId(null);
    }
  };

  return (
    <section
      aria-label="Tunteiden talo"
      className="flex flex-col gap-5 rounded-3xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 sm:p-7 shadow-[var(--shadow-card)]"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2.5">
          <HomeIcon className="h-7 w-7 text-[var(--accent-primary)]" />
          <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-[var(--text-primary)]">
            Tunteiden talo
          </h1>
        </div>

        <button
          type="button"
          onClick={() => {
            stopSpeech();
            setSpeakingId(null);
            onBack();
          }}
          className="tactile-btn inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-subtle)] px-4 py-2 text-base font-bold text-[var(--text-primary)] hover:brightness-95"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Takaisin</span>
        </button>
      </div>

      {/* 11 Illustrated Emotion Houses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {EMOTIONS.map((emo) => {
          const isSpeaking = speakingId === emo.id;
          return (
            <div
              key={emo.id}
              className={`flex flex-col gap-2.5 rounded-2xl border-2 bg-[var(--bg-subtle)] p-3 transition-colors ${
                isSpeaking
                  ? 'border-[var(--accent-primary)] bg-[var(--accent-primary-soft)]'
                  : 'border-[var(--border-hairline)] hover:border-[var(--accent-primary)]/60'
              }`}
            >
              <button
                type="button"
                onClick={() => handleOpenCard(emo)}
                aria-label={`${emo.label} — ${emo.houseTitle}`}
                className="tactile-btn flex flex-col gap-2.5 text-left rounded-xl"
              >
                <EmotionHouseIllustration emotionId={emo.id} />
              </button>

              <div className="flex items-center justify-between gap-2 px-1">
                <button
                  type="button"
                  onClick={() => handleOpenCard(emo)}
                  className="flex-1 text-left rounded-lg"
                >
                  <div className="font-display text-lg sm:text-xl font-extrabold text-[var(--text-primary)]">
                    {emo.emoji} {emo.label}
                  </div>
                  <div className="text-sm sm:text-base font-semibold text-[var(--text-muted)]">
                    {emo.houseTitle}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSpeakCard(emo)}
                  aria-label={
                    isSpeaking
                      ? `Pysäytä: ${emo.label}`
                      : `Kuuntele kortti: ${emo.label}`
                  }
                  aria-pressed={isSpeaking}
                  className={`tactile-btn inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl border ${
                    isSpeaking
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-white'
                      : 'border-[var(--border-hairline)] bg-[var(--bg-surface)] text-[var(--accent-primary)] hover:bg-[var(--accent-primary-soft)]'
                  }`}
                >
                  {isSpeaking ? (
                    <StopIcon className="h-5 w-5" />
                  ) : (
                    <VolumeOnIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <EmotionDetailModal
        emotion={selectedEmotion}
        muted={muted}
        onClose={() => setSelectedEmotion(null)}
      />
    </section>
  );
};
