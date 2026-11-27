import React, { useState } from 'react';
import { CHARACTERS, TOTAL_STICKERS } from '../game/data';
import type { EmotionId, GameMode, LegalTab } from '../game/types';
import { CharacterAvatar } from './CharacterAvatar';
import {
  BookOpenIcon,
  EditIcon,
  GamepadIcon,
  HandshakeIcon,
  HomeIcon,
  TrophyIcon,
} from './Icons';

interface HomeViewProps {
  stickerCount: number;
  onStartMode: (mode: GameMode) => void;
  onOpenStoryPicker: () => void;
  onOpenCustomConflict: () => void;
  onOpenHouse: () => void;
  onOpenAlbum: () => void;
  onOpenLegalTab: (tab: LegalTab) => void;
}

const PREVIEW_EMOTIONS: EmotionId[] = [
  'ilo',
  'rakkaus',
  'harmitus',
  'viha',
  'ahdistus',
  'hapea',
];

export const HomeView: React.FC<HomeViewProps> = ({
  stickerCount,
  onStartMode,
  onOpenStoryPicker,
  onOpenCustomConflict,
  onOpenHouse,
  onOpenAlbum,
  onOpenLegalTab,
}) => {
  const [foxEmoIndex, setFoxEmoIndex] = useState(0);
  const [bearEmoIndex, setBearEmoIndex] = useState(0);

  return (
    <section
      aria-label="Etusivu"
      className="flex flex-col gap-6 rounded-3xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6 sm:p-8 shadow-[var(--shadow-card)]"
    >
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
        {/* Interactive Character Showcase Stage */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center rounded-3xl border border-[var(--border-hairline)] bg-gradient-to-b from-[var(--bg-stage-top)] to-[var(--bg-stage-bottom)] p-6 sm:p-8 no-select">
          <div className="flex items-center justify-center gap-4 sm:gap-8">
            <button
              type="button"
              onClick={() => setFoxEmoIndex((i) => (i + 1) % PREVIEW_EMOTIONS.length)}
              aria-label={`Vaihda hahmon ${CHARACTERS[0].name} ilmettä`}
              className="tactile-btn flex flex-col items-center gap-2 rounded-2xl p-2 hover:bg-[var(--bg-surface)]/60"
            >
              <CharacterAvatar
                character={CHARACTERS[0]}
                emotionId={PREVIEW_EMOTIONS[foxEmoIndex]}
                size={112}
              />
              <span className="rounded-xl bg-[var(--bg-surface)] px-3.5 py-1.5 text-sm sm:text-base font-bold text-[var(--text-primary)] shadow-sm">
                {CHARACTERS[0].name}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setBearEmoIndex((i) => (i + 1) % PREVIEW_EMOTIONS.length)}
              aria-label={`Vaihda hahmon ${CHARACTERS[1].name} ilmettä`}
              className="tactile-btn flex flex-col items-center gap-2 rounded-2xl p-2 hover:bg-[var(--bg-surface)]/60"
            >
              <CharacterAvatar
                character={CHARACTERS[1]}
                emotionId={PREVIEW_EMOTIONS[bearEmoIndex]}
                size={112}
              />
              <span className="rounded-xl bg-[var(--bg-surface)] px-3.5 py-1.5 text-sm sm:text-base font-bold text-[var(--text-primary)] shadow-sm">
                {CHARACTERS[1].name}
              </span>
            </button>
          </div>
        </div>

        {/* Title Lockup & Actions */}
        <div className="lg:col-span-6 flex flex-col gap-5 text-center lg:text-left">
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] [text-wrap:balance]">
            Auta hahmoja sopimaan!
          </h1>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              data-start="true"
              onClick={() => onStartMode('story')}
              className="tactile-btn inline-flex min-h-[58px] w-full items-center justify-center gap-3 rounded-2xl bg-[var(--accent-primary)] px-6 py-3.5 text-lg sm:text-xl font-bold text-white shadow-[0_5px_0_var(--accent-primary-depth)] hover:bg-[var(--accent-primary-hover)]"
            >
              <GamepadIcon className="h-5 w-5 shrink-0" />
              <span>Tarinapeli (1 pelaaja)</span>
            </button>

            <button
              type="button"
              onClick={() => onStartMode('mirilka')}
              className="tactile-btn inline-flex min-h-[58px] w-full items-center justify-center gap-3 rounded-2xl bg-[var(--accent-secondary)] px-6 py-3.5 text-lg sm:text-xl font-bold text-white shadow-[0_5px_0_var(--accent-secondary-depth)] hover:bg-[var(--accent-secondary-hover)]"
            >
              <HandshakeIcon className="h-5 w-5 shrink-0" />
              <span>Sovintopeli kahdelle</span>
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onOpenStoryPicker}
                className="tactile-btn inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl border-2 border-[var(--accent-primary)]/35 bg-[var(--accent-primary-soft)] px-4 py-3 text-base sm:text-lg font-bold text-[var(--accent-primary)] hover:brightness-95"
              >
                <BookOpenIcon className="h-5 w-5 shrink-0" />
                <span>Valitse tarina</span>
              </button>

              <button
                type="button"
                onClick={onOpenCustomConflict}
                className="tactile-btn inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl border-2 border-[var(--accent-secondary)]/40 bg-[var(--accent-secondary-soft)] px-4 py-3 text-base sm:text-lg font-bold text-[var(--text-primary)] hover:brightness-95"
              >
                <EditIcon className="h-5 w-5 shrink-0 text-[var(--accent-secondary)]" />
                <span>Oma riita</span>
              </button>

              <button
                type="button"
                onClick={onOpenHouse}
                className="tactile-btn inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-subtle)] px-4 py-3 text-base sm:text-lg font-bold text-[var(--text-primary)] hover:brightness-95"
              >
                <HomeIcon className="h-5 w-5 shrink-0 text-[var(--accent-primary)]" />
                <span>Tunteiden talo</span>
              </button>

              <button
                type="button"
                onClick={onOpenAlbum}
                className="tactile-btn inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-subtle)] px-4 py-3 text-base sm:text-lg font-bold text-[var(--text-primary)] hover:brightness-95"
              >
                <TrophyIcon className="h-5 w-5 shrink-0 text-[var(--accent-warning)]" />
                <span className="tabular-nums">
                  Omat tarrat ({stickerCount}/{TOTAL_STICKERS})
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quiet Legal Footer Links */}
      <footer className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-t border-[var(--border-hairline)] pt-4 text-sm text-[var(--text-muted)]">
        <button
          type="button"
          onClick={() => onOpenLegalTab('tos')}
          className="min-h-[32px] px-1 hover:text-[var(--text-primary)] hover:underline"
        >
          Käyttöehdot
        </button>
        <span aria-hidden="true">·</span>
        <button
          type="button"
          onClick={() => onOpenLegalTab('privacy')}
          className="min-h-[32px] px-1 hover:text-[var(--text-primary)] hover:underline"
        >
          Tietosuoja
        </button>
        <span aria-hidden="true">·</span>
        <button
          type="button"
          onClick={() => onOpenLegalTab('copyright')}
          className="min-h-[32px] px-1 hover:text-[var(--text-primary)] hover:underline"
        >
          Tekijänoikeus
        </button>
        <span aria-hidden="true">·</span>
        <button
          type="button"
          onClick={() => onOpenLegalTab('disclaimer')}
          className="min-h-[32px] px-1 hover:text-[var(--text-primary)] hover:underline"
        >
          Vastuu
        </button>
      </footer>
    </section>
  );
};
