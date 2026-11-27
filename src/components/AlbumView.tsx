import React from 'react';
import { SCENARIOS } from '../game/data';
import { ArrowLeftIcon, LockIcon, TrophyIcon } from './Icons';

interface AlbumViewProps {
  unlockedStickers: string[];
  onPlayScenario: (idx: number) => void;
  onBack: () => void;
}

export const AlbumView: React.FC<AlbumViewProps> = ({
  unlockedStickers,
  onPlayScenario,
  onBack,
}) => {
  return (
    <section
      aria-label="Tarra-albumi"
      className="flex flex-col gap-6 rounded-3xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6 sm:p-8 shadow-[var(--shadow-card)]"
    >
      <div className="text-center">
        <div className="inline-flex items-center justify-center gap-2.5 font-display text-2xl sm:text-4xl font-extrabold text-[var(--text-primary)]">
          <TrophyIcon className="h-8 w-8 text-[var(--accent-warning)]" />
          <h1>Omat tarrat</h1>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
        {SCENARIOS.map((sc, idx) => {
          const unlocked = unlockedStickers.includes(sc.id);
          const emoji = sc.sticker.split(' ')[0];
          const stickerLabel = sc.sticker.substring(emoji.length).trim();

          return (
            <button
              key={sc.id}
              type="button"
              onClick={() => onPlayScenario(idx)}
              aria-label={
                unlocked
                  ? `${stickerLabel} (avattu) — pelaa tarina ${sc.title}`
                  : `${sc.title} (lukittu) — pelaa avataksesi`
              }
              className={`tactile-btn flex min-h-[140px] flex-col items-center justify-center gap-2 rounded-2xl border-2 p-4 text-center ${
                unlocked
                  ? 'border-[var(--accent-warning)] bg-[var(--accent-warning-soft)]'
                  : 'border-[var(--border-hairline)] bg-[var(--bg-subtle)] hover:border-[var(--accent-primary)]/50'
              }`}
            >
              <span className="text-4xl" aria-hidden="true">
                {unlocked ? emoji : <LockIcon className="h-8 w-8 text-[var(--text-muted)]" />}
              </span>
              <span className="text-base font-bold text-[var(--text-primary)]">
                {unlocked ? stickerLabel : sc.title}
              </span>
              <span className="text-sm font-medium text-[var(--text-muted)]">
                {unlocked ? 'Avattu' : 'Lukittu'}
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onBack}
        className="tactile-btn inline-flex min-h-[54px] w-full sm:w-auto sm:self-center items-center justify-center gap-2 rounded-2xl bg-[var(--accent-primary)] px-7 py-3 text-lg font-bold text-white shadow-[0_5px_0_var(--accent-primary-depth)] hover:bg-[var(--accent-primary-hover)]"
      >
        <ArrowLeftIcon className="h-5 w-5" />
        <span>Takaisin peliin</span>
      </button>
    </section>
  );
};
