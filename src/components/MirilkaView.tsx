import React, { useEffect, useState } from 'react';
import {
  buildMirilkaAgreementSpeechText,
  CONFLICT_NEEDS,
  MIRILKA_AGREEMENTS,
} from '../game/conflictAnalysis';
import { EMOTIONS } from '../game/data';
import { canAdvanceMirilka, getCharacter, getEmotion } from '../game/rules';
import type { EmotionId, GameState } from '../game/types';
import { speakFinnish, stopSpeech } from '../utils/speech';
import { CharacterAvatar } from './CharacterAvatar';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  HandshakeIcon,
  StopIcon,
  VolumeOnIcon,
  XIcon,
} from './Icons';

interface MirilkaViewProps {
  state: GameState;
  onExit: () => void;
  onSetStory: (player: 1 | 2, text: string) => void;
  onToggleSpoken: (player: 1 | 2) => void;
  onPickEmotion: (player: 1 | 2, emoId: EmotionId) => void;
  onPickNowEmotion: (player: 1 | 2, emoId: EmotionId) => void;
  onSetNeed: (player: 1 | 2, need: string) => void;
  onToggleAgreement: (agreement: string) => void;
  onSetCustomAgreement: (text: string) => void;
  onBackStep: () => void;
  onAdvance: () => void;
}

export const MirilkaView: React.FC<MirilkaViewProps> = ({
  state,
  onExit,
  onSetStory,
  onToggleSpoken,
  onPickEmotion,
  onPickNowEmotion,
  onSetNeed,
  onToggleAgreement,
  onSetCustomAgreement,
  onBackStep,
  onAdvance,
}) => {
  const charA = getCharacter(state.charAId);
  const charB = getCharacter(state.charBId);
  const [speakingKey, setSpeakingKey] = useState<string | null>(null);

  const canProceed = canAdvanceMirilka(state);

  useEffect(() => {
    stopSpeech();
    setSpeakingKey(null);
  }, [state.mirilkaStep, state.muted]);

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

  const renderSpeakButton = (key: string, text: string, label: string) => {
    const active = speakingKey === key;
    return (
      <button
        type="button"
        onClick={() => handleToggleSpeech(key, text)}
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

  const renderPlayerFeelingAndNeed = (player: 1 | 2) => {
    const speakerChar = player === 1 ? charA : charB;
    const listenerChar = player === 1 ? charB : charA;
    const selectedEmo = player === 1 ? state.p1Emo : state.p2Emo;
    const selectedNeed = player === 1 ? state.p1Need : state.p2Need;
    const accentBorder =
      player === 1
        ? 'border-[var(--accent-primary)]'
        : 'border-[var(--accent-secondary)]';
    const accentSoft =
      player === 1
        ? 'bg-[var(--accent-primary-soft)]'
        : 'bg-[var(--accent-secondary-soft)]';
    const accentText =
      player === 1
        ? 'text-[var(--accent-primary)]'
        : 'text-[var(--accent-secondary)]';

    const customNeedVal = CONFLICT_NEEDS.includes(selectedNeed)
      ? ''
      : selectedNeed;

    return (
      <div className="space-y-5">
        {/* Question 1: Feelings */}
        <div
          className={`flex items-center justify-between gap-3 rounded-2xl border-2 ${accentBorder} ${accentSoft} px-4 py-3.5`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <CharacterAvatar
              character={speakerChar}
              emotionId={selectedEmo ?? 'harmitus'}
              size={64}
            />
            <div className="space-y-0.5 min-w-0">
              <div className={`text-sm sm:text-base font-bold ${accentText}`}>
                {listenerChar.name} kuuntelee · {speakerChar.name} vastaa
              </div>
              <h2 className="font-display text-lg sm:text-xl font-extrabold text-[var(--text-primary)]">
                Miltä sinusta tuntui silloin?
              </h2>
            </div>
          </div>

          {renderSpeakButton(
            `p${player}-emo-q`,
            `${speakerChar.name}: Miltä sinusta tuntui silloin? Valitse tunne. ${listenerChar.name} kuuntelee rauhassa.`,
            'Kuuntele tunnekysymys'
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {EMOTIONS.map((e) => {
            const active = selectedEmo === e.id;
            return (
              <button
                key={`p${player}-${e.id}`}
                type="button"
                aria-pressed={active}
                onClick={() => onPickEmotion(player, e.id)}
                className={`tactile-btn flex min-h-[78px] flex-col items-center justify-center gap-1 rounded-2xl border-2 p-2.5 ${
                  active
                    ? `${accentBorder} ${accentSoft}`
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

        {/* Question 2: Hardest part & Need */}
        <div className="space-y-3 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-subtle)] p-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display text-lg sm:text-xl font-extrabold text-[var(--text-primary)]">
              Mikä oli vaikeinta? Mitä tarvitset nyt?
            </h3>
            {renderSpeakButton(
              `p${player}-need-q`,
              `${speakerChar.name}: Mikä tilanteessa oli vaikeinta? Mitä tarvitset nyt, jotta tulee parempi olo?`,
              'Kuuntele tarvekysymys'
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {CONFLICT_NEEDS.map((need) => {
              const active = selectedNeed === need;
              return (
                <button
                  key={`p${player}-need-${need}`}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onSetNeed(player, need)}
                  className={`tactile-btn min-h-[48px] rounded-2xl border-2 px-4 py-2 text-left text-base font-bold ${
                    active
                      ? `${accentBorder} ${accentSoft} text-[var(--text-primary)]`
                      : 'border-[var(--border-hairline)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--accent-primary)]/40'
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
            value={customNeedVal}
            onChange={(e) => onSetNeed(player, e.target.value)}
            placeholder="Tai kirjoita oma tarve..."
            className="min-h-[48px] w-full rounded-2xl border-2 border-[var(--border-hairline)] bg-[var(--bg-surface)] px-4 py-2.5 text-base font-semibold text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none"
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3">
          <button
            type="button"
            onClick={onBackStep}
            className="tactile-btn inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-subtle)] px-5 py-3 text-lg font-bold text-[var(--text-primary)] hover:brightness-95 sm:w-1/3"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Takaisin</span>
          </button>

          <button
            type="button"
            disabled={!canProceed}
            onClick={onAdvance}
            className={`tactile-btn inline-flex min-h-[56px] items-center justify-center gap-2 rounded-2xl px-6 py-3 text-lg font-bold text-white disabled:opacity-45 disabled:pointer-events-none sm:w-2/3 ${
              player === 1
                ? 'bg-[var(--accent-primary)] shadow-[0_5px_0_var(--accent-primary-depth)] hover:bg-[var(--accent-primary-hover)]'
                : 'bg-[var(--accent-secondary)] shadow-[0_5px_0_var(--accent-secondary-depth)] hover:bg-[var(--accent-secondary-hover)]'
            }`}
          >
            <span>
              {player === 1
                ? `Seuraavaksi: ${charB.name}`
                : 'Siirry ratkaisuun'}
            </span>
            <ArrowRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  };

  const p1EmotionObj = state.p1Emo ? getEmotion(state.p1Emo) : null;
  const p2EmotionObj = state.p2Emo ? getEmotion(state.p2Emo) : null;
  const p1NowEmotionObj = state.p1NowEmo ? getEmotion(state.p1NowEmo) : null;
  const p2NowEmotionObj = state.p2NowEmo ? getEmotion(state.p2NowEmo) : null;

  const allAgreements = [
    ...state.mirilkaAgreements,
    ...(state.mirilkaCustomAgreement.trim()
      ? [state.mirilkaCustomAgreement.trim()]
      : []),
  ];

  const finalAgreementSpeech =
    p1EmotionObj && p2EmotionObj
      ? buildMirilkaAgreementSpeechText({
          charAName: charA.name,
          charBName: charB.name,
          p1Story: state.p1Story,
          p2Story: state.p2Story,
          p1EmoLabel: p1EmotionObj.label,
          p2EmoLabel: p2EmotionObj.label,
          p1NowEmoLabel: p1NowEmotionObj?.label,
          p2NowEmoLabel: p2NowEmotionObj?.label,
          p1Need: state.p1Need,
          p2Need: state.p2Need,
          agreements: state.mirilkaAgreements,
          customAgreement: state.mirilkaCustomAgreement,
        })
      : '';

  return (
    <section
      aria-label="Sovintopeli kahdelle"
      className="flex flex-col gap-5 rounded-3xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 sm:p-8 shadow-[var(--shadow-card)]"
    >
      {/* Top Bar */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm sm:text-base font-semibold text-[var(--text-muted)] tabular-nums">
            <span className="text-[var(--accent-secondary)] font-bold">
              Sovittelu kahdelle
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {state.mirilkaStep === 5
                ? 'Sopimus valmis'
                : `Vaihe ${state.mirilkaStep}/4`}
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <HandshakeIcon className="h-6 w-6 text-[var(--accent-secondary)] shrink-0" />
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
              {state.mirilkaStep === 1 && '1. Mitä tapahtui?'}
              {state.mirilkaStep === 2 && `2. ${charA.name}: tunne ja tarve`}
              {state.mirilkaStep === 3 && `3. ${charB.name}: tunne ja tarve`}
              {state.mirilkaStep === 4 && '4. Korjaus ja sopimus'}
              {state.mirilkaStep === 5 && 'Sovintosopimus'}
            </h1>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            stopSpeech();
            onExit();
          }}
          aria-label="Sulje peli ja palaa etusivulle"
          className="tactile-btn inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-subtle)] text-[var(--text-primary)] hover:brightness-95 shrink-0"
        >
          <XIcon className="h-5 w-5" />
        </button>
      </div>

      {/* STEP 1: Both tell what happened without interrupting */}
      {state.mirilkaStep === 1 && (
        <div className="space-y-5">
          <div className="flex items-center justify-between gap-3 rounded-2xl bg-[var(--bg-subtle)] px-4 py-3.5">
            <h2 className="font-display text-lg sm:text-xl font-extrabold text-[var(--text-primary)]">
              Mitä tapahtui sinun mielestä? Kumpikin kertoo vuorollaan.
            </h2>
            {renderSpeakButton(
              'step1-q',
              `Vaihe yksi. Mitä tapahtui sinun mielestä? Ensin kertoo ${charA.name} ja ${charB.name} kuuntelee keskeyttämättä. Sitten kertoo ${charB.name} ja ${charA.name} kuuntelee.`,
              'Kuuntele kysymys'
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[
              {
                player: 1 as const,
                char: charA,
                story: state.p1Story,
                spoken: state.p1Spoken,
                border: 'border-[var(--accent-primary)]/40',
                activeBtn:
                  'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-white',
              },
              {
                player: 2 as const,
                char: charB,
                story: state.p2Story,
                spoken: state.p2Spoken,
                border: 'border-[var(--accent-secondary)]/40',
                activeBtn:
                  'border-[var(--accent-secondary)] bg-[var(--accent-secondary)] text-white',
              },
            ].map(({ player, char, story, spoken, border, activeBtn }) => {
              const done = spoken || story.trim().length > 0;
              return (
                <div
                  key={char.id}
                  className={`flex flex-col gap-3 rounded-2xl border-2 ${border} bg-[var(--bg-subtle)] p-4`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <CharacterAvatar
                        character={char}
                        emotionId={done ? 'ilo' : 'harmitus'}
                        size={54}
                      />
                      <span className="font-display text-lg font-extrabold text-[var(--text-primary)]">
                        {char.name}
                      </span>
                    </div>
                    {renderSpeakButton(
                      `step1-p${player}`,
                      `${char.name}: Kerro omin sanoin, mitä tapahtui sinun mielestä.`,
                      `Kuuntele ${char.name} kysymys`
                    )}
                  </div>

                  <textarea
                    rows={2}
                    maxLength={220}
                    value={story}
                    onChange={(e) => onSetStory(player, e.target.value)}
                    placeholder="Kirjoita lyhyesti (tai kerro ääneen)..."
                    className="w-full rounded-2xl border-2 border-[var(--border-hairline)] bg-[var(--bg-surface)] px-3.5 py-2.5 text-base font-semibold text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none resize-none"
                  />

                  <button
                    type="button"
                    aria-pressed={spoken}
                    onClick={() => onToggleSpoken(player)}
                    className={`tactile-btn inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl border-2 px-4 py-2 text-base font-bold ${
                      spoken
                        ? activeBtn
                        : 'border-[var(--border-hairline)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:brightness-95'
                    }`}
                  >
                    <CheckCircleIcon className="h-5 w-5 shrink-0" />
                    <span>{spoken ? 'Kerrottu ääneen' : 'Kerroin ääneen'}</span>
                  </button>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            disabled={!canProceed}
            onClick={onAdvance}
            className="tactile-btn inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent-primary)] px-6 py-3 text-lg font-bold text-white shadow-[0_5px_0_var(--accent-primary-depth)] hover:bg-[var(--accent-primary-hover)] disabled:opacity-45 disabled:pointer-events-none"
          >
            <span>Jatka tunteisiin</span>
            <ArrowRightIcon className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* STEP 2: Player 1 Feelings & Need */}
      {state.mirilkaStep === 2 && renderPlayerFeelingAndNeed(1)}

      {/* STEP 3: Player 2 Feelings & Need */}
      {state.mirilkaStep === 3 && renderPlayerFeelingAndNeed(2)}

      {/* STEP 4: Mutual Understanding, Repair & Agreement for Next Time */}
      {state.mirilkaStep === 4 && p1EmotionObj && p2EmotionObj && (
        <div className="space-y-5">
          {/* Empathy Recap: Understand how the other felt */}
          <div className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-subtle)] p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display text-lg sm:text-xl font-extrabold text-[var(--text-primary)]">
                Ymmärrämmekö, miltä toisesta tuntui?
              </h2>
              {renderSpeakButton(
                'step4-recap',
                `Ymmärrämmekö, miltä toisesta tuntui? ${charA.name} tunsi: ${p1EmotionObj.label}, ja tarvitsi: ${state.p1Need}. ${charB.name} tunsi: ${p2EmotionObj.label}, ja tarvitsi: ${state.p2Need}.`,
                'Kuuntele molempien tunteet'
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { char: charA, emo: p1EmotionObj, need: state.p1Need },
                { char: charB, emo: p2EmotionObj, need: state.p2Need },
              ].map(({ char, emo, need }) => (
                <div
                  key={`recap-${char.id}`}
                  className="flex items-center gap-3 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-3"
                >
                  <CharacterAvatar
                    character={char}
                    emotionId={emo.id}
                    size={54}
                  />
                  <div className="min-w-0">
                    <div className="text-base font-extrabold text-[var(--text-primary)]">
                      {char.name}: {emo.emoji} {emo.label}
                    </div>
                    <div className="text-sm sm:text-base font-semibold text-[var(--text-muted)]">
                      Tarve: {need}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Repair & Future Agreement Question */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display text-lg sm:text-xl font-extrabold text-[var(--text-primary)]">
                Miten korjaamme tilanteen? Mitä sovimme jatkossa?
              </h2>
              {renderSpeakButton(
                'step4-agree',
                'Miten voimme korjata tilanteen nyt? Ja mitä sovimme seuraavaa kertaa varten? Valitkaa yhdessä yksi tai useampi sopimus.',
                'Kuuntele sovintokysymys'
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {MIRILKA_AGREEMENTS.map((agreement) => {
                const selected = state.mirilkaAgreements.includes(agreement);
                return (
                  <button
                    key={agreement}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => onToggleAgreement(agreement)}
                    className={`tactile-btn flex min-h-[52px] items-center gap-2.5 rounded-2xl border-2 px-4 py-3 text-left text-base font-bold ${
                      selected
                        ? 'border-[var(--accent-secondary)] bg-[var(--accent-secondary-soft)] text-[var(--text-primary)]'
                        : 'border-[var(--border-hairline)] bg-[var(--bg-subtle)] text-[var(--text-primary)] hover:border-[var(--accent-secondary)]/50'
                    }`}
                  >
                    <CheckCircleIcon
                      className={`h-5 w-5 shrink-0 ${
                        selected
                          ? 'text-[var(--accent-secondary)]'
                          : 'text-[var(--text-muted)]/40'
                      }`}
                    />
                    <span>{agreement}</span>
                  </button>
                );
              })}
            </div>

            <input
              type="text"
              maxLength={180}
              value={state.mirilkaCustomAgreement}
              onChange={(e) => onSetCustomAgreement(e.target.value)}
              placeholder="Tai kirjoita oma sopimus..."
              className="min-h-[48px] w-full rounded-2xl border-2 border-[var(--border-hairline)] bg-[var(--bg-subtle)] px-4 py-2.5 text-base font-semibold text-[var(--text-primary)] focus:border-[var(--accent-secondary)] focus:outline-none"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <button
              type="button"
              onClick={onBackStep}
              className="tactile-btn inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-subtle)] px-5 py-3 text-lg font-bold text-[var(--text-primary)] hover:brightness-95 sm:w-1/3"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Takaisin</span>
            </button>

            <button
              type="button"
              disabled={!canProceed}
              onClick={onAdvance}
              className="tactile-btn inline-flex min-h-[56px] items-center justify-center gap-2 rounded-2xl bg-[var(--accent-secondary)] px-6 py-3 text-lg font-bold text-white shadow-[0_5px_0_var(--accent-secondary-depth)] hover:bg-[var(--accent-secondary-hover)] disabled:opacity-45 disabled:pointer-events-none sm:w-2/3"
            >
              <HandshakeIcon className="h-5 w-5" />
              <span>Molemmat hyväksyvät sopimuksen!</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Final Peace Agreement Card + End-of-Meeting "How do you feel now?" */}
      {state.mirilkaStep === 5 && p1EmotionObj && p2EmotionObj && (
        <div className="space-y-5">
          <div className="flex items-stretch justify-around gap-4 rounded-3xl border border-[var(--border-hairline)] bg-gradient-to-b from-[var(--bg-stage-top)] to-[var(--bg-stage-bottom)] p-5 no-select">
            {[
              {
                char: charA,
                thenEmo: p1EmotionObj,
                nowEmo: p1NowEmotionObj,
                need: state.p1Need,
              },
              {
                char: charB,
                thenEmo: p2EmotionObj,
                nowEmo: p2NowEmotionObj,
                need: state.p2Need,
              },
            ].map(({ char, thenEmo, nowEmo, need }) => (
              <div
                key={char.id}
                className="flex w-1/2 flex-col items-center gap-2"
              >
                <CharacterAvatar
                  character={char}
                  emotionId={nowEmo?.id ?? 'ilo'}
                  size={92}
                />
                <span className="rounded-xl bg-[var(--bg-surface)] px-3.5 py-1.5 text-base font-bold text-[var(--text-primary)] shadow-sm">
                  {char.name}
                </span>
                <div className="w-full rounded-2xl border-2 border-[var(--accent-secondary)] bg-[var(--accent-secondary-soft)] px-3 py-2 text-center text-sm sm:text-base font-semibold text-[var(--text-primary)] space-y-0.5">
                  <div>
                    Silloin: {thenEmo.emoji} {thenEmo.label}
                  </div>
                  {nowEmo && (
                    <div className="font-bold text-[var(--accent-primary)]">
                      Nyt: {nowEmo.emoji} {nowEmo.label}
                    </div>
                  )}
                  <div className="text-[var(--text-muted)] text-sm">
                    Tarve: {need}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border-2 border-[var(--accent-secondary)] bg-[var(--accent-secondary-soft)] p-4 sm:p-5 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="font-display text-lg sm:text-xl font-extrabold text-[var(--text-primary)]">
                Meidän sopimus:
              </div>
              {renderSpeakButton(
                'step5-all',
                finalAgreementSpeech,
                'Kuuntele sopimus'
              )}
            </div>

            <ul className="space-y-1.5 text-base sm:text-lg font-bold text-[var(--text-primary)]">
              {allAgreements.map((rule) => (
                <li key={rule} className="flex items-start gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-[var(--accent-secondary)] shrink-0 mt-1" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Closing Mediation Question: How do you feel NOW? */}
          <div className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-subtle)] p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display text-lg sm:text-xl font-extrabold text-[var(--text-primary)]">
                Miltä sinusta tuntuu nyt?
              </h2>
              {renderSpeakButton(
                'step5-now-q',
                `Tapaamisen lopuksi: Miltä sinusta tuntuu nyt? Sekä ${charA.name} että ${charB.name} voivat valita tunteensa nyt.`,
                'Kuuntele kysymys: Miltä sinusta tuntuu nyt'
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[
                {
                  player: 1 as const,
                  char: charA,
                  selectedNow: state.p1NowEmo,
                  accentBorder: 'border-[var(--accent-primary)]',
                  accentSoft: 'bg-[var(--accent-primary-soft)]',
                },
                {
                  player: 2 as const,
                  char: charB,
                  selectedNow: state.p2NowEmo,
                  accentBorder: 'border-[var(--accent-secondary)]',
                  accentSoft: 'bg-[var(--accent-secondary-soft)]',
                },
              ].map(({ player, char, selectedNow, accentBorder, accentSoft }) => (
                <div
                  key={`now-${char.id}`}
                  className="space-y-2 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-3.5"
                >
                  <div className="text-base font-extrabold text-[var(--text-primary)]">
                    {char.name}:
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                    {EMOTIONS.map((e) => {
                      const active = selectedNow === e.id;
                      return (
                        <button
                          key={`now-p${player}-${e.id}`}
                          type="button"
                          aria-pressed={active}
                          onClick={() => onPickNowEmotion(player, e.id)}
                          className={`tactile-btn flex min-h-[58px] flex-col items-center justify-center gap-0.5 rounded-xl border-2 p-1.5 ${
                            active
                              ? `${accentBorder} ${accentSoft}`
                              : 'border-[var(--border-hairline)] bg-[var(--bg-subtle)] hover:border-[var(--accent-primary)]/40'
                          }`}
                        >
                          <span className="text-xl" aria-hidden="true">
                            {e.emoji}
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-[var(--text-primary)] leading-tight">
                            {e.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              stopSpeech();
              onExit();
            }}
            className="tactile-btn min-h-[56px] w-full rounded-2xl bg-[var(--accent-primary)] px-6 py-3 text-lg font-bold text-white shadow-[0_5px_0_var(--accent-primary-depth)] hover:bg-[var(--accent-primary-hover)]"
          >
            Sovimme riidan! ✋
          </button>
        </div>
      )}
    </section>
  );
};
