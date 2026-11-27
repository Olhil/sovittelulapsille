import React, { useEffect, useMemo, useState } from 'react';
import {
  analyzeCustomConflict,
  CONFLICT_ACTIONS,
  CONFLICT_NEEDS,
  CONFLICT_STARTERS,
} from '../game/conflictAnalysis';
import { CONFLICT_EMOTIONS } from '../game/data';
import { getCharacter, getEmotion } from '../game/rules';
import type {
  CharacterId,
  CustomConflictDraft,
  EmotionId,
  SavedCustomConflict,
} from '../game/types';
import { playTone } from '../utils/audio';
import { speakFinnish, stopSpeech } from '../utils/speech';
import { CharacterAvatar } from './CharacterAvatar';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookmarkIcon,
  CheckCircleIcon,
  EditIcon,
  SparklesIcon,
  StopIcon,
  TrashIcon,
  VolumeOnIcon,
  XIcon,
} from './Icons';

interface CustomConflictViewProps {
  charAId: CharacterId;
  charBId: CharacterId;
  muted: boolean;
  savedConflicts: SavedCustomConflict[];
  onSaveConflict: (entry: SavedCustomConflict) => void;
  onDeleteConflict: (id: string) => void;
  onCelebrate: () => void;
  onExit: () => void;
}

type ConflictStep = 1 | 2 | 3 | 4;

function createEmptyDraft(): CustomConflictDraft {
  return {
    myName: '',
    otherName: '',
    whatHappened: '',
    myReaction: '',
    myEmotion: 'harmitus',
    otherEmotion: 'unknown',
    myNeed: CONFLICT_NEEDS[0],
    nextStep: CONFLICT_ACTIONS[0],
  };
}

export const CustomConflictView: React.FC<CustomConflictViewProps> = ({
  charAId,
  charBId,
  muted,
  savedConflicts,
  onSaveConflict,
  onDeleteConflict,
  onCelebrate,
  onExit,
}) => {
  const [step, setStep] = useState<ConflictStep>(1);
  const [draft, setDraft] = useState<CustomConflictDraft>(() => createEmptyDraft());
  const [customNeedInput, setCustomNeedInput] = useState('');
  const [savedId, setSavedId] = useState<string | null>(null);
  const [speakingTarget, setSpeakingTarget] = useState<string | null>(null);

  const charA = getCharacter(charAId);
  const charB = getCharacter(charBId);

  const analysis = useMemo(() => analyzeCustomConflict(draft), [draft]);

  useEffect(() => {
    stopSpeech();
    setSpeakingTarget(null);
  }, [step, muted]);

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  const handleToggleSpeech = (target: string, text: string) => {
    if (speakingTarget === target) {
      stopSpeech();
      setSpeakingTarget(null);
      return;
    }
    setSpeakingTarget(target);
    const started = speakFinnish(text, {
      muted,
      onEnd: () => setSpeakingTarget((curr) => (curr === target ? null : curr)),
    });
    if (!started) {
      setSpeakingTarget(null);
    }
  };

  const renderQuestionSpeakButton = (
    target: string,
    text: string,
    label: string
  ) => {
    const active = speakingTarget === target;
    return (
      <button
        type="button"
        onClick={() => handleToggleSpeech(target, text)}
        aria-label={active ? 'Pysäytä puhe' : label}
        aria-pressed={active}
        className={`tactile-btn inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl border ${
          active
            ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-white'
            : 'border-[var(--border-hairline)] bg-[var(--bg-surface)] text-[var(--accent-primary)] hover:bg-[var(--accent-primary-soft)]'
        }`}
      >
        {active ? (
          <StopIcon className="h-5 w-5" />
        ) : (
          <VolumeOnIcon className="h-5 w-5" />
        )}
      </button>
    );
  };

  const handleStepChange = (next: ConflictStep) => {
    playTone(next === 4 ? 'success' : 'tap', muted);
    setStep(next);
    if (next === 4) {
      onCelebrate();
    }
  };

  const handleSave = () => {
    if (savedId) return;
    const now = new Date();
    const dateLabel = `${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()}`;
    const id = `conflict-${Date.now()}`;
    const entry: SavedCustomConflict = {
      ...draft,
      id,
      createdAt: dateLabel,
    };
    onSaveConflict(entry);
    setSavedId(id);
    playTone('success', muted);
  };

  const handleOpenSaved = (item: SavedCustomConflict) => {
    playTone('tap', muted);
    setDraft({
      myName: item.myName,
      otherName: item.otherName,
      whatHappened: item.whatHappened,
      myReaction: item.myReaction,
      myEmotion: item.myEmotion,
      otherEmotion: item.otherEmotion,
      myNeed: item.myNeed,
      nextStep: item.nextStep,
    });
    setCustomNeedInput(
      CONFLICT_NEEDS.includes(item.myNeed) ? '' : item.myNeed
    );
    setSavedId(item.id);
    setStep(4);
  };

  const handleReset = () => {
    stopSpeech();
    playTone('tap', muted);
    setDraft(createEmptyDraft());
    setCustomNeedInput('');
    setSavedId(null);
    setStep(1);
  };

  const canGoFromStep1 = draft.whatHappened.trim().length > 0;

  return (
    <section
      aria-label="Oma riita"
      className="flex flex-col gap-5 rounded-3xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 sm:p-8 shadow-[var(--shadow-card)]"
    >
      {/* Top Bar */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm sm:text-base font-semibold text-[var(--text-muted)] tabular-nums">
            <span className="text-[var(--accent-primary)] font-bold">
              Oma riita
            </span>
            <span aria-hidden="true">·</span>
            <span>{step === 4 ? 'Purku valmis' : `Vaihe ${step}/3`}</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] flex items-center gap-2">
            <EditIcon className="h-6 w-6 text-[var(--accent-primary)] shrink-0" />
            <span>
              {step === 1 && 'Mitä tapahtui?'}
              {step === 2 && 'Miltä minusta tuntuu?'}
              {step === 3 && 'Toinen osapuoli ja sovinto'}
              {step === 4 && 'Riidan purku'}
            </span>
          </h1>
        </div>

        <button
          type="button"
          onClick={() => {
            stopSpeech();
            onExit();
          }}
          aria-label="Sulje ja palaa etusivulle"
          className="tactile-btn inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-subtle)] text-[var(--text-primary)] hover:brightness-95 shrink-0"
        >
          <XIcon className="h-5 w-5" />
        </button>
      </div>

      {/* STEP 1: Enter the Conflict */}
      {step === 1 && (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
                Minun nimi (valinnainen)
              </span>
              <input
                type="text"
                maxLength={30}
                value={draft.myName}
                onChange={(e) => {
                  setSavedId(null);
                  setDraft((prev) => ({ ...prev, myName: e.target.value }));
                }}
                placeholder="Minä"
                className="min-h-[48px] rounded-2xl border-2 border-[var(--border-hairline)] bg-[var(--bg-subtle)] px-4 py-2.5 text-base font-semibold text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
                Kaverin nimi (valinnainen)
              </span>
              <input
                type="text"
                maxLength={30}
                value={draft.otherName}
                onChange={(e) => {
                  setSavedId(null);
                  setDraft((prev) => ({ ...prev, otherName: e.target.value }));
                }}
                placeholder="Kaveri"
                className="min-h-[48px] rounded-2xl border-2 border-[var(--border-hairline)] bg-[var(--bg-subtle)] px-4 py-2.5 text-base font-semibold text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none"
              />
            </label>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="custom-what-happened"
                className="text-base sm:text-lg font-bold text-[var(--text-primary)]"
              >
                Kirjoita, mitä tapahtui:
              </label>
              {renderQuestionSpeakButton(
                'step1-what',
                'Mitä tapahtui? Kirjoita lyhyesti tai valitse valmis esimerkki. Voit myös kertoa, mitä sanoit tai teit.',
                'Kuuntele kysymys: Mitä tapahtui'
              )}
            </div>
            <textarea
              id="custom-what-happened"
              rows={3}
              maxLength={260}
              value={draft.whatHappened}
              onChange={(e) => {
                setSavedId(null);
                setDraft((prev) => ({ ...prev, whatHappened: e.target.value }));
              }}
              placeholder="Esim. Kaveri otti palloni ilman lupaa."
              className="w-full rounded-2xl border-2 border-[var(--border-hairline)] bg-[var(--bg-subtle)] px-4 py-3 text-base sm:text-lg font-semibold text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none resize-none"
            />
          </div>

          {/* Quick starter chips */}
          <div className="flex flex-wrap gap-2">
            {CONFLICT_STARTERS.map((starter) => (
              <button
                key={starter}
                type="button"
                onClick={() => {
                  playTone('tap', muted);
                  setSavedId(null);
                  setDraft((prev) => ({ ...prev, whatHappened: starter }));
                }}
                className="tactile-btn min-h-[44px] rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-subtle)] px-3.5 py-2 text-left text-sm sm:text-base font-bold text-[var(--text-primary)] hover:border-[var(--accent-primary)]"
              >
                {starter}
              </button>
            ))}
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
              Mitä sanoin tai tein? (valinnainen)
            </span>
            <input
              type="text"
              maxLength={160}
              value={draft.myReaction}
              onChange={(e) => {
                setSavedId(null);
                setDraft((prev) => ({ ...prev, myReaction: e.target.value }));
              }}
              placeholder="Esim. Huusin kovaa tai lähdin pois."
              className="min-h-[48px] rounded-2xl border-2 border-[var(--border-hairline)] bg-[var(--bg-subtle)] px-4 py-2.5 text-base font-semibold text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none"
            />
          </label>

          <button
            type="button"
            disabled={!canGoFromStep1}
            onClick={() => handleStepChange(2)}
            className="tactile-btn inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent-primary)] px-6 py-3 text-lg font-bold text-white shadow-[0_5px_0_var(--accent-primary-depth)] hover:bg-[var(--accent-primary-hover)] disabled:opacity-45 disabled:pointer-events-none"
          >
            <span>Jatka</span>
            <ArrowRightIcon className="h-5 w-5" />
          </button>

          {/* Saved Conflicts List */}
          {savedConflicts.length > 0 && (
            <div className="space-y-3 border-t border-[var(--border-hairline)] pt-5">
              <h2 className="font-display text-lg sm:text-xl font-extrabold text-[var(--text-primary)]">
                Tallennetut purut ({savedConflicts.length})
              </h2>
              <div className="flex flex-col gap-2.5">
                {savedConflicts.map((item) => {
                  const emo = getEmotion(item.myEmotion);
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-2 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-subtle)] p-3"
                    >
                      <button
                        type="button"
                        onClick={() => handleOpenSaved(item)}
                        className="tactile-btn flex flex-1 items-center gap-3 text-left min-h-[44px]"
                      >
                        <span className="text-2xl shrink-0" aria-hidden="true">
                          {emo.emoji}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-base font-bold text-[var(--text-primary)] truncate">
                            {item.whatHappened}
                          </div>
                          <div className="text-sm font-medium text-[var(--text-muted)]">
                            {emo.label}
                            {item.createdAt ? ` · ${item.createdAt}` : ''}
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          playTone('tap', muted);
                          onDeleteConflict(item.id);
                        }}
                        aria-label={`Poista purku: ${item.whatHappened}`}
                        className="tactile-btn inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--accent-danger)]"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 2: My Emotion + Need */}
      {step === 2 && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5 flex flex-col items-center gap-3 rounded-3xl border border-[var(--border-hairline)] bg-gradient-to-b from-[var(--bg-stage-top)] to-[var(--bg-stage-bottom)] p-5 text-center">
            <CharacterAvatar
              character={charA}
              emotionId={draft.myEmotion}
              size={112}
            />
            <div className="font-display text-xl font-extrabold text-[var(--text-primary)]">
              {analysis.myName}: {analysis.myEmotion.label}
            </div>
            <p className="text-sm sm:text-base font-semibold text-[var(--text-muted)]">
              {analysis.myEmotion.bodyText}
            </p>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-5">
            <div className="flex items-center justify-between gap-2">
              <div className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
                Miltä minusta tuntuu?
              </div>
              {renderQuestionSpeakButton(
                'step2-emo',
                'Miltä minusta tuntuu? Valitse tunne, joka kuvaa oloasi.',
                'Kuuntele kysymys: Miltä minusta tuntuu'
              )}
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {CONFLICT_EMOTIONS.map((e) => {
                const active = draft.myEmotion === e.id;
                return (
                  <button
                    key={e.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      playTone('tap', muted);
                      setSavedId(null);
                      setDraft((prev) => ({ ...prev, myEmotion: e.id }));
                    }}
                    className={`tactile-btn flex min-h-[76px] flex-col items-center justify-center gap-1 rounded-2xl border-2 p-2 ${
                      active
                        ? 'border-[var(--accent-primary)] bg-[var(--accent-primary-soft)]'
                        : 'border-[var(--border-hairline)] bg-[var(--bg-subtle)] hover:border-[var(--accent-primary)]/40'
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl" aria-hidden="true">
                      {e.emoji}
                    </span>
                    <span className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
                      {e.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
                  Mitä tarvitsen?
                </div>
                {renderQuestionSpeakButton(
                  'step2-need',
                  'Mitä tarvitsen nyt? Valitse vaihtoehto tai kirjoita oma tarve.',
                  'Kuuntele kysymys: Mitä tarvitsen'
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CONFLICT_NEEDS.map((need) => {
                  const active = !customNeedInput.trim() && draft.myNeed === need;
                  return (
                    <button
                      key={need}
                      type="button"
                      aria-pressed={active}
                      onClick={() => {
                        playTone('tap', muted);
                        setCustomNeedInput('');
                        setSavedId(null);
                        setDraft((prev) => ({ ...prev, myNeed: need }));
                      }}
                      className={`tactile-btn min-h-[48px] rounded-2xl border-2 px-4 py-2 text-left text-base font-bold ${
                        active
                          ? 'border-[var(--accent-primary)] bg-[var(--accent-primary-soft)] text-[var(--accent-primary)]'
                          : 'border-[var(--border-hairline)] bg-[var(--bg-subtle)] text-[var(--text-primary)] hover:border-[var(--accent-primary)]/40'
                      }`}
                    >
                      {need}
                    </button>
                  );
                })}
              </div>

              <input
                type="text"
                maxLength={120}
                value={customNeedInput}
                onChange={(e) => {
                  const val = e.target.value;
                  setCustomNeedInput(val);
                  setSavedId(null);
                  setDraft((prev) => ({
                    ...prev,
                    myNeed: val.trim() ? val : CONFLICT_NEEDS[0],
                  }));
                }}
                placeholder="Tai kirjoita oma tarve..."
                className="min-h-[48px] w-full rounded-2xl border-2 border-[var(--border-hairline)] bg-[var(--bg-subtle)] px-4 py-2.5 text-base font-semibold text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none"
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => handleStepChange(1)}
                className="tactile-btn inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-subtle)] px-5 py-3 text-lg font-bold text-[var(--text-primary)] hover:brightness-95 sm:w-1/3"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span>Takaisin</span>
              </button>
              <button
                type="button"
                onClick={() => handleStepChange(3)}
                className="tactile-btn inline-flex min-h-[56px] items-center justify-center gap-2 rounded-2xl bg-[var(--accent-primary)] px-6 py-3 text-lg font-bold text-white shadow-[0_5px_0_var(--accent-primary-depth)] hover:bg-[var(--accent-primary-hover)] sm:w-2/3"
              >
                <span>Jatka</span>
                <ArrowRightIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Other Person's Emotion & Next Peace Step */}
      {step === 3 && (
        <div className="flex flex-col gap-5">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
                Miltä {analysis.otherName} ehkä tuntee?
              </div>
              {renderQuestionSpeakButton(
                'step3-other',
                `Miltä ${analysis.otherName} ehkä tuntee? Valitse tunne tai en tiedä.`,
                'Kuuntele kysymys toisen tunteesta'
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              <button
                type="button"
                aria-pressed={draft.otherEmotion === 'unknown'}
                onClick={() => {
                  playTone('tap', muted);
                  setSavedId(null);
                  setDraft((prev) => ({ ...prev, otherEmotion: 'unknown' }));
                }}
                className={`tactile-btn flex min-h-[76px] flex-col items-center justify-center gap-1 rounded-2xl border-2 p-2 ${
                  draft.otherEmotion === 'unknown'
                    ? 'border-[var(--accent-secondary)] bg-[var(--accent-secondary-soft)]'
                    : 'border-[var(--border-hairline)] bg-[var(--bg-subtle)] hover:border-[var(--accent-secondary)]/50'
                }`}
              >
                <span className="text-2xl sm:text-3xl" aria-hidden="true">
                  🤷
                </span>
                <span className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
                  En tiedä
                </span>
              </button>

              {CONFLICT_EMOTIONS.map((e) => {
                const active = draft.otherEmotion === e.id;
                return (
                  <button
                    key={`other-${e.id}`}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      playTone('tap', muted);
                      setSavedId(null);
                      setDraft((prev) => ({
                        ...prev,
                        otherEmotion: e.id as EmotionId,
                      }));
                    }}
                    className={`tactile-btn flex min-h-[76px] flex-col items-center justify-center gap-1 rounded-2xl border-2 p-2 ${
                      active
                        ? 'border-[var(--accent-secondary)] bg-[var(--accent-secondary-soft)]'
                        : 'border-[var(--border-hairline)] bg-[var(--bg-subtle)] hover:border-[var(--accent-secondary)]/50'
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl" aria-hidden="true">
                      {e.emoji}
                    </span>
                    <span className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
                      {e.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
                Mitä voin tehdä seuraavaksi?
              </div>
              {renderQuestionSpeakButton(
                'step3-action',
                'Mitä voin tehdä seuraavaksi? Valitse hyvä askel sovintoon.',
                'Kuuntele kysymys seuraavasta askeleesta'
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {CONFLICT_ACTIONS.map((action) => {
                const active = draft.nextStep === action;
                return (
                  <button
                    key={action}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      playTone('tap', muted);
                      setSavedId(null);
                      setDraft((prev) => ({ ...prev, nextStep: action }));
                    }}
                    className={`tactile-btn min-h-[52px] rounded-2xl border-2 px-4 py-3 text-left text-base font-bold ${
                      active
                        ? 'border-[var(--accent-secondary)] bg-[var(--accent-secondary-soft)] text-[var(--text-primary)]'
                        : 'border-[var(--border-hairline)] bg-[var(--bg-subtle)] text-[var(--text-primary)] hover:border-[var(--accent-secondary)]/50'
                    }`}
                  >
                    {action}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => handleStepChange(2)}
              className="tactile-btn inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-subtle)] px-5 py-3 text-lg font-bold text-[var(--text-primary)] hover:brightness-95 sm:w-1/3"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Takaisin</span>
            </button>

            <button
              type="button"
              onClick={() => handleStepChange(4)}
              className="tactile-btn inline-flex min-h-[56px] items-center justify-center gap-2 rounded-2xl bg-[var(--accent-secondary)] px-6 py-3 text-lg font-bold text-white shadow-[0_5px_0_var(--accent-secondary-depth)] hover:bg-[var(--accent-secondary-hover)] sm:w-2/3"
            >
              <SparklesIcon className="h-5 w-5" />
              <span>Näytä purku</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Guided Conflict Breakdown & Voiceover Card */}
      {step === 4 && (
        <div className="flex flex-col gap-5">
          {/* Characters Banner + Listen All */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl border border-[var(--border-hairline)] bg-gradient-to-b from-[var(--bg-stage-top)] to-[var(--bg-stage-bottom)] p-5">
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center gap-1.5">
                <CharacterAvatar
                  character={charA}
                  emotionId={analysis.myEmotion.id}
                  size={84}
                />
                <span className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
                  {analysis.myName} · {analysis.myEmotion.label}
                </span>
              </div>

              <div className="flex flex-col items-center gap-1.5">
                <CharacterAvatar
                  character={charB}
                  emotionId={analysis.otherEmotion?.id ?? 'pelko'}
                  size={84}
                />
                <span className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
                  {analysis.otherName} ·{' '}
                  {analysis.otherEmotion ? analysis.otherEmotion.label : '?'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleToggleSpeech('all', analysis.fullSpeechText)}
              aria-pressed={speakingTarget === 'all'}
              className={`tactile-btn inline-flex min-h-[50px] items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-base sm:text-lg font-bold whitespace-nowrap ${
                speakingTarget === 'all'
                  ? 'bg-[var(--accent-danger)] text-white'
                  : 'bg-[var(--accent-primary)] text-white shadow-[0_4px_0_var(--accent-primary-depth)] hover:bg-[var(--accent-primary-hover)]'
              }`}
            >
              {speakingTarget === 'all' ? (
                <>
                  <StopIcon className="h-5 w-5" />
                  <span>Pysäytä</span>
                </>
              ) : (
                <>
                  <VolumeOnIcon className="h-5 w-5" />
                  <span>Kuuntele purku</span>
                </>
              )}
            </button>
          </div>

          {/* Ready-to-say I-Message Highlight */}
          <div className="flex items-start justify-between gap-3 rounded-2xl border-2 border-[var(--accent-primary)] bg-[var(--accent-primary-soft)] p-4 sm:p-5">
            <div className="space-y-1 flex-1">
              <div className="text-sm sm:text-base font-bold text-[var(--accent-primary)]">
                Mitä voin sanoa kaverille?
              </div>
              <p className="font-display text-lg sm:text-xl font-extrabold text-[var(--text-primary)] leading-snug">
                {analysis.iMessage}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggleSpeech('imsg', analysis.iMessage)}
              aria-label={
                speakingTarget === 'imsg'
                  ? 'Pysäytä lauseen luku'
                  : 'Kuuntele lause'
              }
              aria-pressed={speakingTarget === 'imsg'}
              className={`tactile-btn inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl border ${
                speakingTarget === 'imsg'
                  ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-white'
                  : 'border-[var(--border-hairline)] bg-[var(--bg-surface)] text-[var(--accent-primary)] hover:brightness-95'
              }`}
            >
              {speakingTarget === 'imsg' ? (
                <StopIcon className="h-5 w-5" />
              ) : (
                <VolumeOnIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* 4-Card Structured Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-subtle)] p-4 space-y-1.5">
              <div className="text-sm font-bold text-[var(--text-muted)]">
                1. Tapahtuma
              </div>
              <p className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
                {analysis.whatHappened}
              </p>
              {analysis.myReaction && (
                <p className="text-sm sm:text-base text-[var(--text-muted)]">
                  Reaktio: {analysis.myReaction}
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-subtle)] p-4 space-y-1.5">
              <div className="text-sm font-bold text-[var(--text-muted)]">
                2. Oma tunne ja keho
              </div>
              <p className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
                {analysis.myEmotion.emoji} {analysis.myEmotion.label}
              </p>
              <p className="text-sm sm:text-base text-[var(--text-primary)]">
                {analysis.myEmotion.bodyText}
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-subtle)] p-4 space-y-1.5">
              <div className="text-sm font-bold text-[var(--text-muted)]">
                3. Toisen näkökulma
              </div>
              <p className="text-base font-semibold text-[var(--text-primary)]">
                {analysis.otherPerspectiveText}
              </p>
            </div>

            <div className="rounded-2xl border-2 border-[var(--accent-secondary)] bg-[var(--accent-secondary-soft)] p-4 space-y-1.5">
              <div className="text-sm font-bold text-[var(--accent-secondary)]">
                4. Rauhoittuminen ja sovinto
              </div>
              <p className="text-base font-semibold text-[var(--text-primary)]">
                {analysis.calmTip}
              </p>
              <p className="text-base font-bold text-[var(--text-primary)] pt-1">
                Seuraava askel: {analysis.nextStep}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={Boolean(savedId)}
              className={`tactile-btn inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl px-5 py-3 text-base sm:text-lg font-bold ${
                savedId
                  ? 'border-2 border-[var(--accent-secondary)] bg-[var(--accent-secondary-soft)] text-[var(--accent-secondary)]'
                  : 'bg-[var(--accent-secondary)] text-white shadow-[0_5px_0_var(--accent-secondary-depth)] hover:bg-[var(--accent-secondary-hover)]'
              }`}
            >
              {savedId ? (
                <>
                  <CheckCircleIcon className="h-5 w-5" />
                  <span>Tallennettu</span>
                </>
              ) : (
                <>
                  <BookmarkIcon className="h-5 w-5" />
                  <span>Tallenna purku</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="tactile-btn inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-subtle)] px-5 py-3 text-base sm:text-lg font-bold text-[var(--text-primary)] hover:brightness-95"
            >
              <EditIcon className="h-5 w-5" />
              <span>Uusi riita</span>
            </button>

            <button
              type="button"
              onClick={() => {
                stopSpeech();
                onExit();
              }}
              className="tactile-btn inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-[var(--accent-primary)] px-5 py-3 text-base sm:text-lg font-bold text-white shadow-[0_5px_0_var(--accent-primary-depth)] hover:bg-[var(--accent-primary-hover)]"
            >
              <span>Valikkoon</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
