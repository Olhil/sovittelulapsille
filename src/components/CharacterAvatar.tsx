import React from 'react';
import { getEmotion } from '../game/rules';
import type { Character, EmotionId } from '../game/types';

interface CharacterAvatarProps {
  character: Character;
  emotionId?: EmotionId;
  size?: number;
  showArmor?: boolean;
  armorBroken?: boolean;
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  character,
  emotionId = 'ilo',
  size = 104,
  showArmor = false,
  armorBroken = false,
}) => {
  const emo = getEmotion(emotionId);

  const renderEars = () => {
    if (character.ears === 'fox') {
      return (
        <>
          <polygon points="20,38 12,8 42,26" fill={character.color} />
          <polygon points="80,38 88,8 58,26" fill={character.color} />
          <polygon points="22,34 17,15 36,26" fill="#FED7AA" />
          <polygon points="78,34 83,15 64,26" fill="#FED7AA" />
        </>
      );
    }
    if (character.ears === 'bear') {
      return (
        <>
          <circle cx="22" cy="22" r="14" fill={character.color} />
          <circle cx="78" cy="22" r="14" fill={character.color} />
          <circle cx="22" cy="22" r="7" fill="#DDD6FE" />
          <circle cx="78" cy="22" r="7" fill="#DDD6FE" />
        </>
      );
    }
    if (character.ears === 'bunny') {
      return (
        <>
          <ellipse cx="32" cy="18" rx="9" ry="22" fill={character.color} />
          <ellipse cx="68" cy="18" rx="9" ry="22" fill={character.color} />
          <ellipse cx="32" cy="19" rx="4.5" ry="14" fill="#FBCFE8" />
          <ellipse cx="68" cy="19" rx="4.5" ry="14" fill="#FBCFE8" />
        </>
      );
    }
    return (
      <>
        <polygon points="18,40 16,10 44,25" fill={character.color} />
        <polygon points="82,40 84,10 56,25" fill={character.color} />
        <polygon points="22,35 20,17 38,26" fill="#BAE6FD" />
        <polygon points="78,35 80,17 62,26" fill="#BAE6FD" />
      </>
    );
  };

  const renderCheeksAndEffects = () => {
    switch (emotionId) {
      case 'ilo':
        return (
          <>
            <circle cx="28" cy="60" r="4.5" fill="#FDBA74" opacity="0.7" />
            <circle cx="72" cy="60" r="4.5" fill="#FDBA74" opacity="0.7" />
            <path d="M12,26 L14,21 L16,26 L21,28 L16,30 L14,35 L12,30 L7,28 Z" fill="#FBBF24" />
            <path d="M85,22 L86.5,18.5 L88,22 L91.5,23.5 L88,25 L86.5,28.5 L85,25 L81.5,23.5 Z" fill="#FBBF24" />
          </>
        );
      case 'rakkaus':
        return (
          <>
            <ellipse cx="27" cy="60" rx="6" ry="4" fill="#FB7185" opacity="0.72" />
            <ellipse cx="73" cy="60" rx="6" ry="4" fill="#FB7185" opacity="0.72" />
            <path
              d="M15,24 C15,21 11,21 11,24 C11,27 15,30 15,30 C15,30 19,27 19,24 C19,21 15,21 15,24 Z"
              fill="#EC4899"
            />
            <path
              d="M84,22 C84,19.5 80.5,19.5 80.5,22 C80.5,24.5 84,27.5 84,27.5 C84,27.5 87.5,24.5 87.5,22 C87.5,19.5 84,19.5 84,22 Z"
              fill="#F43F5E"
            />
          </>
        );
      case 'raivo':
        return (
          <>
            <circle cx="27" cy="61" r="6" fill="#EF4444" opacity="0.7" />
            <circle cx="73" cy="61" r="6" fill="#EF4444" opacity="0.7" />
            <path
              d="M72,27 L75,31 L79,28 M76,34 L80,36 L77,40"
              fill="none"
              stroke="#DC2626"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </>
        );
      case 'harmitus':
        return <circle cx="26" cy="61" r="3.6" fill="#38BDF8" opacity="0.9" />;
      case 'suru':
        return (
          <>
            <path d="M29,57 Q26,64 28,69 Q31,64 29,57 Z" fill="#38BDF8" />
            <path d="M71,57 Q74,64 72,69 Q69,64 71,57 Z" fill="#38BDF8" />
          </>
        );
      case 'ahdistus':
        return (
          <path
            d="M79,34 Q83,40 80,44 Q76,44 76,40 Q76,37 79,34 Z"
            fill="#38BDF8"
            stroke="#0284C7"
            strokeWidth="0.8"
          />
        );
      case 'hapea':
        return (
          <>
            <ellipse cx="27" cy="61" rx="7" ry="4.5" fill="#F43F5E" opacity="0.75" />
            <ellipse cx="73" cy="61" rx="7" ry="4.5" fill="#F43F5E" opacity="0.75" />
          </>
        );
      default:
        return null;
    }
  };

  const renderEyes = () => {
    if (emotionId === 'ilo') {
      return (
        <>
          <path
            d="M30,54 Q36,46 42,54"
            fill="none"
            stroke="#1E293B"
            strokeWidth="3.8"
            strokeLinecap="round"
          />
          <path
            d="M58,54 Q64,46 70,54"
            fill="none"
            stroke="#1E293B"
            strokeWidth="3.8"
            strokeLinecap="round"
          />
        </>
      );
    }

    if (emotionId === 'rakkaus') {
      return (
        <>
          <circle cx="36" cy="53" r="5" fill="#1E293B" />
          <circle cx="64" cy="53" r="5" fill="#1E293B" />
          <circle cx="38" cy="51" r="2.2" fill="#FFFFFF" />
          <circle cx="66" cy="51" r="2.2" fill="#FFFFFF" />
        </>
      );
    }

    if (emotionId === 'arsytys') {
      return (
        <>
          <ellipse cx="36" cy="54" rx="5" ry="2.6" fill="#1E293B" />
          <ellipse cx="64" cy="54" rx="5" ry="2.6" fill="#1E293B" />
          <line x1="29" y1="51" x2="43" y2="51" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="57" y1="51" x2="71" y2="51" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
        </>
      );
    }

    if (emotionId === 'pettymys') {
      return (
        <>
          <path d="M30,51 Q36,56 42,51" fill="none" stroke="#1E293B" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M58,51 Q64,56 70,51" fill="none" stroke="#1E293B" strokeWidth="3.2" strokeLinecap="round" />
          <circle cx="36" cy="55.5" r="2.6" fill="#1E293B" />
          <circle cx="64" cy="55.5" r="2.6" fill="#1E293B" />
        </>
      );
    }

    if (emotionId === 'pelko' || emotionId === 'ahdistus') {
      return (
        <>
          <circle cx="36" cy="53" r="6.5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.8" />
          <circle cx="64" cy="53" r="6.5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.8" />
          <circle
            cx={emotionId === 'ahdistus' ? 37 : 36}
            cy="53"
            r={emotionId === 'pelko' ? 2.6 : 3.4}
            fill="#1E293B"
          />
          <circle
            cx={emotionId === 'ahdistus' ? 65 : 64}
            cy="53"
            r={emotionId === 'pelko' ? 2.6 : 3.4}
            fill="#1E293B"
          />
          <circle cx="35" cy="51.5" r="1.2" fill="#FFFFFF" />
          <circle cx="63" cy="51.5" r="1.2" fill="#FFFFFF" />
        </>
      );
    }

    if (emotionId === 'hapea') {
      return (
        <>
          <circle cx="36" cy="53" r="5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.5" />
          <circle cx="64" cy="53" r="5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.5" />
          <circle cx="38.5" cy="54" r="3" fill="#1E293B" />
          <circle cx="66.5" cy="54" r="3" fill="#1E293B" />
        </>
      );
    }

    return (
      <>
        <circle cx="36" cy="53" r="5" fill="#1E293B" />
        <circle cx="64" cy="53" r="5" fill="#1E293B" />
        <circle cx="38" cy="51" r="1.8" fill="#FFFFFF" />
        <circle cx="66" cy="51" r="1.8" fill="#FFFFFF" />
      </>
    );
  };

  const renderBrows = () => {
    switch (emotionId) {
      case 'viha':
        return (
          <>
            <line x1="28" y1="42" x2="44" y2="48" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
            <line x1="72" y1="42" x2="56" y2="48" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
          </>
        );
      case 'raivo':
        return (
          <>
            <line x1="26" y1="39" x2="45" y2="48" stroke="#1E293B" strokeWidth="4.8" strokeLinecap="round" />
            <line x1="74" y1="39" x2="55" y2="48" stroke="#1E293B" strokeWidth="4.8" strokeLinecap="round" />
          </>
        );
      case 'arsytys':
        return (
          <>
            <line x1="29" y1="44" x2="43" y2="47" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="71" y1="45" x2="57" y2="45" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />
          </>
        );
      case 'harmitus':
      case 'suru':
        return (
          <>
            <line x1="28" y1="47" x2="44" y2="42" stroke="#1E293B" strokeWidth="3.6" strokeLinecap="round" />
            <line x1="72" y1="47" x2="56" y2="42" stroke="#1E293B" strokeWidth="3.6" strokeLinecap="round" />
          </>
        );
      case 'pettymys':
        return (
          <>
            <path d="M28,45 Q36,42 43,45" fill="none" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
            <path d="M57,45 Q64,42 72,45" fill="none" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
          </>
        );
      case 'pelko':
      case 'ahdistus':
        return (
          <>
            <path d="M27,42 Q36,34 44,41" fill="none" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M56,41 Q64,34 73,42" fill="none" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />
          </>
        );
      case 'hapea':
        return (
          <>
            <path d="M29,44 Q36,39 42,42" fill="none" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
            <path d="M58,42 Q64,39 71,44" fill="none" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
          </>
        );
      default:
        return (
          <>
            <path d="M30,42 Q36,39 42,42" fill="none" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
            <path d="M58,42 Q64,39 70,42" fill="none" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
          </>
        );
    }
  };

  const renderMouth = () => {
    switch (emotionId) {
      case 'ilo':
        return (
          <>
            <path d="M35,68 Q50,84 65,68 Z" fill="#1E293B" />
            <path d="M42,74 Q50,79 58,74" fill="#FB7185" />
          </>
        );
      case 'rakkaus':
        return (
          <path
            d="M38,68 Q50,79 62,68"
            fill="none"
            stroke="#1E293B"
            strokeWidth="3.8"
            strokeLinecap="round"
          />
        );
      case 'viha':
        return (
          <path
            d="M36,76 Q50,64 64,76"
            fill="none"
            stroke="#1E293B"
            strokeWidth="4.2"
            strokeLinecap="round"
          />
        );
      case 'raivo':
        return (
          <>
            <path
              d="M35,71 Q50,62 65,71 Q64,83 50,83 Q36,83 35,71 Z"
              fill="#7F1D1D"
              stroke="#1E293B"
              strokeWidth="2.2"
            />
            <path d="M40,69 L60,69" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          </>
        );
      case 'arsytys':
        return (
          <path
            d="M38,73 L45,70 L52,74 L62,70"
            fill="none"
            stroke="#1E293B"
            strokeWidth="3.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      case 'harmitus':
        return (
          <path
            d="M41,74 Q50,68 59,74"
            fill="none"
            stroke="#1E293B"
            strokeWidth="4.2"
            strokeLinecap="round"
          />
        );
      case 'pettymys':
        return (
          <path
            d="M38,74 Q50,67 62,74"
            fill="none"
            stroke="#1E293B"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        );
      case 'suru':
        return (
          <path
            d="M37,76 Q50,65 63,76"
            fill="none"
            stroke="#1E293B"
            strokeWidth="4"
            strokeLinecap="round"
          />
        );
      case 'pelko':
        return <ellipse cx="50" cy="73" rx="7.5" ry="9.5" fill="#1E293B" />;
      case 'ahdistus':
      case 'hapea':
        return (
          <path
            d="M37,72 Q43.5,67 50,72 T63,72"
            fill="none"
            stroke="#1E293B"
            strokeWidth="3.6"
            strokeLinecap="round"
          />
        );
    }
  };

  const ringSize = Math.round(size * 1.24);

  return (
    <div
      className="relative inline-flex items-center justify-center no-select"
      style={{ width: ringSize, height: ringSize }}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      {showArmor && (
        <div
          aria-hidden="true"
          className={`armor-ring pointer-events-none absolute inset-0 rounded-full border-[4px] border-dashed border-[var(--accent-danger)] ${
            armorBroken ? 'armor-ring-broken' : ''
          }`}
        />
      )}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        role="img"
        aria-label={`${character.name} (${emo.label})`}
        className="drop-shadow-sm"
      >
        {renderEars()}
        <circle cx="50" cy="55" r="38" fill={character.color} />
        <ellipse cx="50" cy="63" rx="26" ry="22" fill="#FFFBEB" opacity="0.92" />
        {renderCheeksAndEffects()}
        {renderEyes()}
        <ellipse cx="50" cy="61" rx="5" ry="3.5" fill="#1E293B" />
        {renderBrows()}
        {renderMouth()}
      </svg>
    </div>
  );
};
