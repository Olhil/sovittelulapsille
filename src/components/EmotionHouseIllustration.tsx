import React from 'react';
import { CHARACTERS } from '../game/data';
import type { EmotionId } from '../game/types';
import { CharacterAvatar } from './CharacterAvatar';

interface EmotionHouseIllustrationProps {
  emotionId: EmotionId;
}

export const EmotionHouseIllustration: React.FC<EmotionHouseIllustrationProps> = ({
  emotionId,
}) => {
  const renderScene = () => {
    switch (emotionId) {
      case 'ilo':
        // Sunny meadow with flowers
        return (
          <>
            <rect width="220" height="130" rx="16" fill="#E0F2FE" />
            <circle cx="182" cy="28" r="18" fill="#FBBF24" />
            <g stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round">
              <line x1="182" y1="4" x2="182" y2="8" />
              <line x1="182" y1="48" x2="182" y2="52" />
              <line x1="158" y1="28" x2="162" y2="28" />
              <line x1="202" y1="28" x2="206" y2="28" />
              <line x1="165" y1="11" x2="168" y2="14" />
              <line x1="196" y1="42" x2="199" y2="45" />
            </g>
            <path d="M0,96 Q60,80 120,92 T220,90 L220,130 L0,130 Z" fill="#4ADE80" />
            <path d="M0,108 Q80,96 150,108 T220,102 L220,130 L0,130 Z" fill="#22C55E" />
            {/* House */}
            <rect x="24" y="64" width="46" height="36" rx="4" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
            <polygon points="18,66 47,44 76,66" fill="#FB923C" />
            <rect x="41" y="78" width="12" height="22" rx="3" fill="#B45309" />
            {/* Flowers */}
            {[
              { x: 96, y: 112, c: '#F43F5E' },
              { x: 175, y: 112, c: '#A855F7' },
              { x: 196, y: 105, c: '#EC4899' },
            ].map((f, i) => (
              <g key={i}>
                <line x1={f.x} y1={f.y} x2={f.x} y2={f.y + 12} stroke="#15803D" strokeWidth="2" />
                <circle cx={f.x} cy={f.y} r="5" fill={f.c} />
                <circle cx={f.x} cy={f.y} r="2" fill="#FDE047" />
              </g>
            ))}
          </>
        );

      case 'rakkaus':
        // Cozy warm nest with hearts
        return (
          <>
            <rect width="220" height="130" rx="16" fill="#FCE7F3" />
            <circle cx="110" cy="70" r="56" fill="#FBCFE8" opacity="0.55" />
            {/* Hearts */}
            <path d="M36,34 C36,28 28,28 28,34 C28,40 36,45 36,45 C36,45 44,40 44,34 C44,28 36,28 36,34 Z" fill="#EC4899" />
            <path d="M180,30 C180,25 173,25 173,30 C173,35 180,39 180,39 C180,39 187,35 187,30 C187,25 180,25 180,30 Z" fill="#F43F5E" />
            <path d="M162,55 C162,51 157,51 157,55 C157,59 162,62 162,62 C162,62 167,59 167,55 C167,51 162,51 162,55 Z" fill="#FB7185" />
            {/* Cozy branch & warm nest */}
            <path d="M10,115 Q110,104 210,118" stroke="#92400E" strokeWidth="10" strokeLinecap="round" fill="none" />
            <ellipse cx="110" cy="100" rx="68" ry="20" fill="#D97706" />
            <ellipse cx="110" cy="96" rx="58" ry="15" fill="#F59E0B" />
            <path d="M55,97 Q85,108 110,105 Q140,108 165,97" stroke="#92400E" strokeWidth="2.5" fill="none" />
            <path d="M62,104 Q110,116 158,104" stroke="#78350F" strokeWidth="2" fill="none" />
          </>
        );

      case 'viha':
        // Fiery house with chimney smoke
        return (
          <>
            <rect width="220" height="130" rx="16" fill="#FEE2E2" />
            <path d="M0,104 L220,104 L220,130 L0,130 Z" fill="#FCA5A5" />
            {/* Smoke */}
            <circle cx="56" cy="24" r="9" fill="#94A3B8" opacity="0.65" />
            <circle cx="67" cy="14" r="11" fill="#64748B" opacity="0.5" />
            <circle cx="50" cy="36" r="6.5" fill="#CBD5E1" opacity="0.8" />
            {/* Chimney + house */}
            <rect x="44" y="38" width="12" height="22" fill="#7F1D1D" />
            <rect x="20" y="64" width="54" height="42" rx="4" fill="#DC2626" />
            <polygon points="14,66 47,40 80,66" fill="#7F1D1D" />
            {/* Warm glowing flames at base */}
            <path d="M22,106 Q28,88 34,106 Q40,84 46,106 Q54,88 60,106" fill="#F59E0B" />
            <rect x="40" y="80" width="14" height="26" rx="2" fill="#450A0A" />
          </>
        );

      case 'raivo':
        // Storm cloud with lightning + volcano
        return (
          <>
            <rect width="220" height="130" rx="16" fill="#334155" />
            {/* Storm cloud */}
            <g fill="#64748B">
              <circle cx="140" cy="24" r="14" />
              <circle cx="160" cy="20" r="17" />
              <circle cx="180" cy="26" r="13" />
              <rect x="135" y="24" width="50" height="14" rx="7" />
            </g>
            {/* Lightning */}
            <polygon points="164,36 154,56 164,56 156,78 175,50 165,50" fill="#FACC15" />
            {/* Volcano */}
            <polygon points="14,130 40,62 66,62 92,130" fill="#78350F" />
            <path d="M40,62 L46,78 L52,68 L58,82 L66,62 Z" fill="#EF4444" />
            <circle cx="48" cy="48" r="5" fill="#F97316" />
            <circle cx="58" cy="42" r="4" fill="#FACC15" />
            <path d="M0,115 L220,115 L220,130 L0,130 Z" fill="#475569" />
          </>
        );

      case 'arsytys':
        // Prickly cactus patch on the left away from the character
        return (
          <>
            <rect width="220" height="130" rx="16" fill="#FFEDD5" />
            <path d="M0,104 Q110,95 220,104 L220,130 L0,130 Z" fill="#FDBA74" />
            {/* Left tall cactus */}
            <rect x="28" y="48" width="16" height="60" rx="8" fill="#16A34A" />
            <path d="M28,74 Q15,74 15,62 L15,56" stroke="#16A34A" strokeWidth="9" strokeLinecap="round" fill="none" />
            <path d="M44,68 Q57,68 57,56 L57,50" stroke="#16A34A" strokeWidth="9" strokeLinecap="round" fill="none" />
            {/* Second smaller cactus */}
            <rect x="78" y="68" width="14" height="40" rx="7" fill="#15803D" />
            <path d="M78,86 Q67,86 67,76" stroke="#15803D" strokeWidth="7" strokeLinecap="round" fill="none" />
            {/* Spikes */}
            <g stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round">
              <line x1="25" y1="56" x2="20" y2="54" />
              <line x1="47" y1="58" x2="52" y2="56" />
              <line x1="25" y1="86" x2="20" y2="86" />
              <line x1="75" y1="74" x2="70" y2="72" />
              <line x1="95" y1="78" x2="100" y2="77" />
              <line x1="95" y1="92" x2="100" y2="92" />
            </g>
          </>
        );

      case 'harmitus':
        // Rain cloud and puddle
        return (
          <>
            <rect width="220" height="130" rx="16" fill="#E0F2FE" />
            <path d="M0,106 L220,106 L220,130 L0,130 Z" fill="#BAE6FD" />
            {/* Cloud */}
            <g fill="#94A3B8">
              <circle cx="42" cy="30" r="14" />
              <circle cx="62" cy="24" r="18" />
              <circle cx="82" cy="30" r="13" />
              <rect x="34" y="30" width="56" height="14" rx="7" />
            </g>
            {/* Raindrops */}
            <g stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round">
              <line x1="45" y1="50" x2="42" y2="60" />
              <line x1="62" y1="52" x2="59" y2="62" />
              <line x1="78" y1="50" x2="75" y2="60" />
            </g>
            {/* Puddle */}
            <ellipse cx="64" cy="114" rx="44" ry="8" fill="#38BDF8" opacity="0.8" />
            <ellipse cx="64" cy="114" rx="26" ry="4" fill="none" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.7" />
          </>
        );

      case 'pettymys':
        // Deflated balloon and fallen leaf
        return (
          <>
            <rect width="220" height="130" rx="16" fill="#F1F5F9" />
            {/* Soft grey clouds */}
            <g fill="#E2E8F0">
              <circle cx="48" cy="28" r="14" />
              <circle cx="68" cy="24" r="16" />
              <circle cx="86" cy="29" r="12" />
            </g>
            <path d="M0,104 L220,104 L220,130 L0,130 Z" fill="#CBD5E1" />
            {/* Wooden bench / post */}
            <rect x="26" y="78" width="54" height="8" rx="3" fill="#94A3B8" />
            <rect x="32" y="86" width="6" height="20" fill="#64748B" />
            <rect x="68" y="86" width="6" height="20" fill="#64748B" />
            {/* Deflated balloon */}
            <path d="M52,110 Q46,90 55,74" stroke="#64748B" strokeWidth="1.8" fill="none" />
            <path
              d="M42,84 Q56,66 66,82 Q60,96 42,84 Z"
              fill="#F87171"
              stroke="#DC2626"
              strokeWidth="1.5"
            />
            {/* Fallen autumn leaf */}
            <path
              d="M96,112 Q110,98 122,110 Q110,122 96,112 Z"
              fill="#F97316"
            />
            <line x1="90" y1="116" x2="115" y2="110" stroke="#9A3412" strokeWidth="1.8" />
          </>
        );

      case 'suru':
        // Blue house under quiet rain
        return (
          <>
            <rect width="220" height="130" rx="16" fill="#DBEAFE" />
            <path d="M0,106 L220,106 L220,130 L0,130 Z" fill="#93C5FD" />
            {/* Blue house */}
            <rect x="24" y="62" width="52" height="44" rx="4" fill="#3B82F6" />
            <polygon points="18,64 50,38 82,64" fill="#1E40AF" />
            <rect x="43" y="80" width="14" height="26" rx="2" fill="#1D4ED8" />
            <rect x="30" y="72" width="10" height="10" rx="2" fill="#FEF08A" opacity="0.8" />
            {/* Quiet rain lines */}
            <g stroke="#2563EB" strokeWidth="2" strokeLinecap="round" opacity="0.7">
              <line x1="30" y1="14" x2="26" y2="26" />
              <line x1="70" y1="18" x2="66" y2="30" />
              <line x1="110" y1="10" x2="106" y2="22" />
              <line x1="160" y1="16" x2="156" y2="28" />
              <line x1="195" y1="20" x2="191" y2="32" />
              <line x1="182" y1="54" x2="178" y2="66" />
            </g>
          </>
        );

      case 'pelko':
        // Dark cave/burrow with flashlight beam
        return (
          <>
            <rect width="220" height="130" rx="16" fill="#1E1B4B" />
            {/* Cave arch */}
            <path d="M16,130 L16,52 Q110,12 204,52 L204,130 Z" fill="#0F172A" />
            {/* Flashlight & beam */}
            <polygon points="48,96 154,48 160,118" fill="#FDE047" opacity="0.22" />
            <rect x="24" y="92" width="24" height="11" rx="3" fill="#94A3B8" />
            <rect x="44" y="90" width="8" height="15" rx="2" fill="#FACC15" />
          </>
        );

      case 'ahdistus':
        // Tangled yarn ball on swaying bridge
        return (
          <>
            <rect width="220" height="130" rx="16" fill="#E0E7FF" />
            {/* Bridge ropes & planks */}
            <path d="M0,96 Q110,124 220,96" stroke="#6366F1" strokeWidth="3" fill="none" />
            <path d="M0,110 Q110,134 220,110" stroke="#78350F" strokeWidth="5" fill="none" />
            {/* Tangled yarn ball */}
            <circle cx="48" cy="84" r="20" fill="#818CF8" />
            <g stroke="#312E81" strokeWidth="2" fill="none">
              <path d="M32,78 Q48,66 64,80" />
              <path d="M34,92 Q50,74 62,94" />
              <path d="M38,68 Q56,88 40,100" />
              <path d="M62,94 Q74,106 86,102" />
            </g>
          </>
        );

      case 'hapea':
        // Bush behind which blushing character hides
        return (
          <>
            <rect width="220" height="130" rx="16" fill="#FFE4E6" />
            <path d="M0,104 L220,104 L220,130 L0,130 Z" fill="#FECDD3" />
          </>
        );
    }
  };

  // Pick a varied friendly character per emotion so the grid feels alive
  const charMap: Record<EmotionId, number> = {
    ilo: 0,
    rakkaus: 2,
    viha: 1,
    raivo: 0,
    arsytys: 3,
    harmitus: 2,
    pettymys: 1,
    suru: 3,
    pelko: 2,
    ahdistus: 0,
    hapea: 1,
  };
  const char = CHARACTERS[charMap[emotionId]];

  return (
    <div className="relative h-[132px] w-full overflow-hidden rounded-2xl border border-[var(--border-hairline)]">
      <svg
        viewBox="0 0 220 130"
        className="h-full w-full block"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid slice"
      >
        {renderScene()}
      </svg>

      {/* Positioned Character Avatar inside the scene */}
      <div
        className={`pointer-events-none absolute ${
          emotionId === 'hapea'
            ? 'bottom-3 left-1/2 -translate-x-1/2'
            : emotionId === 'rakkaus' || emotionId === 'pelko'
              ? 'bottom-2 left-1/2 -translate-x-1/2'
              : 'bottom-1.5 right-4'
        }`}
      >
        <CharacterAvatar character={char} emotionId={emotionId} size={74} />
      </div>

      {/* Foreground bush overlay specifically for Häpeä so the character peeks over */}
      {emotionId === 'hapea' && (
        <svg
          viewBox="0 0 220 130"
          className="pointer-events-none absolute inset-0 h-full w-full"
          aria-hidden="true"
          preserveAspectRatio="xMidYMid slice"
        >
          <circle cx="80" cy="112" r="22" fill="#16A34A" />
          <circle cx="110" cy="108" r="24" fill="#22C55E" />
          <circle cx="140" cy="112" r="22" fill="#15803D" />
          <rect x="55" y="112" width="110" height="18" fill="#16A34A" />
        </svg>
      )}
    </div>
  );
};
