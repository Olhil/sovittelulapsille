import React from 'react';
import { ShareIcon, WifiOffIcon, XIcon } from './Icons';

interface IOSInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IOSInstallModal: React.FC<IOSInstallModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ios-install-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-sm rounded-3xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 id="ios-install-title" className="font-display text-xl font-bold">
            Asenna Tunnetutka (iPhone / iPad)
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Sulje asennusohje"
            className="tactile-btn inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-[var(--bg-subtle)]"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        <ol className="space-y-2.5 text-base text-[var(--text-muted)]">
          <li className="flex items-start gap-2">
            <span className="font-bold text-[var(--accent-primary)]">1.</span>
            <span>
              Paina alareunan{' '}
              <strong className="inline-flex items-center gap-1 text-[var(--text-primary)]">
                Jaa <ShareIcon className="h-4 w-4" />
              </strong>{' '}
              -nappia.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-[var(--accent-primary)]">2.</span>
            <span>
              Valitse{' '}
              <strong className="text-[var(--text-primary)]">Lisää Koti-valikkoon</strong>.
            </span>
          </li>
        </ol>
        <button
          type="button"
          onClick={onClose}
          className="tactile-btn w-full min-h-[48px] rounded-xl bg-[var(--accent-primary)] py-2.5 text-base font-bold text-white"
        >
          Selvä!
        </button>
      </div>
    </div>
  );
};

export const OfflineBanner: React.FC<{ isOnline: boolean }> = ({ isOnline }) => {
  if (isOnline) return null;
  return (
    <div
      role="status"
      className="fixed bottom-4 left-4 z-40 flex items-center gap-2 rounded-xl border border-[var(--accent-warning)] bg-[var(--bg-surface)] px-3.5 py-2 text-sm font-bold text-[var(--text-primary)] shadow-lg"
    >
      <WifiOffIcon className="h-4 w-4 text-[var(--accent-warning)]" />
      <span>Ei nettiä — Peli toimii silti</span>
    </div>
  );
};
