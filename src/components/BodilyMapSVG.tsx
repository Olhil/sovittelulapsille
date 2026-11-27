import React, { useId, useState } from 'react';
import type { EmotionId } from '../game/types';
import { StopIcon, VolumeOnIcon } from './Icons';

type BodyRegionId = 'head' | 'chest' | 'stomach' | 'arms' | 'legs';

interface ZoneCircle {
  cx: number;
  cy: number;
  r: number;
  type: 'hot' | 'warm' | 'cool' | 'cold';
  opacity?: number;
}

const REGION_LABELS: Record<BodyRegionId, string> = {
  head: 'Pää',
  chest: 'Rinta',
  stomach: 'Vatsa',
  arms: 'Kädet',
  legs: 'Jalat',
};

const EMOTION_BODY_MAPS: Record<
  EmotionId,
  {
    zones: ZoneCircle[];
    regions: Record<BodyRegionId, string>;
  }
> = {
  ilo: {
    zones: [
      { cx: 110, cy: 48, r: 34, type: 'hot', opacity: 0.9 },
      { cx: 110, cy: 115, r: 44, type: 'hot', opacity: 0.95 },
      { cx: 110, cy: 170, r: 36, type: 'warm', opacity: 0.85 },
      { cx: 52, cy: 145, r: 28, type: 'warm', opacity: 0.8 },
      { cx: 168, cy: 145, r: 28, type: 'warm', opacity: 0.8 },
      { cx: 88, cy: 255, r: 34, type: 'warm', opacity: 0.72 },
      { cx: 132, cy: 255, r: 34, type: 'warm', opacity: 0.72 },
    ],
    regions: {
      head: 'Pää on kevyt ja hymy nousee kasvoille.',
      chest: 'Rinnassa on lämmin ja iloinen olo.',
      stomach: 'Vatsassa tuntuu hyvä ja rento olo.',
      arms: 'Kädet haluavat heilua tai halata.',
      legs: 'Jalat ovat kevyet ja tekevät mieli hyppiä.',
    },
  },
  rakkaus: {
    zones: [
      { cx: 110, cy: 50, r: 32, type: 'warm', opacity: 0.9 },
      { cx: 110, cy: 114, r: 46, type: 'hot', opacity: 0.98 },
      { cx: 110, cy: 166, r: 38, type: 'warm', opacity: 0.88 },
      { cx: 58, cy: 138, r: 28, type: 'warm', opacity: 0.78 },
      { cx: 162, cy: 138, r: 28, type: 'warm', opacity: 0.78 },
      { cx: 90, cy: 235, r: 24, type: 'warm', opacity: 0.5 },
      { cx: 130, cy: 235, r: 24, type: 'warm', opacity: 0.5 },
    ],
    regions: {
      head: 'Posket lämpenevät ja olo on rauhallinen.',
      chest: 'Sydänala on täynnä pehmeää lämpöä.',
      stomach: 'Vatsassa on lämmin ja turvallinen tunne.',
      arms: 'Kädet kaipaavat lempeää halausta.',
      legs: 'Jalat ovat rennot ja rauhalliset.',
    },
  },
  viha: {
    zones: [
      { cx: 110, cy: 48, r: 36, type: 'hot', opacity: 0.95 },
      { cx: 110, cy: 114, r: 44, type: 'hot', opacity: 0.95 },
      { cx: 52, cy: 120, r: 26, type: 'hot', opacity: 0.85 },
      { cx: 168, cy: 120, r: 26, type: 'hot', opacity: 0.85 },
      { cx: 42, cy: 185, r: 24, type: 'hot', opacity: 0.92 },
      { cx: 178, cy: 185, r: 24, type: 'hot', opacity: 0.92 },
    ],
    regions: {
      head: 'Pää kuumenee ja leuka menee yhteen.',
      chest: 'Rinnassa kiehuu ja henki kulkee nopeasti.',
      stomach: 'Vatsa jännittyy valmiiksi puolustamaan.',
      arms: 'Kädet ja nyrkit puristuvat tiukasti.',
      legs: 'Jalat painautuvat tiukasti maahan.',
    },
  },
  raivo: {
    zones: [
      { cx: 110, cy: 48, r: 42, type: 'hot', opacity: 1 },
      { cx: 110, cy: 116, r: 52, type: 'hot', opacity: 1 },
      { cx: 110, cy: 166, r: 32, type: 'warm', opacity: 0.85 },
      { cx: 52, cy: 125, r: 32, type: 'hot', opacity: 0.95 },
      { cx: 168, cy: 125, r: 32, type: 'hot', opacity: 0.95 },
      { cx: 42, cy: 186, r: 28, type: 'hot', opacity: 1 },
      { cx: 178, cy: 186, r: 28, type: 'hot', opacity: 1 },
    ],
    regions: {
      head: 'Koko pää on tulikuuma ja kasvot punoittavat.',
      chest: 'Rinnassa on tosi kuuma ja kova paine.',
      stomach: 'Vatsa on kireä kuin jousi.',
      arms: 'Käsivarret ja nyrkit ovat täynnä voimaa.',
      legs: 'Jalat tömistävät ja kaipaavat liikettä.',
    },
  },
  arsytys: {
    zones: [
      { cx: 110, cy: 62, r: 26, type: 'warm', opacity: 0.88 },
      { cx: 80, cy: 88, r: 26, type: 'hot', opacity: 0.85 },
      { cx: 140, cy: 88, r: 26, type: 'hot', opacity: 0.85 },
      { cx: 110, cy: 116, r: 28, type: 'warm', opacity: 0.72 },
      { cx: 42, cy: 182, r: 20, type: 'warm', opacity: 0.75 },
      { cx: 178, cy: 182, r: 20, type: 'warm', opacity: 0.75 },
    ],
    regions: {
      head: 'Otsa rypistyy ja leukaa kiristää.',
      chest: 'Hartiat nousevat korviin ja niskaa kiristää.',
      stomach: 'Vatsassa on pientä kiukkua.',
      arms: 'Sormet napsuttelevat tai puristuvat.',
      legs: 'Jalka voi naputtaa hermostuneesti lattiaa.',
    },
  },
  harmitus: {
    zones: [
      { cx: 110, cy: 74, r: 22, type: 'warm', opacity: 0.65 },
      { cx: 110, cy: 118, r: 32, type: 'warm', opacity: 0.7 },
      { cx: 48, cy: 150, r: 28, type: 'cool', opacity: 0.72 },
      { cx: 172, cy: 150, r: 28, type: 'cool', opacity: 0.72 },
      { cx: 88, cy: 252, r: 34, type: 'cool', opacity: 0.78 },
      { cx: 132, cy: 252, r: 34, type: 'cool', opacity: 0.78 },
    ],
    regions: {
      head: 'Silmien takana pistelee ja mieli on matala.',
      chest: 'Rinnassa on painava pieni möykky.',
      stomach: 'Vatsassa tuntuu ontolta.',
      arms: 'Kädet painuvat raskaasti sivuille.',
      legs: 'Jalat tuntuvat raskailta ja väsyneiltä.',
    },
  },
  pettymys: {
    zones: [
      { cx: 110, cy: 118, r: 34, type: 'cool', opacity: 0.75 },
      { cx: 110, cy: 172, r: 32, type: 'cool', opacity: 0.72 },
      { cx: 48, cy: 152, r: 28, type: 'cold', opacity: 0.82 },
      { cx: 172, cy: 152, r: 28, type: 'cold', opacity: 0.82 },
      { cx: 88, cy: 255, r: 36, type: 'cold', opacity: 0.84 },
      { cx: 132, cy: 255, r: 36, type: 'cold', opacity: 0.84 },
    ],
    regions: {
      head: 'Katse painuu alas ja olo on väsynyt.',
      chest: 'Rinnassa tuntuu tyhjältä ja raskaalta.',
      stomach: 'Innostus katoaa ja vatsa tuntuu hiljaiselta.',
      arms: 'Kädet tuntuvat viileiltä ja voimattomilta.',
      legs: 'Jaloissa ei ole yhtään vauhtia.',
    },
  },
  suru: {
    zones: [
      { cx: 110, cy: 78, r: 24, type: 'warm', opacity: 0.72 },
      { cx: 110, cy: 114, r: 30, type: 'warm', opacity: 0.65 },
      { cx: 48, cy: 152, r: 32, type: 'cold', opacity: 0.92 },
      { cx: 172, cy: 152, r: 32, type: 'cold', opacity: 0.92 },
      { cx: 88, cy: 252, r: 42, type: 'cold', opacity: 0.95 },
      { cx: 132, cy: 252, r: 42, type: 'cold', opacity: 0.95 },
    ],
    regions: {
      head: 'Silmät kostuvat ja kurkussa on pala.',
      chest: 'Rinnassa pakottaa ja tekee mieli itkeä.',
      stomach: 'Vatsa on hiljainen ja painava.',
      arms: 'Kädet ja sormet tuntuvat kylmiltä.',
      legs: 'Jalat tuntuvat tosi raskailta ja väsyneiltä.',
    },
  },
  pelko: {
    zones: [
      { cx: 110, cy: 114, r: 38, type: 'hot', opacity: 0.92 },
      { cx: 110, cy: 168, r: 32, type: 'warm', opacity: 0.85 },
      { cx: 44, cy: 162, r: 28, type: 'cold', opacity: 0.88 },
      { cx: 176, cy: 162, r: 28, type: 'cold', opacity: 0.88 },
      { cx: 88, cy: 258, r: 36, type: 'cold', opacity: 0.86 },
      { cx: 132, cy: 258, r: 36, type: 'cold', opacity: 0.86 },
    ],
    regions: {
      head: 'Silmät suurenevat ja korvat kuuntelevat tarkkaan.',
      chest: 'Sydän jyskyttää todella kovaa.',
      stomach: 'Vatsassa nipistää ja tuntuu perhosia.',
      arms: 'Kädet viilenevät ja voivat täristä.',
      legs: 'Jalat jähmettyvät tai haluavat juosta turvaan.',
    },
  },
  ahdistus: {
    zones: [
      { cx: 110, cy: 46, r: 26, type: 'warm', opacity: 0.72 },
      { cx: 110, cy: 114, r: 40, type: 'hot', opacity: 0.94 },
      { cx: 110, cy: 168, r: 36, type: 'hot', opacity: 0.88 },
      { cx: 46, cy: 162, r: 26, type: 'cold', opacity: 0.82 },
      { cx: 174, cy: 162, r: 26, type: 'cold', opacity: 0.82 },
      { cx: 88, cy: 258, r: 32, type: 'cold', opacity: 0.76 },
      { cx: 132, cy: 258, r: 32, type: 'cold', opacity: 0.76 },
    ],
    regions: {
      head: 'Ajatukset pyörivät ja otsa voi hikoilla.',
      chest: 'Rintaa puristaa ja hengitys on pinnallista.',
      stomach: 'Vatsassa kiertää ja myllertää.',
      arms: 'Kädet ovat kylmät ja levottomat.',
      legs: 'Jalat tuntuvat kihelmöiviltä tai heikoilta.',
    },
  },
  hapea: {
    zones: [
      { cx: 110, cy: 50, r: 36, type: 'hot', opacity: 0.98 },
      { cx: 110, cy: 86, r: 22, type: 'warm', opacity: 0.8 },
      { cx: 46, cy: 172, r: 24, type: 'cold', opacity: 0.82 },
      { cx: 174, cy: 172, r: 24, type: 'cold', opacity: 0.82 },
      { cx: 88, cy: 258, r: 34, type: 'cold', opacity: 0.8 },
      { cx: 132, cy: 258, r: 34, type: 'cold', opacity: 0.8 },
    ],
    regions: {
      head: 'Posket, korvat ja niska hehkuvat kuumina.',
      chest: 'Tekee mieli painaa pää alas suojaan.',
      stomach: 'Vatsa menee pieneen solmuun.',
      arms: 'Kädet tuntuvat kylmiltä ja hakeutuvat piiloon.',
      legs: 'Jalat ovat kylmät ja haluavat mennä pois.',
    },
  },
};

interface BodilyMapSVGProps {
  emotionId: EmotionId;
  isRegionSpeaking?: boolean;
  onSpeakRegion?: (label: string, text: string) => void;
}

export const BodilyMapSVG: React.FC<BodilyMapSVGProps> = ({
  emotionId,
  isRegionSpeaking = false,
  onSpeakRegion,
}) => {
  const uid = useId().replace(/:/g, '');
  const [selectedRegion, setSelectedRegion] = useState<BodyRegionId>('chest');

  const data = EMOTION_BODY_MAPS[emotionId];

  const getGradientId = (type: ZoneCircle['type']) => {
    if (type === 'hot') return `url(#hot-${uid})`;
    if (type === 'warm') return `url(#warm-${uid})`;
    if (type === 'cool') return `url(#cool-${uid})`;
    return `url(#cold-${uid})`;
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Body Silhouette + Nummenmaa Activation Zones */}
      <div className="relative flex flex-col items-center rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-subtle)] p-3 w-full">
        <svg
          viewBox="0 0 220 325"
          className="h-[240px] sm:h-[270px] w-auto select-none"
          role="img"
          aria-label="Kehokartta tunteen tuntumisesta"
        >
          <defs>
            <radialGradient id={`hot-${uid}`}>
              <stop offset="0%" stopColor="#FDE047" stopOpacity="0.98" />
              <stop offset="45%" stopColor="#EF4444" stopOpacity="0.88" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
            </radialGradient>
            <radialGradient id={`warm-${uid}`}>
              <stop offset="0%" stopColor="#FDBA74" stopOpacity="0.92" />
              <stop offset="50%" stopColor="#F97316" stopOpacity="0.72" />
              <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
            </radialGradient>
            <radialGradient id={`cool-${uid}`}>
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.82" />
              <stop offset="55%" stopColor="#0284C7" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
            </radialGradient>
            <radialGradient id={`cold-${uid}`}>
              <stop offset="0%" stopColor="#1D4ED8" stopOpacity="0.92" />
              <stop offset="55%" stopColor="#0EA5E9" stopOpacity="0.68" />
              <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0" />
            </radialGradient>

            <clipPath id={`body-clip-${uid}`}>
              {/* Head */}
              <circle cx="110" cy="48" r="24" />
              {/* Neck */}
              <rect x="100" y="68" width="20" height="16" rx="6" />
              {/* Torso */}
              <path d="M74,88 Q74,80 92,80 L128,80 Q146,80 146,88 L142,190 Q140,202 126,202 L94,202 Q80,202 78,190 Z" />
              {/* Left Arm */}
              <path d="M78,86 Q60,88 50,115 L36,182 Q33,194 43,196 Q53,198 56,186 L68,125 L78,108 Z" />
              {/* Right Arm */}
              <path d="M142,86 Q160,88 170,115 L184,182 Q187,194 177,196 Q167,198 164,186 L152,125 L142,108 Z" />
              {/* Left Leg */}
              <path d="M80,192 L106,192 L102,296 Q101,310 88,310 Q75,310 76,296 Z" />
              {/* Right Leg */}
              <path d="M114,192 L140,192 L144,296 Q145,310 132,310 Q119,310 118,296 Z" />
            </clipPath>
          </defs>

          {/* Base neutral silhouette */}
          <g clipPath={`url(#body-clip-${uid})`}>
            <rect x="0" y="0" width="220" height="325" fill="#94A3B8" opacity="0.45" />
            {data.zones.map((z, idx) => (
              <circle
                key={idx}
                cx={z.cx}
                cy={z.cy}
                r={z.r}
                fill={getGradientId(z.type)}
                opacity={z.opacity ?? 0.9}
              />
            ))}
          </g>

          {/* Crisp outline around the silhouette parts */}
          <g
            fill="none"
            stroke="var(--text-muted)"
            strokeWidth="1.6"
            opacity="0.45"
          >
            <circle cx="110" cy="48" r="24" />
            <path d="M74,88 Q74,80 92,80 L128,80 Q146,80 146,88 L142,190 Q140,202 126,202 L94,202 Q80,202 78,190 Z" />
            <path d="M78,86 Q60,88 50,115 L36,182 Q33,194 43,196 Q53,198 56,186 L68,125" />
            <path d="M142,86 Q160,88 170,115 L184,182 Q187,194 177,196 Q167,198 164,186 L152,125" />
            <path d="M80,196 L76,296 Q75,310 88,310 Q101,310 102,296 L106,202" />
            <path d="M114,202 L118,296 Q119,310 132,310 Q145,310 144,296 L140,196" />
          </g>

          {/* Interactive Clickable Indicators */}
          {(
            [
              { id: 'head', cx: 110, cy: 48 },
              { id: 'chest', cx: 110, cy: 116 },
              { id: 'stomach', cx: 110, cy: 168 },
              { id: 'arms', cx: 46, cy: 168 },
              { id: 'legs', cx: 130, cy: 256 },
            ] as { id: BodyRegionId; cx: number; cy: number }[]
          ).map((pt) => {
            const active = selectedRegion === pt.id;
            return (
              <g
                key={pt.id}
                role="button"
                tabIndex={0}
                aria-label={`${REGION_LABELS[pt.id]}: ${data.regions[pt.id]}`}
                onClick={() => setSelectedRegion(pt.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedRegion(pt.id);
                  }
                }}
                className="cursor-pointer"
              >
                <circle cx={pt.cx} cy={pt.cy} r="18" fill="transparent" />
                <circle
                  cx={pt.cx}
                  cy={pt.cy}
                  r={active ? 7 : 4.5}
                  fill={active ? '#FFFFFF' : 'rgba(255,255,255,0.72)'}
                  stroke={active ? '#4F46E5' : '#1E293B'}
                  strokeWidth={active ? 2.5 : 1.5}
                />
              </g>
            );
          })}
        </svg>

        {/* Legend: Warm vs Cool */}
        <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-sm font-semibold text-[var(--text-muted)]">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-gradient-to-tr from-[#EF4444] to-[#FDE047]" />
            Lämpö
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-gradient-to-tr from-[#1D4ED8] to-[#38BDF8]" />
            Kylmyys
          </span>
        </div>
      </div>

      {/* Quick Tactile Body Region Selector Buttons */}
      <div className="flex flex-wrap justify-center gap-1.5 w-full">
        {(Object.keys(REGION_LABELS) as BodyRegionId[]).map((regionId) => {
          const active = selectedRegion === regionId;
          return (
            <button
              key={regionId}
              type="button"
              aria-pressed={active}
              onClick={() => setSelectedRegion(regionId)}
              className={`tactile-btn min-h-[38px] rounded-xl border px-3 py-1 text-sm font-bold ${
                active
                  ? 'border-[var(--accent-primary)] bg-[var(--accent-primary-soft)] text-[var(--accent-primary)]'
                  : 'border-[var(--border-hairline)] bg-[var(--bg-subtle)] text-[var(--text-primary)] hover:border-[var(--accent-primary)]/40'
              }`}
            >
              {REGION_LABELS[regionId]}
            </button>
          );
        })}
      </div>

      {/* Selected Body Part Feeling Readout */}
      <div
        role="status"
        aria-live="polite"
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-subtle)] px-3.5 py-2.5 text-left text-sm sm:text-base font-semibold text-[var(--text-primary)]"
      >
        <div className="flex-1">
          <span className="text-[var(--accent-primary)] font-bold">
            {REGION_LABELS[selectedRegion]}:{' '}
          </span>
          {data.regions[selectedRegion]}
        </div>
        {onSpeakRegion && (
          <button
            type="button"
            onClick={() =>
              onSpeakRegion(
                REGION_LABELS[selectedRegion],
                data.regions[selectedRegion]
              )
            }
            aria-label={
              isRegionSpeaking
                ? 'Pysäytä puhe'
                : `Kuuntele: ${REGION_LABELS[selectedRegion]}`
            }
            aria-pressed={isRegionSpeaking}
            className={`tactile-btn inline-flex min-h-[40px] min-w-[40px] shrink-0 items-center justify-center rounded-xl border ${
              isRegionSpeaking
                ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-white'
                : 'border-[var(--border-hairline)] bg-[var(--bg-surface)] text-[var(--accent-primary)] hover:brightness-95'
            }`}
          >
            {isRegionSpeaking ? (
              <StopIcon className="h-4 w-4" />
            ) : (
              <VolumeOnIcon className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};
