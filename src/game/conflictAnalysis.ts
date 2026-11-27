import { EMOTIONS } from './data';
import { getEmotion } from './rules';
import type {
  CustomConflictDraft,
  Emotion,
  EmotionId,
  SavedCustomConflict,
} from './types';

export const CONFLICT_STARTERS: readonly string[] = [
  'Kaveri ei ottanut minua leikkiin.',
  'Minulle tärkeä tavara meni rikki.',
  'Toinen sanoi minulle ikävästi.',
  'Meille tuli riita vuorosta.',
] as const;

export const CONFLICT_NEEDS: readonly string[] = [
  'kuuntelua',
  'reilun vuoron',
  'omaa rauhaa',
  'anteeksipyynnön',
  'päästä mukaan leikkiin',
  'apua aikuiselta',
] as const;

export const CONFLICT_ACTIONS: readonly string[] = [
  'Kerron rauhallisesti, miltä minusta tuntuu.',
  'Kysyn kaverilta, miltä hänestä tuntuu.',
  'Pyydän anteeksi oman osani.',
  'Ehdotan, että vuorottelemme.',
  'Otan pienen tauon ja hengitän syvään.',
  'Pyydän aikuisen apua sopimiseen.',
] as const;

export const MIRILKA_AGREEMENTS: readonly string[] = [
  'Pyydämme anteeksi toisiltamme.',
  'Kuuntelemme toista keskeyttämättä.',
  'Vuorottelemme reilusti.',
  'Puhumme rauhallisesti ilman huutoa.',
  'Otamme toisen mukaan leikkiin.',
  'Pidämme pienen tauon, jos suututtaa.',
  'Pyydämme aikuisen apua, jos riita jatkuu.',
] as const;

export function buildMirilkaAgreementSpeechText(params: {
  charAName: string;
  charBName: string;
  p1Story: string;
  p2Story: string;
  p1EmoLabel: string;
  p2EmoLabel: string;
  p1NowEmoLabel?: string;
  p2NowEmoLabel?: string;
  p1Need: string;
  p2Need: string;
  agreements: string[];
  customAgreement: string;
}): string {
  const parts: string[] = ['Sovintosopimus.'];
  if (params.p1Story.trim()) {
    parts.push(`${params.charAName} kertoi: ${params.p1Story.trim()}.`);
  }
  if (params.p2Story.trim()) {
    parts.push(`${params.charBName} kertoi: ${params.p2Story.trim()}.`);
  }
  parts.push(
    `${params.charAName} tunsi silloin: ${params.p1EmoLabel}, ja tarvitsi: ${params.p1Need}.`
  );
  parts.push(
    `${params.charBName} tunsi silloin: ${params.p2EmoLabel}, ja tarvitsi: ${params.p2Need}.`
  );

  const allAgreements = [
    ...params.agreements,
    ...(params.customAgreement.trim() ? [params.customAgreement.trim()] : []),
  ];
  if (allAgreements.length > 0) {
    parts.push(`Sovimme yhdessä: ${allAgreements.join(' ')}`);
  }
  if (params.p1NowEmoLabel) {
    parts.push(`Nyt ${params.charAName} tuntee: ${params.p1NowEmoLabel}.`);
  }
  if (params.p2NowEmoLabel) {
    parts.push(`Nyt ${params.charBName} tuntee: ${params.p2NowEmoLabel}.`);
  }
  parts.push('Sovimme riidan!');
  return parts.join(' ');
}

const EMOTION_FEELING_CLAUSE: Record<EmotionId, string> = {
  ilo: 'Minusta tuntuu iloiselta',
  rakkaus: 'Minusta tuntuu lämpimältä',
  viha: 'Minusta tuntuu vihaiselta',
  raivo: 'Minusta tuntuu tosi vihaiselta',
  arsytys: 'Minua ärsyttää',
  harmitus: 'Minua harmittaa',
  pettymys: 'Minusta tuntuu pettyneeltä',
  suru: 'Minusta tuntuu surulliselta',
  pelko: 'Minua pelottaa',
  ahdistus: 'Minua ahdistaa',
  hapea: 'Minua hävettää',
};

export interface ConflictAnalysisResult {
  myName: string;
  otherName: string;
  whatHappened: string;
  myReaction: string;
  myEmotion: Emotion;
  otherEmotion: Emotion | null;
  myNeed: string;
  nextStep: string;
  iMessage: string;
  otherPerspectiveText: string;
  calmTip: string;
  fullSpeechText: string;
}

function cleanSentence(raw: string): string {
  return raw.trim().replace(/\s+/g, ' ');
}

function stripTrailingPunctuation(raw: string): string {
  return cleanSentence(raw).replace(/[.!?]+$/, '');
}

function lowercaseFirst(raw: string): string {
  if (!raw) return raw;
  return raw.charAt(0).toLowerCase() + raw.slice(1);
}

export function analyzeCustomConflict(
  draft: CustomConflictDraft
): ConflictAnalysisResult {
  const rawMyName = cleanSentence(draft.myName);
  const rawOtherName = cleanSentence(draft.otherName);
  const myName = rawMyName || 'Minä';
  const otherName = rawOtherName || 'Kaveri';
  const whatHappened = cleanSentence(draft.whatHappened);
  const myReaction = cleanSentence(draft.myReaction);
  const myEmotion = getEmotion(draft.myEmotion);
  const otherEmotion =
    draft.otherEmotion === 'unknown' ? null : getEmotion(draft.otherEmotion);
  const myNeed = cleanSentence(draft.myNeed) || CONFLICT_NEEDS[0];
  const nextStep = cleanSentence(draft.nextStep) || CONFLICT_ACTIONS[0];

  const feelingClause = EMOTION_FEELING_CLAUSE[myEmotion.id];
  const strippedEvent = stripTrailingPunctuation(whatHappened);
  const startsWithNamedPerson =
    (rawOtherName && strippedEvent.startsWith(rawOtherName)) ||
    (rawMyName && strippedEvent.startsWith(rawMyName));
  const eventClause = startsWithNamedPerson
    ? strippedEvent
    : lowercaseFirst(strippedEvent);
  const needClause = lowercaseFirst(stripTrailingPunctuation(myNeed));

  const iMessage = eventClause
    ? `«${feelingClause}, kun ${eventClause}. Tarvitsen ${needClause}. Miltä sinusta tuntuu?»`
    : `«${feelingClause}. Tarvitsen ${needClause}. Miltä sinusta tuntuu?»`;

  const otherPerspectiveText = otherEmotion
    ? `${otherName} voi tuntea: ${otherEmotion.label}. ${otherEmotion.needText}`
    : `Et tiedä vielä, miltä ${otherName} tuntee. Voit kysyä rauhallisesti: «Miltä sinusta tuntuu?»`;

  const calmTip = myEmotion.helpText;

  const fullSpeechText = [
    'Oman riidan purku.',
    `Mitä tapahtui: ${whatHappened}.`,
    `${myName} tuntee: ${myEmotion.label}. ${myEmotion.bodyText}`,
    `Mitä voit sanoa: ${iMessage}`,
    otherPerspectiveText,
    `Rauhoittumisvinkki: ${calmTip}`,
    `Seuraava askel: ${nextStep}`,
  ].join(' ');

  return {
    myName,
    otherName,
    whatHappened,
    myReaction,
    myEmotion,
    otherEmotion,
    myNeed,
    nextStep,
    iMessage,
    otherPerspectiveText,
    calmTip,
    fullSpeechText,
  };
}

export function sanitizeSavedConflicts(raw: unknown): SavedCustomConflict[] {
  if (!Array.isArray(raw)) return [];
  const validEmoIds = new Set<string>(EMOTIONS.map((e) => e.id));
  const cleaned: SavedCustomConflict[] = [];

  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const obj = item as Partial<SavedCustomConflict>;
    if (
      typeof obj.id !== 'string' ||
      typeof obj.whatHappened !== 'string' ||
      !obj.whatHappened.trim() ||
      typeof obj.myEmotion !== 'string' ||
      !validEmoIds.has(obj.myEmotion)
    ) {
      continue;
    }

    const otherEmo: EmotionId | 'unknown' =
      typeof obj.otherEmotion === 'string' && validEmoIds.has(obj.otherEmotion)
        ? (obj.otherEmotion as EmotionId)
        : 'unknown';

    cleaned.push({
      id: obj.id,
      createdAt:
        typeof obj.createdAt === 'string' && obj.createdAt.trim()
          ? obj.createdAt
          : '',
      myName: typeof obj.myName === 'string' ? obj.myName.slice(0, 30) : 'Minä',
      otherName:
        typeof obj.otherName === 'string' ? obj.otherName.slice(0, 30) : 'Kaveri',
      whatHappened: obj.whatHappened.slice(0, 260),
      myReaction:
        typeof obj.myReaction === 'string' ? obj.myReaction.slice(0, 160) : '',
      myEmotion: obj.myEmotion as EmotionId,
      otherEmotion: otherEmo,
      myNeed:
        typeof obj.myNeed === 'string' && obj.myNeed.trim()
          ? obj.myNeed.slice(0, 120)
          : CONFLICT_NEEDS[0],
      nextStep:
        typeof obj.nextStep === 'string' && obj.nextStep.trim()
          ? obj.nextStep.slice(0, 160)
          : CONFLICT_ACTIONS[0],
    });

    if (cleaned.length >= 20) break;
  }

  return cleaned;
}
