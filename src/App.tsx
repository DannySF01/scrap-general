import ActionSlot from "./components/ActionSlot";
import Stat from "./components/Stat";
import { Arena } from "./components/Arena";
import { useGameStore } from "./store/useGameStore";
import { useGameLoop } from "./hooks/useGameLoop";
import { GameOverlay } from "./components/GameOverlay";
import { useEffect } from "react";
import { DeploymentHub } from "./components/DeploymentHub";
import { MainMenu } from "./components/MainMenu";
import { StatPanel } from "./components/StatPanel";
import { VfxManager } from "./components/VfxManager";

export default function App() {
  const { scrap, luck, status, togglePause, syncStats } = useGameStore();
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
      <div className="absolute top-6 left-6 right-6 z-1 pointer-events-none flex justify-between items-start">
        <div className="flex flex-col gap-1 pointer-events-auto">
          <div className="bg-slate-900/80 border-l-2 border-indigo-500 p-3 backdrop-blur-sm shadow-xl">
            <Stat
              label="SCRAP"
              value={scrap.toLocaleString()}
              color="text-emerald-400"
            />
            <Stat label="LUCK" value={`${luck}`} color="text-sky-400" />
          </div>
        </div>
      </div>

      <main className="absolute inset-0 ">
        <Arena />
        <VfxManager />
        <MainMenu />
        <GameOverlay />
        <DeploymentHub />
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.5)] z-10" />
      </main>
    </div>
  );
}
