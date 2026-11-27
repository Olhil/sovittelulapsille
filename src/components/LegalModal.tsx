import React, { useEffect, useState } from 'react';
import type { LegalTab } from '../game/types';
import { ShieldCheckIcon, TrashIcon, XIcon } from './Icons';

interface LegalModalProps {
  isOpen: boolean;
  initialTab?: LegalTab;
  onClose: () => void;
  onClearData: () => void;
}

const TABS: { id: LegalTab; label: string }[] = [
  { id: 'tos', label: 'Käyttöehdot' },
  { id: 'privacy', label: 'Tietosuoja' },
  { id: 'copyright', label: 'Tekijänoikeus' },
  { id: 'disclaimer', label: 'Vastuu' },
];

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  initialTab = 'privacy',
  onClose,
  onClearData,
}) => {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    setActiveTab(initialTab);
    setConfirmClear(false);
  }, [initialTab, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex max-h-[88dvh] w-full max-w-xl flex-col rounded-3xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--border-hairline)] px-5 py-4">
          <div className="flex items-center gap-2.5">
            <ShieldCheckIcon className="h-5 w-5 text-[var(--accent-primary)]" />
            <h2
              id="legal-modal-title"
              className="font-display text-xl font-bold text-[var(--text-primary)]"
            >
              Tiedot ja säännöt
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Sulje ikkuna"
            className="tactile-btn inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-[var(--bg-subtle)] text-[var(--text-primary)] hover:brightness-95"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <div
          role="tablist"
          aria-label="Säännöt ja tietosuoja"
          className="flex gap-1.5 overflow-x-auto border-b border-[var(--border-hairline)] px-5 py-2.5"
        >
          {TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(tab.id)}
                className={`tactile-btn min-h-[42px] rounded-xl px-3.5 py-1.5 text-base font-semibold whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-[var(--accent-primary)] text-white'
                    : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="allow-select flex-1 overflow-y-auto px-5 py-4 text-base leading-relaxed text-[var(--text-primary)] space-y-3">
          {activeTab === 'tos' && (
            <>
              <h3 className="font-display text-lg font-bold">Käyttöehdot</h3>
              <p className="text-[var(--text-muted)]">
                Tunnetutka on peli 7–10-vuotiaille lapsille. Peli opettaa tunteita ja
                sopimista.
              </p>
              <p className="text-[var(--text-muted)]">
                <strong>Pelin käyttö:</strong> Peli on tehty kotiin ja kouluun. Peliä ei
                saa kopioida tai myydä ilman lupaa. Koodia ei saa purkaa tai kopioida.
              </p>
              <p className="text-[var(--text-muted)]">
                <strong>Apua riitaan:</strong> Peli auttaa puhumaan tunteista. Jos riita on
                iso tai joku kiusaa, pyydä aina apua aikuiselta.
              </p>
            </>
          )}

          {activeTab === 'privacy' && (
            <>
              <h3 className="font-display text-lg font-bold">
                Tietosuoja (GDPR & CCPA)
              </h3>
              <p className="text-[var(--text-muted)]">
                <strong>Tiedot pysyvät sinulla:</strong> Peli toimii vain sinun
                laitteellasi. Emme lähetä mitään tietoja nettiin.
              </p>
              <p className="text-[var(--text-muted)]">
                <strong>Ei seurantaa:</strong> Emme kerää nimiä tai kuvia. Emme käytä
                seurantaevästeitä. Vain tarrat ja ääniasetus tallennetaan tämän laitteen
                muistiin.
              </p>
              <p className="text-[var(--text-muted)]">
                <strong>Omat oikeudet:</strong> Voit poistaa kaikki tallennetut tarrat
                heti alta.
              </p>
              <div className="pt-2">
                {!confirmClear ? (
                  <button
                    type="button"
                    onClick={() => setConfirmClear(true)}
                    className="tactile-btn inline-flex min-h-[46px] items-center gap-2 rounded-xl border border-[var(--accent-danger)] px-4 py-2 text-base font-bold text-[var(--accent-danger)] hover:bg-[var(--accent-danger-soft)]"
                  >
                    <TrashIcon className="h-4 w-4" />
                    <span>Poista tallennetut tiedot</span>
                  </button>
                ) : (
                  <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[var(--accent-danger)] bg-[var(--accent-danger-soft)] p-3">
                    <span className="text-sm font-semibold text-[var(--text-primary)]">
                      Haluatko poistaa kaikki tarrat?
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onClearData();
                        setConfirmClear(false);
                      }}
                      className="tactile-btn min-h-[40px] rounded-xl bg-[var(--accent-danger)] px-3.5 py-1.5 text-sm font-bold text-white"
                    >
                      Kyllä, poista
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmClear(false)}
                      className="tactile-btn min-h-[40px] rounded-xl bg-[var(--bg-surface)] px-3.5 py-1.5 text-sm font-bold text-[var(--text-primary)]"
                    >
                      Peruuta
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'copyright' && (
            <>
              <h3 className="font-display text-lg font-bold">Tekijänoikeus</h3>
              <p className="text-[var(--text-muted)]">
                © 2026 Tunnetutka — Sovittelupeli. Kaikki oikeudet pidätetään.
              </p>
              <p className="text-[var(--text-muted)]">
                Kaikki hahmot, kuvat ja tarinat kuuluvat pelin tekijälle. Niitä ei saa
                kopioida tai jakaa ilman lupaa.
              </p>
            </>
          )}

          {activeTab === 'disclaimer' && (
            <>
              <h3 className="font-display text-lg font-bold">Vastuu</h3>
              <p className="text-[var(--text-muted)]">
                Peli toimii sellaisena kuin se on. Emme anna takuuta siitä, että peli
                toimii aina ilman katkoja.
              </p>
              <p className="text-[var(--text-muted)]">
                Tekijä ei vastaa vahingoista, jos laitteen muistissa olevat tarrat
                katoavat.
              </p>
            </>
          )}
        </div>

        <div className="border-t border-[var(--border-hairline)] px-5 py-3 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="tactile-btn min-h-[46px] rounded-xl bg-[var(--accent-primary)] px-5 py-2 text-base font-bold text-white hover:bg-[var(--accent-primary-hover)]"
          >
            Sulje
          </button>
        </div>
      </div>
    </div>
  );
};
