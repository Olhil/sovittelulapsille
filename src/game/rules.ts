import { CHARACTERS, EMOTIONS, SCENARIOS } from './data';
import type {
  Character,
  CharacterId,
  Emotion,
  EmotionId,
  GameMode,
  GameState,
  Scenario,
} from './types';

export function createInitialState(
  unlockedStickers: string[] = [],
  options: { autostart?: boolean; muted?: boolean } = {}
): GameState {
  const validStickers = sanitizeStickerIds(unlockedStickers);
  return {
    screen: options.autostart ? 'story' : 'home',
    mode: 'story',
    charAId: 'fox',
    charBId: 'bear',
    scenarioIndex: 0,
    step: 1,
    selectedEmotionA: 'viha',
    builtObs: false,
    builtQuestion: false,
    chosenAnswerEmo: null,
    chosenNeed: null,
    unlockedStickers: validStickers,
    feedbackHint: null,
    shakeTarget: 'none',
    mirilkaStep: 1,
    p1Story: '',
    p2Story: '',
    p1Spoken: false,
    p2Spoken: false,
    p1Emo: null,
    p2Emo: null,
    p1NowEmo: null,
    p2NowEmo: null,
    p1Need: '',
    p2Need: '',
    mirilkaAgreements: [],
    mirilkaCustomAgreement: '',
    muted: Boolean(options.muted),
  };
}

export function sanitizeStickerIds(ids: unknown): string[] {
  if (!Array.isArray(ids)) return [];
  const validIds = new Set(SCENARIOS.map((s) => s.id));
  const unique: string[] = [];
  for (const item of ids) {
    if (typeof item === 'string' && validIds.has(item) && !unique.includes(item)) {
      unique.push(item);
    }
  }
  return unique;
}

export function getCharacter(id: CharacterId): Character {
  return CHARACTERS.find((c) => c.id === id) ?? CHARACTERS[0];
}

export function getEmotion(id: EmotionId): Emotion {
  return EMOTIONS.find((e) => e.id === id) ?? EMOTIONS[0];
}

export function getScenario(index: number): Scenario {
  const safeIndex = ((index % SCENARIOS.length) + SCENARIOS.length) % SCENARIOS.length;
  return SCENARIOS[safeIndex];
}

export function getBodyDataState(state: GameState): string {
  switch (state.screen) {
    case 'home':
      return 'title';
    case 'select_chars':
      return 'selecting';
    case 'story_picker':
      return 'story_picker';
    case 'story':
      return state.step === 4 ? 'victory' : 'playing';
    case 'mirilka':
      return 'mirilka';
    case 'custom_conflict':
      return 'custom_conflict';
    case 'album':
      return 'album';
    case 'house':
      return 'house';
  }
}

export function navigateHome(state: GameState): GameState {
  return {
    ...state,
    screen: 'home',
    feedbackHint: null,
    shakeTarget: 'none',
  };
}

export function openAlbumScreen(state: GameState): GameState {
  return {
    ...state,
    screen: 'album',
    feedbackHint: null,
    shakeTarget: 'none',
  };
}

export function openHouseScreen(state: GameState): GameState {
  return {
    ...state,
    screen: 'house',
    feedbackHint: null,
    shakeTarget: 'none',
  };
}

export function openStoryPickerScreen(state: GameState): GameState {
  return {
    ...state,
    screen: 'story_picker',
    feedbackHint: null,
    shakeTarget: 'none',
  };
}

export function openCustomConflictScreen(state: GameState): GameState {
  return {
    ...state,
    screen: 'custom_conflict',
    feedbackHint: null,
    shakeTarget: 'none',
  };
}

export function startSetupMode(
  state: GameState,
  mode: GameMode,
  scenarioIndex?: number
): GameState {
  return {
    ...state,
    mode,
    screen: 'select_chars',
    scenarioIndex:
      typeof scenarioIndex === 'number'
        ? ((scenarioIndex % SCENARIOS.length) + SCENARIOS.length) % SCENARIOS.length
        : state.scenarioIndex,
    feedbackHint: null,
    shakeTarget: 'none',
  };
}

export function selectCharacterSlot(
  state: GameState,
  slot: 'A' | 'B',
  charId: CharacterId
): GameState {
  if (slot === 'A') {
    if (charId === state.charBId) {
      return { ...state, charAId: charId, charBId: state.charAId };
    }
    return { ...state, charAId: charId };
  }
  if (charId === state.charAId) {
    return { ...state, charBId: charId, charAId: state.charBId };
  }
  return { ...state, charBId: charId };
}

export function launchSelectedMode(state: GameState): GameState {
  if (state.mode === 'story') {
    return startScenarioAt(state, state.scenarioIndex);
  }
  return {
    ...state,
    screen: 'mirilka',
    mirilkaStep: 1,
    p1Story: '',
    p2Story: '',
    p1Spoken: false,
    p2Spoken: false,
    p1Emo: null,
    p2Emo: null,
    p1NowEmo: null,
    p2NowEmo: null,
    p1Need: '',
    p2Need: '',
    mirilkaAgreements: [],
    mirilkaCustomAgreement: '',
    feedbackHint: null,
    shakeTarget: 'none',
  };
}

export function startScenarioAt(state: GameState, idx: number): GameState {
  const normalized = ((idx % SCENARIOS.length) + SCENARIOS.length) % SCENARIOS.length;
  return {
    ...state,
    screen: 'story',
    mode: 'story',
    scenarioIndex: normalized,
    step: 1,
    selectedEmotionA: 'viha',
    builtObs: false,
    builtQuestion: false,
    chosenAnswerEmo: null,
    chosenNeed: null,
    feedbackHint: null,
    shakeTarget: 'none',
  };
}

export function pickDetectorEmotion(state: GameState, emoId: EmotionId): GameState {
  if (state.step !== 1) return state;
  return {
    ...state,
    selectedEmotionA: emoId,
    feedbackHint: null,
    shakeTarget: 'none',
  };
}

export function evaluateDetectorEmotion(
  state: GameState
): { nextState: GameState; outcome: 'success' | 'error' } {
  const sc = getScenario(state.scenarioIndex);
  if (state.selectedEmotionA === sc.trueEmotion) {
    return {
      outcome: 'success',
      nextState: {
        ...state,
        step: 2,
        feedbackHint: null,
        shakeTarget: 'none',
      },
    };
  }
  return {
    outcome: 'error',
    nextState: {
      ...state,
      feedbackHint:
        'Ei ihan! Huuto on vain kuori. Katso silmiä. Mikä tunne on sisällä?',
      shakeTarget: 'charA',
    },
  };
}

export function applyPhraseChip(
  state: GameState,
  chipType: 'obs' | 'question' | 'toxic'
): { nextState: GameState; outcome: 'tap' | 'complete' | 'error' } {
  if (state.step !== 2) {
    return { nextState: state, outcome: 'tap' };
  }
  if (chipType === 'toxic') {
    return {
      outcome: 'error',
      nextState: {
        ...state,
        feedbackHint:
          'Hups! Syyttely tekee mielen pahemmaksi. Kysy mieluummin tunteista.',
        shakeTarget: 'stage',
      },
    };
  }

  const builtObs = chipType === 'obs' ? true : state.builtObs;
  const builtQuestion = chipType === 'question' ? true : state.builtQuestion;
  const completed = builtObs && builtQuestion;

  return {
    outcome: completed ? 'complete' : 'tap',
    nextState: {
      ...state,
      builtObs,
      builtQuestion,
      feedbackHint: null,
      shakeTarget: 'none',
      step: completed ? 3 : 2,
    },
  };
}

export function selectAnswerEmotion(state: GameState, emoId: EmotionId): GameState {
  if (state.step !== 3) return state;
  return {
    ...state,
    chosenAnswerEmo: emoId,
    feedbackHint: null,
    shakeTarget: 'none',
  };
}

export function evaluateAnswerNeed(
  state: GameState,
  needIdx: number
): { nextState: GameState; outcome: 'success' | 'error'; newlyUnlocked: boolean } {
  const sc = getScenario(state.scenarioIndex);
  if (needIdx === sc.correctNeed) {
    const alreadyUnlocked = state.unlockedStickers.includes(sc.id);
    const unlockedStickers = alreadyUnlocked
      ? state.unlockedStickers
      : [...state.unlockedStickers, sc.id];

    return {
      outcome: 'success',
      newlyUnlocked: !alreadyUnlocked,
      nextState: {
        ...state,
        chosenNeed: needIdx,
        unlockedStickers,
        step: 4,
        feedbackHint: null,
        shakeTarget: 'none',
      },
    };
  }

  return {
    outcome: 'error',
    newlyUnlocked: false,
    nextState: {
      ...state,
      feedbackHint: 'Mieti vielä. Miksi hahmolla tuli paha mieli?',
      shakeTarget: 'charA',
    },
  };
}

export function setMirilkaStory(
  state: GameState,
  player: 1 | 2,
  story: string
): GameState {
  const trimmedSlice = story.slice(0, 220);
  if (player === 1) {
    return { ...state, p1Story: trimmedSlice };
  }
  return { ...state, p2Story: trimmedSlice };
}

export function toggleMirilkaSpoken(
  state: GameState,
  player: 1 | 2
): GameState {
  if (player === 1) {
    return { ...state, p1Spoken: !state.p1Spoken };
  }
  return { ...state, p2Spoken: !state.p2Spoken };
}

export function pickMirilkaEmotion(
  state: GameState,
  player: 1 | 2,
  emoId: EmotionId
): GameState {
  if (player === 1) {
    return { ...state, p1Emo: emoId };
  }
  return { ...state, p2Emo: emoId };
}

export function pickMirilkaNowEmotion(
  state: GameState,
  player: 1 | 2,
  emoId: EmotionId
): GameState {
  if (player === 1) {
    return { ...state, p1NowEmo: emoId };
  }
  return { ...state, p2NowEmo: emoId };
}

export function setMirilkaNeed(
  state: GameState,
  player: 1 | 2,
  need: string
): GameState {
  const safeNeed = need.slice(0, 120);
  if (player === 1) {
    return { ...state, p1Need: safeNeed };
  }
  return { ...state, p2Need: safeNeed };
}

export function toggleMirilkaAgreement(
  state: GameState,
  agreement: string
): GameState {
  const exists = state.mirilkaAgreements.includes(agreement);
  const next = exists
    ? state.mirilkaAgreements.filter((item) => item !== agreement)
    : [...state.mirilkaAgreements, agreement];
  return { ...state, mirilkaAgreements: next };
}

export function setMirilkaCustomAgreement(
  state: GameState,
  text: string
): GameState {
  return { ...state, mirilkaCustomAgreement: text.slice(0, 180) };
}

export function canAdvanceMirilka(state: GameState): boolean {
  if (state.mirilkaStep === 1) {
    const p1Done = state.p1Spoken || state.p1Story.trim().length > 0;
    const p2Done = state.p2Spoken || state.p2Story.trim().length > 0;
    return p1Done && p2Done;
  }
  if (state.mirilkaStep === 2) {
    return Boolean(state.p1Emo) && state.p1Need.trim().length > 0;
  }
  if (state.mirilkaStep === 3) {
    return Boolean(state.p2Emo) && state.p2Need.trim().length > 0;
  }
  if (state.mirilkaStep === 4) {
    return (
      state.mirilkaAgreements.length > 0 ||
      state.mirilkaCustomAgreement.trim().length > 0
    );
  }
  return false;
}

export function advanceMirilka(state: GameState): GameState {
  if (!canAdvanceMirilka(state)) return state;
  if (state.mirilkaStep === 1) return { ...state, mirilkaStep: 2 };
  if (state.mirilkaStep === 2) return { ...state, mirilkaStep: 3 };
  if (state.mirilkaStep === 3) return { ...state, mirilkaStep: 4 };
  if (state.mirilkaStep === 4) return { ...state, mirilkaStep: 5 };
  return state;
}

export function goBackMirilka(state: GameState): GameState {
  if (state.mirilkaStep === 2) return { ...state, mirilkaStep: 1 };
  if (state.mirilkaStep === 3) return { ...state, mirilkaStep: 2 };
  if (state.mirilkaStep === 4) return { ...state, mirilkaStep: 3 };
  if (state.mirilkaStep === 5) return { ...state, mirilkaStep: 4 };
  return state;
}

export function parseAutostartFlag(search: string): boolean {
  const params = new URLSearchParams(search);
  return params.get('autostart') === '1';
}

export function formatStorySituation(
  situation: string,
  charA: Character,
  charB: Character
): string {
  return situation
    .replace(/Hahmo A:n/g, `${charA.name}:n`)
    .replace(/Hahmo A:lle/g, `${charA.name}:lle`)
    .replace(/Hahmo A/g, charA.name)
    .replace(/Hahmo B:n/g, `${charB.name}:n`)
    .replace(/Hahmo B/g, charB.name);
}
