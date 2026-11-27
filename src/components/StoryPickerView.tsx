import React, { useEffect, useState } from 'react';
import { SCENARIOS } from '../game/data';
import { formatStorySituation, getCharacter } from '../game/rules';
import type { CharacterId } from '../game/types';
import { speakFinnish, stopSpeech } from '../utils/speech';
import {
  ArrowLeftIcon,
  BookOpenIcon,
  CheckCircleIcon,
  StopIcon,
  VolumeOnIcon,
} from './Icons';

interface StoryPickerViewProps {
  unlockedStickers: string[];
  activeScenarioIndex: number;
  charAId: CharacterId;
  charBId: CharacterId;
  muted: boolean;
  onSelectScenario: (idx: number) => void;
  onChangeCharacters: () => void;
  onBack: () => void;
}

export const StoryPickerView: React.FC<StoryPickerViewProps> = ({
  unlockedStickers,
  activeScenarioIndex,
  charAId,
  charBId,
  muted,
  onSelectScenario,
  onChangeCharacters,
  onBack,
}) => {
  const [speakingIdx, setSpeakingIdx] = useState<number | null>(null);
  const charA = getCharacter(charAId);
  const charB = getCharacter(charBId);

  useEffect(() => {
    if (muted) {
      stopSpeech();
      setSpeakingIdx(null);
    }
  }, [muted]);

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  const handleTogglePreview = (idx: number) => {
    if (speakingIdx === idx) {
      stopSpeech();
      setSpeakingIdx(null);
      return;
    }
    const sc = SCENARIOS[idx];
    const spokenSituation = formatStorySituation(sc.situation, charA, charB);
    setSpeakingIdx(idx);
    const started = speakFinnish(`${sc.title}. ${spokenSituation}`, {
      muted,
      onEnd: () => setSpeakingIdx((curr) => (curr === idx ? null : curr)),
    });
    if (!started) {
      setSpeakingIdx(null);
    }
  };

  return (
    <section
      aria-label="Valitse tarina"
      className="flex flex-col gap-6 rounded-3xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 sm:p-8 shadow-[var(--shadow-card)]"
    >
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <BookOpenIcon className="h-7 w-7 text-[var(--accent-primary)] shrink-0" />
          <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">
            Valitse tarina
          </h1>
        </div>

        <button
          type="button"
          onClick={() => {
            stopSpeech();
            onChangeCharacters();
          }}
          className="tactile-btn inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-subtle)] px-4 py-2 text-sm sm:text-base font-bold text-[var(--text-primary)] hover:brightness-95 whitespace-nowrap"
        >
          {charA.name.split(' ')[0]} & {charB.name.split(' ')[0]} · Vaihda
        </button>
      </div>

      {/* 8-Story Selection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {SCENARIOS.map((sc, idx) => {
          const solved = unlockedStickers.includes(sc.id);
          const isCurrent = idx === activeScenarioIndex;
          const isSpeaking = speakingIdx === idx;
          const emoji = sc.sticker.split(' ')[0];
          const situationPreview = formatStorySituation(sc.situation, charA, charB);

          return (
            <div
              key={sc.id}
              className={`relative flex flex-col justify-between rounded-2xl border-2 p-4 transition-colors ${
                solved
                  ? 'border-[var(--accent-secondary)]/60 bg-[var(--accent-secondary-soft)]/50'
                  : isCurrent
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-primary-soft)]/50'
                    : 'border-[var(--border-hairline)] bg-[var(--bg-subtle)] hover:border-[var(--accent-primary)]/50'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-3xl leading-none" aria-hidden="true">
                  {emoji}
                </span>

                <button
                  type="button"
                  onClick={() => handleTogglePreview(idx)}
                  aria-label={
                    isSpeaking
                      ? `Pysäytä: ${sc.title}`
                      : `Kuuntele tarina: ${sc.title}`
                  }
                  aria-pressed={isSpeaking}
                  className={`tactile-btn inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border ${
                    isSpeaking
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-white'
                      : 'border-[var(--border-hairline)] bg-[var(--bg-surface)] text-[var(--accent-primary)] hover:bg-[var(--accent-primary-soft)]'
                  }`}
                >
                  {isSpeaking ? (
                    <StopIcon className="h-4 w-4" />
                  ) : (
                    <VolumeOnIcon className="h-4 w-4" />
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  stopSpeech();
                  onSelectScenario(idx);
                }}
                aria-label={`Pelaa tarina ${idx + 1}: ${sc.title}`}
                className="tactile-btn flex flex-1 flex-col items-start gap-2 rounded-xl text-left focus-visible:outline-none"
              >
                <div className="flex items-center gap-1.5 text-sm font-semibold text-[var(--text-muted)] tabular-nums">
                  <span>
                    {idx + 1}/{SCENARIOS.length}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1">
                    {solved && (
                      <CheckCircleIcon className="h-4 w-4 text-[var(--accent-secondary)]" />
                    )}
                    {solved ? 'Valmis' : 'Uusi'}
                  </span>
                </div>

                <h2 className="font-display text-lg sm:text-xl font-extrabold text-[var(--text-primary)] leading-snug">
                  {sc.title}
                </h2>

                <p className="text-sm leading-snug text-[var(--text-muted)] line-clamp-2">
                  {situationPreview}
                </p>

                <span className="mt-auto pt-2 text-sm sm:text-base font-bold text-[var(--accent-primary)]">
                  Pelaa →
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer Back Button */}
      <button
        type="button"
        onClick={() => {
          stopSpeech();
          onBack();
        }}
        className="tactile-btn inline-flex min-h-[54px] w-full sm:w-auto sm:self-center items-center justify-center gap-2 rounded-2xl bg-[var(--accent-primary)] px-7 py-3 text-lg font-bold text-white shadow-[0_5px_0_var(--accent-primary-depth)] hover:bg-[var(--accent-primary-hover)]"
      >
        <ArrowLeftIcon className="h-5 w-5" />
        <span>Takaisin</span>
      </button>
    </section>
  );
};
