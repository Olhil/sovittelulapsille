import test from 'node:test';
import assert from 'node:assert/strict';
import {
  advanceMirilka,
  applyPhraseChip,
  createInitialState,
  evaluateAnswerNeed,
  evaluateDetectorEmotion,
  formatStorySituation,
  getBodyDataState,
  goBackMirilka,
  openCustomConflictScreen,
  openHouseScreen,
  openStoryPickerScreen,
  parseAutostartFlag,
  pickDetectorEmotion,
  pickMirilkaEmotion,
  pickMirilkaNowEmotion,
  sanitizeStickerIds,
  selectAnswerEmotion,
  selectCharacterSlot,
  setMirilkaCustomAgreement,
  setMirilkaNeed,
  setMirilkaStory,
  startScenarioAt,
  startSetupMode,
  toggleMirilkaAgreement,
  toggleMirilkaSpoken,
} from './rules';
import { CHARACTERS, EMOTIONS, SCENARIOS } from './data';
import {
  analyzeCustomConflict,
  buildMirilkaAgreementSpeechText,
  sanitizeSavedConflicts,
} from './conflictAnalysis';
import {
  buildEmotionCardSpeechText,
  buildEmotionPreviewSpeechText,
} from '../utils/speech';

test('createInitialState respects autostart flag and sanitizes sticker ids', () => {
  const normal = createInitialState(['tower', 'invalid-id', 'tower']);
  assert.equal(normal.screen, 'home');
  assert.deepEqual(normal.unlockedStickers, ['tower']);

  const auto = createInitialState([], { autostart: true });
  assert.equal(auto.screen, 'story');
  assert.equal(getBodyDataState(auto), 'playing');
  assert.equal(parseAutostartFlag('?autostart=1'), true);
  assert.equal(parseAutostartFlag('?autostart=0'), false);
});

test('EMOTIONS contains all 11 required Finnish emotions with selkokieli fields', () => {
  assert.equal(EMOTIONS.length, 11);
  const ids = EMOTIONS.map((e) => e.id);
  for (const required of [
    'ilo',
    'rakkaus',
    'viha',
    'raivo',
    'arsytys',
    'harmitus',
    'pettymys',
    'suru',
    'pelko',
    'ahdistus',
    'hapea',
  ]) {
    assert.ok(ids.includes(required as (typeof EMOTIONS)[number]['id']));
  }
  for (const emo of EMOTIONS) {
    assert.ok(emo.bodyText.length > 0);
    assert.ok(emo.needText.length > 0);
    assert.ok(emo.helpText.length > 0);
  }
});

test('openHouseScreen switches cleanly to Tunteiden talo', () => {
  const houseState = openHouseScreen(createInitialState());
  assert.equal(houseState.screen, 'house');
  assert.equal(getBodyDataState(houseState), 'house');
});

test('selectCharacterSlot prevents duplicate characters by swapping slots', () => {
  let state = createInitialState();
  assert.equal(state.charAId, 'fox');
  assert.equal(state.charBId, 'bear');

  state = selectCharacterSlot(state, 'A', 'bear');
  assert.equal(state.charAId, 'bear');
  assert.equal(state.charBId, 'fox');

  state = selectCharacterSlot(state, 'B', 'bear');
  assert.equal(state.charBId, 'bear');
  assert.equal(state.charAId, 'fox');
});

test('Story Step 1 detects true emotion and rejects wrong emotions including new scenarios', () => {
  let state = startScenarioAt(createInitialState(), 0); // tower -> harmitus
  state = pickDetectorEmotion(state, 'viha');
  const wrong = evaluateDetectorEmotion(state);
  assert.equal(wrong.outcome, 'error');
  assert.equal(wrong.nextState.step, 1);
  assert.ok(wrong.nextState.feedbackHint);

  state = pickDetectorEmotion(wrong.nextState, 'harmitus');
  const right = evaluateDetectorEmotion(state);
  assert.equal(right.outcome, 'success');
  assert.equal(right.nextState.step, 2);
  assert.equal(right.nextState.feedbackHint, null);

  // Verify new scenarios: trip (pettymys), board (ahdistus), pen (arsytys)
  let trip = startScenarioAt(createInitialState(), 5);
  trip = pickDetectorEmotion(trip, 'pettymys');
  assert.equal(evaluateDetectorEmotion(trip).outcome, 'success');

  let board = startScenarioAt(createInitialState(), 6);
  board = pickDetectorEmotion(board, 'ahdistus');
  assert.equal(evaluateDetectorEmotion(board).outcome, 'success');

  let pen = startScenarioAt(createInitialState(), 7);
  pen = pickDetectorEmotion(pen, 'arsytys');
  assert.equal(evaluateDetectorEmotion(pen).outcome, 'success');
});

test('Story Step 2 rejects toxic chip and advances when both observation and question chips are tapped', () => {
  let state = startScenarioAt(createInitialState(), 0);
  state = { ...state, step: 2 };

  const toxic = applyPhraseChip(state, 'toxic');
  assert.equal(toxic.outcome, 'error');
  assert.equal(toxic.nextState.step, 2);
  assert.equal(toxic.nextState.shakeTarget, 'stage');

  const obs = applyPhraseChip(toxic.nextState, 'obs');
  assert.equal(obs.outcome, 'tap');
  assert.equal(obs.nextState.builtObs, true);
  assert.equal(obs.nextState.step, 2);

  const done = applyPhraseChip(obs.nextState, 'question');
  assert.equal(done.outcome, 'complete');
  assert.equal(done.nextState.builtQuestion, true);
  assert.equal(done.nextState.step, 3);
});

test('Story Step 3 validates correct need and unlocks sticker exactly once', () => {
  let state = startScenarioAt(createInitialState(), 1); // game -> correctNeed: 1
  state = { ...state, step: 3 };
  state = selectAnswerEmotion(state, 'suru');

  const wrong = evaluateAnswerNeed(state, 0);
  assert.equal(wrong.outcome, 'error');
  assert.equal(wrong.newlyUnlocked, false);
  assert.equal(wrong.nextState.step, 3);

  const right = evaluateAnswerNeed(wrong.nextState, 1);
  assert.equal(right.outcome, 'success');
  assert.equal(right.newlyUnlocked, true);
  assert.equal(right.nextState.step, 4);
  assert.deepEqual(right.nextState.unlockedStickers, ['game']);
  assert.equal(getBodyDataState(right.nextState), 'victory');

  const repeat = evaluateAnswerNeed({ ...right.nextState, step: 3 }, 1);
  assert.equal(repeat.newlyUnlocked, false);
  assert.deepEqual(repeat.nextState.unlockedStickers, ['game']);
});

test('All 8 scenarios have valid correctNeed index, unique ids, and valid trueEmotion', () => {
  assert.equal(SCENARIOS.length, 8);
  const ids = new Set<string>();
  const emoIds = new Set(EMOTIONS.map((e) => e.id));
  for (const sc of SCENARIOS) {
    assert.ok(!ids.has(sc.id));
    ids.add(sc.id);
    assert.ok(emoIds.has(sc.trueEmotion));
    assert.ok(sc.correctNeed >= 0 && sc.correctNeed < sc.needOptions.length);
  }
  assert.equal(sanitizeStickerIds(SCENARIOS.map((s) => s.id)).length, 8);
});

test('Mirilka 2-player mediation covers all 5 steps with validation and back navigation', () => {
  let state = startSetupMode(createInitialState(), 'mirilka');
  state = { ...state, screen: 'mirilka', mirilkaStep: 1 };

  // Step 1 requires both players to share what happened (text or spoken aloud)
  assert.equal(advanceMirilka(state).mirilkaStep, 1);
  state = setMirilkaStory(state, 1, 'Meille tuli riita vuorosta.');
  assert.equal(advanceMirilka(state).mirilkaStep, 1);
  state = toggleMirilkaSpoken(state, 2);
  state = advanceMirilka(state);
  assert.equal(state.mirilkaStep, 2);

  // Step 2 requires Player 1 emotion AND need
  state = pickMirilkaEmotion(state, 1, 'harmitus');
  assert.equal(advanceMirilka(state).mirilkaStep, 2);
  state = setMirilkaNeed(state, 1, 'kuuntelua');
  state = advanceMirilka(state);
  assert.equal(state.mirilkaStep, 3);

  // Step 3 requires Player 2 emotion AND need
  state = pickMirilkaEmotion(state, 2, 'pelko');
  assert.equal(advanceMirilka(state).mirilkaStep, 3);
  state = setMirilkaNeed(state, 2, 'reilun vuoron');
  state = advanceMirilka(state);
  assert.equal(state.mirilkaStep, 4);

  // Back navigation works cleanly
  assert.equal(goBackMirilka(state).mirilkaStep, 3);

  // Step 4 requires at least one agreement (checkbox or custom)
  assert.equal(advanceMirilka(state).mirilkaStep, 4);
  state = toggleMirilkaAgreement(state, 'Vuorottelemme reilusti.');
  state = setMirilkaCustomAgreement(state, 'Leikitään yhdessä välitunnilla.');
  state = advanceMirilka(state);
  assert.equal(state.mirilkaStep, 5);

  state = pickMirilkaNowEmotion(state, 1, 'ilo');
  state = pickMirilkaNowEmotion(state, 2, 'rakkaus');
  assert.equal(state.p1NowEmo, 'ilo');
  assert.equal(state.p2NowEmo, 'rakkaus');

  const spoken = buildMirilkaAgreementSpeechText({
    charAName: 'Kettu Vilkku',
    charBName: 'Karhu Otso',
    p1Story: state.p1Story,
    p2Story: state.p2Story,
    p1EmoLabel: 'Harmitus',
    p2EmoLabel: 'Pelko',
    p1NowEmoLabel: 'Ilo',
    p2NowEmoLabel: 'Rakkaus',
    p1Need: state.p1Need,
    p2Need: state.p2Need,
    agreements: state.mirilkaAgreements,
    customAgreement: state.mirilkaCustomAgreement,
  });
  assert.ok(spoken.includes('Sovintosopimus'));
  assert.ok(spoken.includes('Vuorottelemme reilusti.'));
  assert.ok(spoken.includes('Leikitään yhdessä välitunnilla.'));
  assert.ok(spoken.includes('Nyt Kettu Vilkku tuntee: Ilo.'));
  assert.ok(spoken.includes('Nyt Karhu Otso tuntee: Rakkaus.'));
});

test('formatStorySituation replaces generic Hahmo A / Hahmo B with selected names', () => {
  const text = formatStorySituation(
    SCENARIOS[0].situation,
    CHARACTERS[0],
    CHARACTERS[1]
  );
  assert.ok(text.includes('Kettu Vilkku'));
  assert.ok(text.includes('Karhu Otso'));
  assert.ok(!text.includes('Hahmo A'));
  assert.ok(!text.includes('Hahmo B'));
});

test('Emotion card speech text builders cover all 11 emotions cleanly', () => {
  for (const emo of EMOTIONS) {
    const full = buildEmotionCardSpeechText(emo);
    assert.ok(full.includes(emo.label));
    assert.ok(full.includes(emo.houseTitle));
    assert.ok(full.includes(emo.bodyText));
    assert.ok(full.includes(emo.needText));
    assert.ok(full.includes(emo.helpText));

    const preview = buildEmotionPreviewSpeechText(emo);
    assert.ok(preview.includes(emo.label));
    assert.ok(preview.includes(emo.bodyText));
  }
});

test('Story picker and custom conflict screen transitions update state cleanly', () => {
  const initial = createInitialState();
  const picker = openStoryPickerScreen(initial);
  assert.equal(picker.screen, 'story_picker');
  assert.equal(getBodyDataState(picker), 'story_picker');

  const chosen = startScenarioAt(picker, 5);
  assert.equal(chosen.screen, 'story');
  assert.equal(chosen.scenarioIndex, 5);

  const custom = openCustomConflictScreen(initial);
  assert.equal(custom.screen, 'custom_conflict');
  assert.equal(getBodyDataState(custom), 'custom_conflict');
});

test('analyzeCustomConflict builds selkokieli breakdown, I-message, and sanitizes saved entries', () => {
  const result = analyzeCustomConflict({
    myName: 'Leo',
    otherName: 'Milo',
    whatHappened: 'Milo otti palloni ilman lupaa.',
    myReaction: 'Huusin hänelle.',
    myEmotion: 'viha',
    otherEmotion: 'pelko',
    myNeed: 'reilun vuoron',
    nextStep: 'Ehdotan, että vuorottelemme.',
  });

  assert.equal(result.myName, 'Leo');
  assert.equal(result.otherName, 'Milo');
  assert.equal(result.myEmotion.id, 'viha');
  assert.equal(result.otherEmotion?.id, 'pelko');
  assert.ok(result.iMessage.includes('Minusta tuntuu vihaiselta'));
  assert.ok(result.iMessage.includes('Milo otti palloni ilman lupaa'));
  assert.ok(result.iMessage.includes('reilun vuoron'));
  assert.ok(result.otherPerspectiveText.includes('Milo'));
  assert.ok(result.fullSpeechText.includes('Oman riidan purku'));

  const unknownOther = analyzeCustomConflict({
    myName: '',
    otherName: '',
    whatHappened: 'Kaveri ei vastannut.',
    myReaction: '',
    myEmotion: 'suru',
    otherEmotion: 'unknown',
    myNeed: 'kuuntelua',
    nextStep: 'Kysyn kaverilta, miltä hänestä tuntuu.',
  });
  assert.equal(unknownOther.myName, 'Minä');
  assert.equal(unknownOther.otherName, 'Kaveri');
  assert.equal(unknownOther.otherEmotion, null);
  assert.ok(unknownOther.otherPerspectiveText.includes('Miltä sinusta tuntuu?'));

  const sanitized = sanitizeSavedConflicts([
    {
      id: 'c1',
      createdAt: '24.11.2026',
      myName: 'Leo',
      otherName: 'Milo',
      whatHappened: 'Riita pallosta',
      myReaction: '',
      myEmotion: 'harmitus',
      otherEmotion: 'invalid-emo',
      myNeed: 'kuuntelua',
      nextStep: 'Hengitän syvään.',
    },
    { id: 'bad', whatHappened: '', myEmotion: 'nope' },
  ]);
  assert.equal(sanitized.length, 1);
  assert.equal(sanitized[0].otherEmotion, 'unknown');
});
