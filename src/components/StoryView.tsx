import React, { useEffect, useState } from 'react';
import { CONFLICT_EMOTIONS, SCENARIOS } from '../game/data';
import {
  formatStorySituation,
  getCharacter,
  getScenario,
} from '../game/rules';
import type { EmotionId, GameState } from '../game/types';
import { speakFinnish, stopSpeech } from '../utils/speech';
import { CharacterAvatar } from './CharacterAvatar';
import {
  ArrowRightIcon,
  BookOpenIcon,
  CheckCircleIcon,
  SparklesIcon,
  StopIcon,
  VolumeOnIcon,
  XIcon,
} from './Icons';

interface StoryViewProps {
  state: GameState;
  onExit: () => void;
  onOpenStoryPicker: () => void;
  onPickDetectorEmotion: (id: EmotionId) => void;
  onCheckDetectorEmotion: () => void;
  onTapChip: (chip: 'obs' | 'question' | 'toxic') => void;
  onSelectAnswerEmotion: (id: EmotionId) => void;
  onSelectAnswerNeed: (idx: number) => void;
  onNextScenario: () => void;
}

export const StoryView: React.FC<StoryViewProps> = ({
  state,
  onExit,
  onOpenStoryPicker,
  onPickDetectorEmotion,
  onCheckDetectorEmotion,
  onTapChip,
  onSelectAnswerEmotion,
  onSelectAnswerNeed,
  onNextScenario,
}) => {
  const sc = getScenario(state.scenarioIndex);
  const charA = getCharacter(state.charAId);
  const charB = getCharacter(state.charBId);
  const isVictory = state.step === 4;
  const [speakingKey, setSpeakingKey] = useState<string | null>(null);

  const situationText = formatStorySituation(sc.situation, charA, charB);

  useEffect(() => {
    stopSpeech();
    setSpeakingKey(null);
  }, [state.scenarioIndex, state.step, state.muted]);

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  const handleToggleSpeech = (key: string, text: string) => {
    if (speakingKey === key) {
      stopSpeech();
      setSpeakingKey(null);
      return;
    }
    setSpeakingKey(key);
    const started = speakFinnish(text, {
      muted: state.muted,
      onEnd: () => setSpeakingKey((curr) => (curr === key ? null : curr)),
    });
    if (!started) {
      setSpeakingKey(null);
    }
  };

  const renderSpeakBtn = (key: string, text: string, ariaLabel: string) => {
    const active = speakingKey === key;
    return (
      <button
        type="button"
        onClick={() => handleToggleSpeech(key, text)}
        aria-label={active ? 'Pysäytä puhe' : ariaLabel}
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

  const charAEmo: EmotionId = isVictory ? 'ilo' : state.selectedEmotionA;
  const charBEmo: EmotionId = isVictory
    ? 'ilo'
    : state.step === 3 && state.chosenAnswerEmo
      ? state.chosenAnswerEmo
      : 'pelko';

  const charBBubbleText =
    state.step === 1
      ? '«Miksi hän huutaa?..»'
      : state.step === 2
        ? '«Mitä minä sanon?»'
        : state.step === 3
          ? '«Miltä sinusta tuntuu nyt?»'
          : '«Ymmärrän! Sovitaan vaan!»';

  const builtPhrase = [
    state.builtObs ? sc.observationChip : null,
    state.builtQuestion ? 'Miltä sinusta tuntuu nyt?' : null,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section
      aria-label={`Tarina: ${sc.title}`}
      className="flex flex-col gap-5 rounded-3xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 sm:p-7 shadow-[var(--shadow-card)]"
    >
      {/* Story Top Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base font-semibold text-[var(--text-muted)] tabular-nums">
            <span className="text-[var(--accent-primary)] font-bold">
              Tarina {state.scenarioIndex + 1}/{SCENARIOS.length}
            </span>
            <span aria-hidden="true">·</span>
            <span>{isVictory ? 'Valmis' : `Vaihe ${state.step}/3`}</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
            {sc.title}
          </h1>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenStoryPicker}
            aria-label="Valitse toinen tarina"
            className="tactile-btn inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--accent-primary-soft)] px-2.5 sm:px-3.5 py-2 text-sm sm:text-base font-bold text-[var(--accent-primary)] hover:brightness-95 whitespace-nowrap"
          >
            <BookOpenIcon className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">Valitse tarina</span>
          </button>

          <button
            type="button"
            onClick={onExit}
            aria-label="Sulje tarina ja palaa etusivulle"
            className="tactile-btn inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-subtle)] text-[var(--text-primary)] hover:brightness-95 shrink-0"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Situation Context */}
      <div className="flex items-start justify-between gap-3 rounded-2xl bg-[var(--bg-subtle)] px-4 py-3.5">
        <p className="flex-1 text-base sm:text-lg leading-relaxed text-[var(--text-primary)]">
          {situationText}
        </p>
        {renderSpeakBtn(
          'story',
          `${sc.title}. ${situationText} ${charA.name} sanoo: ${sc.maskShout}`,
          'Kuuntele tarina'
        )}
      </div>

      {/* Responsive 2-column Desktop / 1-column Mobile Stage + Controls */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:items-start">
        {/* Stage */}
        <div
          id="stage-box"
          className={`lg:col-span-6 flex items-stretch justify-around gap-3 rounded-3xl border border-[var(--border-hairline)] bg-gradient-to-b from-[var(--bg-stage-top)] to-[var(--bg-stage-bottom)] p-4 sm:p-5 no-select ${
            state.shakeTarget === 'stage' ? 'animate-shake' : ''
          }`}
        >
          <div
            id="charA-box"
            className={`flex w-1/2 flex-col items-center justify-between gap-2.5 ${
              state.shakeTarget === 'charA' ? 'animate-shake' : ''
            }`}
          >
            <CharacterAvatar
              character={charA}
              emotionId={charAEmo}
              size={96}
              showArmor={!isVictory}
              armorBroken={state.step >= 3}
            />
            <span className="rounded-xl bg-[var(--bg-surface)] px-3 py-1 text-sm sm:text-base font-bold text-[var(--text-primary)] shadow-sm text-center">
              {charA.name}
            </span>
            <div
              className={`flex min-h-[68px] w-full items-center justify-center rounded-2xl border-2 px-3 py-2 text-center text-sm sm:text-base font-semibold ${
                isVictory
                  ? 'border-[var(--accent-secondary)] bg-[var(--accent-secondary-soft)] text-[var(--text-primary)]'
                  : 'border-[var(--accent-danger)] bg-[var(--accent-danger-soft)] text-[var(--text-primary)]'
              }`}
            >
              {isVictory ? '«Kiitos kun kysyit! Sovitaan vaan!»' : sc.maskShout}
            </div>
          </div>

          <div className="flex w-1/2 flex-col items-center justify-between gap-2.5">
            <CharacterAvatar character={charB} emotionId={charBEmo} size={96} />
            <span className="rounded-xl bg-[var(--bg-surface)] px-3 py-1 text-sm sm:text-base font-bold text-[var(--text-primary)] shadow-sm text-center">
              {charB.name}
            </span>
            <div
              className={`flex min-h-[68px] w-full items-center justify-center rounded-2xl border-2 px-3 py-2 text-center text-sm sm:text-base font-semibold ${
                state.step >= 3
                  ? 'border-[var(--accent-secondary)] bg-[var(--accent-secondary-soft)] text-[var(--text-primary)]'
                  : 'border-[var(--border-hairline)] bg-[var(--bg-surface)] text-[var(--text-primary)]'
              }`}
            >
              {charBBubbleText}
            </div>
          </div>
        </div>

        {/* Interactive Step Panel */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          {state.step === 1 && (
            <>
              <div className="flex items-center justify-between gap-2 rounded-2xl bg-[var(--bg-subtle)] px-4 py-2.5">
                <span className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
                  Mikä tunne on huudon takana?
                </span>
                {renderSpeakBtn(
                  'step1-q',
                  `Mikä tunne on huudon takana? ${charA.name} huutaa: ${sc.maskShout}. Katso silmiä ja valitse oikea tunne.`,
                  'Kuuntele kysymys'
                )}
              </div>

              {state.feedbackHint && (
                <div
                  id="step1-hint"
                  role="status"
                  aria-live="polite"
                  className="rounded-2xl border border-[var(--accent-warning)]/40 bg-[var(--accent-warning-soft)] px-4 py-3 text-base font-semibold text-[var(--text-primary)]"
                >
                  {state.feedbackHint}
                </div>
              )}

              <div className="grid grid-cols-3 gap-2.5">
                {CONFLICT_EMOTIONS.map((e) => {
                  const active = state.selectedEmotionA === e.id;
                  return (
                    <button
                      key={e.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => onPickDetectorEmotion(e.id)}
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

              <button
                type="button"
                onClick={onCheckDetectorEmotion}
                className="tactile-btn inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent-primary)] px-6 py-3 text-lg font-bold text-white shadow-[0_5px_0_var(--accent-primary-depth)] hover:bg-[var(--accent-primary-hover)]"
              >
                <SparklesIcon className="h-5 w-5" />
                <span>Tarkista tunne</span>
              </button>
            </>
          )}

          {state.step === 2 && (
            <>
              <div className="flex items-center justify-between gap-2 rounded-2xl bg-[var(--bg-subtle)] px-4 py-2.5">
                <span className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
                  Mitä kysyt kaverilta?
                </span>
                {renderSpeakBtn(
                  'step2-q',
                  `Mitä sanot ja kysyt kaverilta? Valitse rauhalliset sanat.`,
                  'Kuuntele kysymys'
                )}
              </div>

              {state.feedbackHint && (
                <div
                  id="step2-hint"
                  role="status"
                  aria-live="polite"
                  className="rounded-2xl border border-[var(--accent-warning)]/40 bg-[var(--accent-warning-soft)] px-4 py-3 text-base font-semibold text-[var(--text-primary)]"
                >
                  {state.feedbackHint}
                </div>
              )}

              {builtPhrase && (
                <div className="flex min-h-[58px] items-center justify-center rounded-2xl border-2 border-[var(--accent-primary)] bg-[var(--accent-primary-soft)] px-4 py-3 text-center text-base sm:text-lg font-bold text-[var(--accent-primary)]">
                  {builtPhrase}
                </div>
              )}

              <div className="flex flex-col gap-2.5">
                {!state.builtObs && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onTapChip('obs')}
                      className="tactile-btn flex-1 min-h-[52px] rounded-2xl border-2 border-[var(--border-hairline)] bg-[var(--bg-surface)] px-4 py-3 text-left text-base sm:text-lg font-bold text-[var(--text-primary)] hover:border-[var(--accent-primary)]"
                    >
                      👀 {sc.observationChip}
                    </button>
                    {renderSpeakBtn(
                      'chip-obs',
                      sc.observationChip,
                      `Kuuntele: ${sc.observationChip}`
                    )}
                  </div>
                )}
                {!state.builtQuestion && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onTapChip('question')}
                      className="tactile-btn flex-1 min-h-[52px] rounded-2xl border-2 border-[var(--accent-secondary)] bg-[var(--accent-secondary-soft)] px-4 py-3 text-left text-base sm:text-lg font-bold text-[var(--text-primary)] hover:brightness-95"
                    >
                      💬 Miltä sinusta tuntuu nyt?
                    </button>
                    {renderSpeakBtn(
                      'chip-question',
                      'Miltä sinusta tuntuu nyt?',
                      'Kuuntele: Miltä sinusta tuntuu nyt?'
                    )}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onTapChip('toxic')}
                    className="tactile-btn flex-1 min-h-[52px] rounded-2xl border-2 border-[var(--accent-danger)]/60 bg-[var(--accent-danger-soft)] px-4 py-3 text-left text-base sm:text-lg font-bold text-[var(--text-primary)] hover:brightness-95"
                  >
                    ⚡ {sc.toxicChip}
                  </button>
                  {renderSpeakBtn(
                    'chip-toxic',
                    sc.toxicChip,
                    `Kuuntele: ${sc.toxicChip}`
                  )}
                </div>
              </div>
            </>
          )}

          {state.step === 3 && (
            <>
              <div className="flex items-center justify-between gap-2 rounded-2xl bg-[var(--bg-subtle)] px-4 py-2.5">
                <span className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
                  Miltä {charA.name} tuntee ja miksi?
                </span>
                {renderSpeakBtn(
                  'step3-q',
                  `Miltä ${charA.name} tuntee ja miksi? Valitse ensin tunne ja sitten syy.`,
                  'Kuuntele kysymys'
                )}
              </div>

              {state.feedbackHint && (
                <div
                  id="step3-hint"
                  role="status"
                  aria-live="polite"
                  className="rounded-2xl border border-[var(--accent-warning)]/40 bg-[var(--accent-warning-soft)] px-4 py-3 text-base font-semibold text-[var(--text-primary)]"
                >
                  {state.feedbackHint}
                </div>
              )}

              <div className="grid grid-cols-3 gap-2.5">
                {CONFLICT_EMOTIONS.map((e) => {
                  const active = state.chosenAnswerEmo === e.id;
                  return (
                    <button
                      key={`ans-${e.id}`}
                      type="button"
                      aria-pressed={active}
                      onClick={() => onSelectAnswerEmotion(e.id)}
                      className={`tactile-btn flex min-h-[72px] flex-col items-center justify-center gap-1 rounded-2xl border-2 p-2 ${
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

              {state.chosenAnswerEmo && (
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
                      «Minusta tuntuu tältä, koska...»
                    </div>
                    {renderSpeakBtn(
                      'step3-need-q',
                      'Minusta tuntuu tältä, koska... Valitse oikea syy.',
                      'Kuuntele lauseen alku'
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    {sc.needOptions.map((opt, idx) => (
                      <div key={opt} className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onSelectAnswerNeed(idx)}
                          className="tactile-btn flex-1 min-h-[52px] rounded-2xl border-2 border-[var(--border-hairline)] bg-[var(--bg-surface)] px-4 py-3 text-left text-base font-bold text-[var(--text-primary)] hover:border-[var(--accent-primary)]"
                        >
                          «...{opt}»
                        </button>
                        {renderSpeakBtn(
                          `need-opt-${idx}`,
                          `Minusta tuntuu tältä, koska ${opt}`,
                          `Kuuntele vaihtoehto: ${opt}`
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {state.step === 4 && (
            <div className="space-y-4">
              <div className="rounded-2xl border-2 border-[var(--accent-secondary)] bg-[var(--accent-secondary-soft)] p-5 text-center space-y-2">
                <div className="inline-flex items-center justify-center gap-2 font-display text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]">
                  <CheckCircleIcon className="h-7 w-7 text-[var(--accent-secondary)]" />
                  <span>Riita loppui! Hahmot sopivat!</span>
                </div>
                <p className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">
                  Sait tarran: <strong>{sc.sticker}</strong>
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={onExit}
                  className="tactile-btn min-h-[52px] rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-subtle)] px-4 py-3 text-base sm:text-lg font-bold text-[var(--text-primary)] hover:brightness-95"
                >
                  Valikkoon
                </button>
                <button
                  type="button"
                  onClick={onOpenStoryPicker}
                  className="tactile-btn inline-flex min-h-[52px] items-center justify-center gap-1.5 rounded-2xl border-2 border-[var(--accent-primary)]/35 bg-[var(--accent-primary-soft)] px-4 py-3 text-base sm:text-lg font-bold text-[var(--accent-primary)] hover:brightness-95"
                >
                  <BookOpenIcon className="h-4 w-4 shrink-0" />
                  <span>Tarinat</span>
                </button>
                <button
                  type="button"
                  onClick={onNextScenario}
                  className="tactile-btn inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-[var(--accent-secondary)] px-4 py-3 text-base sm:text-lg font-bold text-white shadow-[0_5px_0_var(--accent-secondary-depth)] hover:bg-[var(--accent-secondary-hover)]"
                >
                  <span>Seuraava</span>
                  <ArrowRightIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
