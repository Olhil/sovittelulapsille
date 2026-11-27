import { useCallback, useEffect, useState } from 'react';
import { AlbumView } from './components/AlbumView';
import { ConfettiCanvas } from './components/ConfettiCanvas';
import { CustomConflictView } from './components/CustomConflictView';
import { EmotionHouseView } from './components/EmotionHouseView';
import { HeaderBar } from './components/HeaderBar';
import { HomeView } from './components/HomeView';
import { LegalModal } from './components/LegalModal';
import { MirilkaView } from './components/MirilkaView';
import { IOSInstallModal, OfflineBanner } from './components/PWAInstallModal';
import { SelectCharsView } from './components/SelectCharsView';
import { StoryPickerView } from './components/StoryPickerView';
import { StoryView } from './components/StoryView';
import {
  advanceMirilka,
  applyPhraseChip,
  createInitialState,
  evaluateAnswerNeed,
  evaluateDetectorEmotion,
  getBodyDataState,
  goBackMirilka,
  launchSelectedMode,
  navigateHome,
  openAlbumScreen,
  openCustomConflictScreen,
  openHouseScreen,
  openStoryPickerScreen,
  parseAutostartFlag,
  pickDetectorEmotion,
  pickMirilkaEmotion,
  pickMirilkaNowEmotion,
  selectAnswerEmotion,
  selectCharacterSlot,
  setMirilkaCustomAgreement,
  setMirilkaNeed,
  setMirilkaStory,
  startScenarioAt,
  startSetupMode,
  toggleMirilkaAgreement,
  toggleMirilkaSpoken,
} from './game/rules';
import type {
  CharacterId,
  EmotionId,
  GameMode,
  GameState,
  LegalTab,
  SavedCustomConflict,
} from './game/types';
import { useOnlineStatus, usePWAInstall } from './pwa/usePWA';
import { playTone } from './utils/audio';
import { stopSpeech } from './utils/speech';
import {
  clearAllLocalProgress,
  loadCustomConflicts,
  loadMutedPreference,
  loadProgress,
  saveCustomConflicts,
  saveMutedPreference,
  saveProgress,
} from './utils/storage';

export default function App() {
  const [state, setState] = useState<GameState>(() =>
    createInitialState([], {
      autostart:
        typeof window !== 'undefined' && parseAutostartFlag(window.location.search),
      muted: loadMutedPreference(),
    })
  );
  const [savedConflicts, setSavedConflicts] = useState<SavedCustomConflict[]>(() =>
    loadCustomConflicts()
  );
  const [confettiKey, setConfettiKey] = useState(0);
  const [legalOpen, setLegalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<LegalTab>('privacy');
  const [iosGuideOpen, setIosGuideOpen] = useState(false);

  const isOnline = useOnlineStatus();
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  // Load persisted progress with SHA-256 verification on mount
  useEffect(() => {
    let active = true;
    loadProgress().then((stickers) => {
      if (!active || stickers.length === 0) return;
      setState((prev) => ({
        ...prev,
        unlockedStickers: stickers,
      }));
    });
    return () => {
      active = false;
    };
  }, []);

  // Sync document.body.dataset.state for deterministic testability
  useEffect(() => {
    document.body.dataset.state = getBodyDataState(state);
  }, [state]);

  // Clear shake effect after animation duration so repeated shakes re-trigger cleanly
  useEffect(() => {
    if (state.shakeTarget === 'none') return;
    const timer = window.setTimeout(() => {
      setState((prev) => ({ ...prev, shakeTarget: 'none' }));
    }, 420);
    return () => window.clearTimeout(timer);
  }, [state.shakeTarget]);

  const handleStartMode = useCallback(
    (mode: GameMode, scenarioIdx?: number) => {
      playTone('tap', state.muted);
      setState((prev) => startSetupMode(prev, mode, scenarioIdx));
    },
    [state.muted]
  );

  // Title screen keyboard start handshake (Enter or Space)
  useEffect(() => {
    if (state.screen !== 'home' || legalOpen || iosGuideOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'BUTTON' || target.tagName === 'A')) {
        return;
      }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleStartMode('story');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [state.screen, legalOpen, iosGuideOpen, handleStartMode]);

  const handleGoHome = () => {
    stopSpeech();
    playTone('tap', state.muted);
    setState((prev) => navigateHome(prev));
  };

  const handleOpenHouse = () => {
    stopSpeech();
    playTone('tap', state.muted);
    setState((prev) => openHouseScreen(prev));
  };

  const handleOpenAlbum = () => {
    stopSpeech();
    playTone('tap', state.muted);
    setState((prev) => openAlbumScreen(prev));
  };

  const handleOpenStoryPicker = () => {
    stopSpeech();
    playTone('tap', state.muted);
    setState((prev) => openStoryPickerScreen(prev));
  };

  const handleOpenCustomConflict = () => {
    stopSpeech();
    playTone('tap', state.muted);
    setState((prev) => openCustomConflictScreen(prev));
  };

  const handleSelectStoryDirect = (idx: number) => {
    stopSpeech();
    playTone('tap', state.muted);
    setState((prev) => startScenarioAt(prev, idx));
  };

  const handleSaveCustomConflict = (entry: SavedCustomConflict) => {
    setSavedConflicts((prev) => {
      const next = [entry, ...prev.filter((c) => c.id !== entry.id)].slice(0, 20);
      saveCustomConflicts(next);
      return next;
    });
  };

  const handleDeleteCustomConflict = (id: string) => {
    setSavedConflicts((prev) => {
      const next = prev.filter((c) => c.id !== id);
      saveCustomConflicts(next);
      return next;
    });
  };

  const handleToggleMute = () => {
    setState((prev) => {
      const nextMuted = !prev.muted;
      saveMutedPreference(nextMuted);
      if (nextMuted) {
        stopSpeech();
      } else {
        playTone('tap', false);
      }
      return { ...prev, muted: nextMuted };
    });
  };

  const handleInstallClick = async () => {
    playTone('tap', state.muted);
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setIosGuideOpen(true);
    }
  };

  const handleOpenLegal = (tab: LegalTab = 'privacy') => {
    playTone('tap', state.muted);
    setLegalTab(tab);
    setLegalOpen(true);
  };

  const handleClearData = () => {
    clearAllLocalProgress();
    setSavedConflicts([]);
    setState((prev) => ({ ...prev, unlockedStickers: [], muted: false }));
  };

  const handleSelectChar = (slot: 'A' | 'B', id: CharacterId) => {
    playTone('tap', state.muted);
    setState((prev) => selectCharacterSlot(prev, slot, id));
  };

  const handleLaunchMode = () => {
    playTone('tap', state.muted);
    setState((prev) => launchSelectedMode(prev));
  };

  const handlePickDetectorEmotion = (id: EmotionId) => {
    playTone('tap', state.muted);
    setState((prev) => pickDetectorEmotion(prev, id));
  };

  const handleCheckDetectorEmotion = () => {
    setState((prev) => {
      const { nextState, outcome } = evaluateDetectorEmotion(prev);
      playTone(outcome === 'success' ? 'success' : 'error', prev.muted);
      return nextState;
    });
  };

  const handleTapChip = (chip: 'obs' | 'question' | 'toxic') => {
    setState((prev) => {
      const { nextState, outcome } = applyPhraseChip(prev, chip);
      if (outcome === 'error') {
        playTone('error', prev.muted);
      } else if (outcome === 'complete') {
        playTone('success', prev.muted);
      } else {
        playTone('tap', prev.muted);
      }
      return nextState;
    });
  };

  const handleSelectAnswerEmotion = (id: EmotionId) => {
    playTone('tap', state.muted);
    setState((prev) => selectAnswerEmotion(prev, id));
  };

  const handleSelectAnswerNeed = (idx: number) => {
    setState((prev) => {
      const { nextState, outcome } = evaluateAnswerNeed(prev, idx);
      if (outcome === 'success') {
        playTone('success', prev.muted);
        setConfettiKey((k) => k + 1);
        void saveProgress(nextState.unlockedStickers);
      } else {
        playTone('error', prev.muted);
      }
      return nextState;
    });
  };

  const handleNextScenario = () => {
    playTone('tap', state.muted);
    setState((prev) => startScenarioAt(prev, prev.scenarioIndex + 1));
  };

  const handleSetMirilkaStory = (player: 1 | 2, text: string) => {
    setState((prev) => setMirilkaStory(prev, player, text));
  };

  const handleToggleMirilkaSpoken = (player: 1 | 2) => {
    playTone('tap', state.muted);
    setState((prev) => toggleMirilkaSpoken(prev, player));
  };

  const handlePickMirilkaEmotion = (player: 1 | 2, emoId: EmotionId) => {
    playTone('tap', state.muted);
    setState((prev) => pickMirilkaEmotion(prev, player, emoId));
  };

  const handlePickMirilkaNowEmotion = (player: 1 | 2, emoId: EmotionId) => {
    playTone('tap', state.muted);
    setState((prev) => pickMirilkaNowEmotion(prev, player, emoId));
  };

  const handleSetMirilkaNeed = (player: 1 | 2, need: string) => {
    setState((prev) => setMirilkaNeed(prev, player, need));
  };

  const handleToggleMirilkaAgreement = (agreement: string) => {
    playTone('tap', state.muted);
    setState((prev) => toggleMirilkaAgreement(prev, agreement));
  };

  const handleSetMirilkaCustomAgreement = (text: string) => {
    setState((prev) => setMirilkaCustomAgreement(prev, text));
  };

  const handleBackMirilka = () => {
    stopSpeech();
    playTone('tap', state.muted);
    setState((prev) => goBackMirilka(prev));
  };

  const handleAdvanceMirilka = () => {
    stopSpeech();
    setState((prev) => {
      const next = advanceMirilka(prev);
      if (next.mirilkaStep === 5 && prev.mirilkaStep !== 5) {
        playTone('success', prev.muted);
        setConfettiKey((k) => k + 1);
      } else {
        playTone('tap', prev.muted);
      }
      return next;
    });
  };

  return (
    <div className="app-shell flex flex-col items-center gap-4">
      <ConfettiCanvas burstKey={confettiKey} />

      <HeaderBar
        stickerCount={state.unlockedStickers.length}
        muted={state.muted}
        canInstall={isInstallable}
        isIOS={isIOS}
        isInstalled={isInstalled}
        isHouseActive={state.screen === 'house'}
        onGoHome={handleGoHome}
        onOpenHouse={handleOpenHouse}
        onOpenAlbum={handleOpenAlbum}
        onToggleMute={handleToggleMute}
        onInstallClick={handleInstallClick}
        onOpenLegal={() => handleOpenLegal('privacy')}
      />

      <main className="flex w-full max-w-5xl flex-1 flex-col justify-center">
        {state.screen === 'home' && (
          <HomeView
            stickerCount={state.unlockedStickers.length}
            onStartMode={(mode) => handleStartMode(mode)}
            onOpenStoryPicker={handleOpenStoryPicker}
            onOpenCustomConflict={handleOpenCustomConflict}
            onOpenHouse={handleOpenHouse}
            onOpenAlbum={handleOpenAlbum}
            onOpenLegalTab={handleOpenLegal}
          />
        )}

        {state.screen === 'house' && (
          <EmotionHouseView muted={state.muted} onBack={handleGoHome} />
        )}

        {state.screen === 'story_picker' && (
          <StoryPickerView
            unlockedStickers={state.unlockedStickers}
            activeScenarioIndex={state.scenarioIndex}
            charAId={state.charAId}
            charBId={state.charBId}
            muted={state.muted}
            onSelectScenario={handleSelectStoryDirect}
            onChangeCharacters={() => handleStartMode('story', state.scenarioIndex)}
            onBack={handleGoHome}
          />
        )}

        {state.screen === 'custom_conflict' && (
          <CustomConflictView
            charAId={state.charAId}
            charBId={state.charBId}
            muted={state.muted}
            savedConflicts={savedConflicts}
            onSaveConflict={handleSaveCustomConflict}
            onDeleteConflict={handleDeleteCustomConflict}
            onCelebrate={() => setConfettiKey((k) => k + 1)}
            onExit={handleGoHome}
          />
        )}

        {state.screen === 'select_chars' && (
          <SelectCharsView
            mode={state.mode}
            charAId={state.charAId}
            charBId={state.charBId}
            onSelectChar={handleSelectChar}
            onBack={handleGoHome}
            onLaunch={handleLaunchMode}
          />
        )}

        {state.screen === 'story' && (
          <StoryView
            state={state}
            onExit={handleGoHome}
            onOpenStoryPicker={handleOpenStoryPicker}
            onPickDetectorEmotion={handlePickDetectorEmotion}
            onCheckDetectorEmotion={handleCheckDetectorEmotion}
            onTapChip={handleTapChip}
            onSelectAnswerEmotion={handleSelectAnswerEmotion}
            onSelectAnswerNeed={handleSelectAnswerNeed}
            onNextScenario={handleNextScenario}
          />
        )}

        {state.screen === 'mirilka' && (
          <MirilkaView
            state={state}
            onExit={handleGoHome}
            onSetStory={handleSetMirilkaStory}
            onToggleSpoken={handleToggleMirilkaSpoken}
            onPickEmotion={handlePickMirilkaEmotion}
            onPickNowEmotion={handlePickMirilkaNowEmotion}
            onSetNeed={handleSetMirilkaNeed}
            onToggleAgreement={handleToggleMirilkaAgreement}
            onSetCustomAgreement={handleSetMirilkaCustomAgreement}
            onBackStep={handleBackMirilka}
            onAdvance={handleAdvanceMirilka}
          />
        )}

        {state.screen === 'album' && (
          <AlbumView
            unlockedStickers={state.unlockedStickers}
            onPlayScenario={(idx) => handleStartMode('story', idx)}
            onBack={handleGoHome}
          />
        )}
      </main>

      <LegalModal
        isOpen={legalOpen}
        initialTab={legalTab}
        onClose={() => setLegalOpen(false)}
        onClearData={handleClearData}
      />

      <IOSInstallModal
        isOpen={iosGuideOpen}
        onClose={() => setIosGuideOpen(false)}
      />

      <OfflineBanner isOnline={isOnline} />
    </div>
  );
}
