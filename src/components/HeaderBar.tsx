import React from 'react';
import { TOTAL_STICKERS } from '../game/data';
import {
  DownloadIcon,
  HomeIcon,
  InfoIcon,
  SearchIcon,
  TrophyIcon,
  VolumeOffIcon,
  VolumeOnIcon,
} from './Icons';

interface HeaderBarProps {
  stickerCount: number;
  muted: boolean;
  canInstall: boolean;
  isIOS: boolean;
  isInstalled: boolean;
  isHouseActive?: boolean;
  onGoHome: () => void;
  onOpenHouse: () => void;
  onOpenAlbum: () => void;
  onToggleMute: () => void;
  onInstallClick: () => void;
  onOpenLegal: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  stickerCount,
  muted,
  canInstall,
  isIOS,
  isInstalled,
  isHouseActive = false,
  onGoHome,
  onOpenHouse,
  onOpenAlbum,
  onToggleMute,
  onInstallClick,
  onOpenLegal,
}) => {
  const showInstall = !isInstalled && (canInstall || isIOS);

  return (
    <header className="w-full max-w-5xl rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-2.5 sm:px-4 py-2 shadow-[var(--shadow-card)] no-select">
      <div className="flex items-center justify-between gap-1.5 sm:gap-3">
        <button
          type="button"
          onClick={onGoHome}
          aria-label="Tunnetutka etusivulle"
          className="tactile-btn inline-flex min-h-[44px] items-center gap-1.5 sm:gap-2 rounded-xl px-1.5 sm:px-2 py-1 text-left font-display text-[17px] sm:text-2xl font-extrabold tracking-tight text-[var(--accent-primary)] hover:bg-[var(--accent-primary-soft)] whitespace-nowrap shrink-0"
        >
          <SearchIcon className="h-5 w-5 shrink-0" />
          <span>Tunnetutka</span>
        </button>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {showInstall && (
            <button
              type="button"
              onClick={onInstallClick}
              aria-label="Asenna sovellus"
              className="tactile-btn inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-xl bg-[var(--accent-primary)] px-2 sm:px-3 py-2 text-sm font-bold text-white hover:bg-[var(--accent-primary-hover)] whitespace-nowrap shrink-0"
            >
              <DownloadIcon className="h-4 w-4 shrink-0" />
              <span className="hidden lg:inline">Asenna</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenHouse}
            aria-label="Tunteiden talo"
            aria-current={isHouseActive ? 'page' : undefined}
            className={`tactile-btn inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-xl px-2 sm:px-3.5 py-2 text-sm sm:text-base font-bold whitespace-nowrap shrink-0 ${
              isHouseActive
                ? 'bg-[var(--accent-primary)] text-white'
                : 'border border-[var(--border-hairline)] bg-[var(--bg-subtle)] text-[var(--text-primary)] hover:brightness-95'
            }`}
          >
            <HomeIcon className="h-4 w-4 shrink-0" />
            <span className="hidden md:inline">Tunteiden talo</span>
          </button>

          <button
            type="button"
            onClick={onOpenAlbum}
            aria-label={`Tarra-albumi: ${stickerCount} / ${TOTAL_STICKERS}`}
            className="tactile-btn inline-flex min-h-[44px] items-center gap-1 sm:gap-1.5 rounded-xl bg-[var(--accent-primary-soft)] px-2 sm:px-3.5 py-2 text-sm sm:text-base font-bold text-[var(--accent-primary)] hover:brightness-95 whitespace-nowrap shrink-0"
          >
            <TrophyIcon className="h-4 w-4 shrink-0" />
            <span className="tabular-nums">
              <span className="hidden sm:inline">Tarrat </span>
              {stickerCount}/{TOTAL_STICKERS}
            </span>
          </button>

          <button
            type="button"
            onClick={onToggleMute}
            aria-label={muted ? 'Ota äänet käyttöön' : 'Mykistä äänet'}
            aria-pressed={muted}
            className="tactile-btn inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-subtle)] text-[var(--text-primary)] hover:brightness-95"
          >
            {muted ? (
              <VolumeOffIcon className="h-5 w-5" />
            ) : (
              <VolumeOnIcon className="h-5 w-5" />
            )}
          </button>

          <button
            type="button"
            onClick={onOpenLegal}
            aria-label="Tiedot ja käyttöehdot"
            className="tactile-btn inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-subtle)] text-[var(--text-primary)] hover:brightness-95"
          >
            <InfoIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
