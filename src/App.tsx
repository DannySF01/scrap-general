import { Arena } from "./components/Arena";
import { useGameStore } from "./store/useGameStore";
import { useGameLoop } from "./hooks/useGameLoop";
import { GameOverlay } from "./components/GameOverlay";
import { useEffect } from "react";
import { MainMenu } from "./components/MainMenu";
import { VfxManager } from "./components/VfxManager";

export default function App() {
  const { status, togglePause, syncStats } = useGameStore();
  useGameLoop();

  useEffect(() => {
    syncStats();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") e.preventDefault();

      switch (e.code) {
        case "Escape":
          if (status === "PLAYING" || status === "PAUSED") {
            togglePause();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [status, togglePause]);

  return (
    <div className="h-screen w-screen bg-slate-950 overflow-hidden relative font-mono selection:bg-indigo-500/30">
      <main className="absolute inset-0 ">
        <Arena />
        <VfxManager />
        <MainMenu />
        <GameOverlay />
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.5)] z-10" />
      </main>
    </div>
  );
}
