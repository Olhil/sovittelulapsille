import React from 'react';
import { CHARACTERS } from '../game/data';
import { getCharacter } from '../game/rules';
import type { CharacterId, GameMode } from '../game/types';
import { CharacterAvatar } from './CharacterAvatar';
import { ArrowLeftIcon, RocketIcon } from './Icons';

interface SelectCharsViewProps {
  mode: GameMode;
  charAId: CharacterId;
  charBId: CharacterId;
  onSelectChar: (slot: 'A' | 'B', id: CharacterId) => void;
  onBack: () => void;
  onLaunch: () => void;
}

export const SelectCharsView: React.FC<SelectCharsViewProps> = ({
  charAId,
  charBId,
  onSelectChar,
  onBack,
  onLaunch,
}) => {
  const charA = getCharacter(charAId);
  const charB = getCharacter(charBId);

  return (
    <section
      aria-label="Hahmojen valinta"
      className="flex flex-col gap-6 rounded-3xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6 sm:p-8 shadow-[var(--shadow-card)]"
    >
      <div className="text-center">
        <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-[var(--text-primary)]">
          Valitse kaksi hahmoa
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Character 1 */}
        <div className="space-y-3 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-subtle)] p-4">
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-[var(--accent-primary)]">
              Hahmo 1
            </span>
            <span className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
              {charA.name}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {CHARACTERS.map((c) => {
              const selected = charAId === c.id;
              return (
                <button
                  key={`A-${c.id}`}
                  type="button"
                  aria-pressed={selected}
                  aria-label={`Valitse Hahmo 1: ${c.name}`}
                  onClick={() => onSelectChar('A', c.id)}
                  className={`tactile-btn flex min-h-[100px] flex-col items-center justify-center gap-1.5 rounded-2xl border-2 p-2.5 ${
                    selected
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-primary-soft)]'
                      : 'border-[var(--border-hairline)] bg-[var(--bg-surface)] hover:border-[var(--accent-primary)]/40'
                  }`}
                >
                  <CharacterAvatar character={c} emotionId="ilo" size={56} />
                  <span className="text-sm sm:text-base font-bold text-[var(--text-primary)] whitespace-nowrap">
                    {c.name.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Character 2 */}
        <div className="space-y-3 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-subtle)] p-4">
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-[var(--accent-secondary)]">
              Hahmo 2
            </span>
            <span className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
              {charB.name}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {CHARACTERS.map((c) => {
              const selected = charBId === c.id;
              return (
                <button
                  key={`B-${c.id}`}
                  type="button"
                  aria-pressed={selected}
                  aria-label={`Valitse Hahmo 2: ${c.name}`}
                  onClick={() => onSelectChar('B', c.id)}
                  className={`tactile-btn flex min-h-[100px] flex-col items-center justify-center gap-1.5 rounded-2xl border-2 p-2.5 ${
                    selected
                      ? 'border-[var(--accent-secondary)] bg-[var(--accent-secondary-soft)]'
                      : 'border-[var(--border-hairline)] bg-[var(--bg-surface)] hover:border-[var(--accent-secondary)]/40'
                  }`}
                >
                  <CharacterAvatar character={c} emotionId="ilo" size={56} />
                  <span className="text-sm sm:text-base font-bold text-[var(--text-primary)] whitespace-nowrap">
                    {c.name.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="tactile-btn inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-subtle)] px-5 py-3 text-lg font-bold text-[var(--text-primary)] hover:brightness-95 sm:w-1/3"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Takaisin</span>
        </button>

        <button
          type="button"
          data-start="true"
          onClick={onLaunch}
          className="tactile-btn inline-flex min-h-[56px] items-center justify-center gap-2 rounded-2xl bg-[var(--accent-primary)] px-6 py-3 text-lg font-bold text-white shadow-[0_5px_0_var(--accent-primary-depth)] hover:bg-[var(--accent-primary-hover)] sm:w-2/3"
        >
          <RocketIcon className="h-5 w-5" />
          <span>Aloita!</span>
        </button>
      </div>
    </section>
  );
};
