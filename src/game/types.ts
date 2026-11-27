export type CharacterId = 'fox' | 'bear' | 'bunny' | 'cat';

export type EmotionId =
  | 'ilo'
  | 'rakkaus'
  | 'viha'
  | 'raivo'
  | 'arsytys'
  | 'harmitus'
  | 'pettymys'
  | 'suru'
  | 'pelko'
  | 'ahdistus'
  | 'hapea';

export type GameMode = 'story' | 'mirilka';
export type GameScreen =
  | 'home'
  | 'select_chars'
  | 'story_picker'
  | 'story'
  | 'mirilka'
  | 'custom_conflict'
  | 'album'
  | 'house';
export type StoryStep = 1 | 2 | 3 | 4;
export type MirilkaStep = 1 | 2 | 3 | 4 | 5;
export type LegalTab = 'tos' | 'privacy' | 'copyright' | 'disclaimer';

export interface CustomConflictDraft {
  myName: string;
  otherName: string;
  whatHappened: string;
  myReaction: string;
  myEmotion: EmotionId;
  otherEmotion: EmotionId | 'unknown';
  myNeed: string;
  nextStep: string;
}

export interface SavedCustomConflict extends CustomConflictDraft {
  id: string;
  createdAt: string;
}

export interface Character {
  id: CharacterId;
  name: string;
  color: string;
  ears: CharacterId;
}

export interface Emotion {
  id: EmotionId;
  label: string;
  emoji: string;
  houseTitle: string;
  accentColor: string;
  bodyText: string;
  needText: string;
  helpText: string;
}

export interface Scenario {
  id: string;
  title: string;
  sticker: string;
  situation: string;
  maskShout: string;
  trueEmotion: EmotionId;
  observationChip: string;
  toxicChip: string;
  needOptions: readonly string[];
  correctNeed: number;
}

export interface GameState {
  screen: GameScreen;
  mode: GameMode;
  charAId: CharacterId;
  charBId: CharacterId;
  scenarioIndex: number;
  step: StoryStep;
  selectedEmotionA: EmotionId;
  builtObs: boolean;
  builtQuestion: boolean;
  chosenAnswerEmo: EmotionId | null;
  chosenNeed: number | null;
  unlockedStickers: string[];
  feedbackHint: string | null;
  shakeTarget: 'none' | 'charA' | 'stage';
  mirilkaStep: MirilkaStep;
  p1Story: string;
  p2Story: string;
  p1Spoken: boolean;
  p2Spoken: boolean;
  p1Emo: EmotionId | null;
  p2Emo: EmotionId | null;
  p1NowEmo: EmotionId | null;
  p2NowEmo: EmotionId | null;
  p1Need: string;
  p2Need: string;
  mirilkaAgreements: string[];
  mirilkaCustomAgreement: string;
  muted: boolean;
}
