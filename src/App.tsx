import ActionSlot from "./components/ActionSlot";
import Stat from "./components/Stat";
import { Arena } from "./components/Arena";
import { useGameStore } from "./store/useGameStore";
import { useGameLoop } from "./hooks/useGameLoop";
import { GameOverlay } from "./components/GameOverlay";
import { useEffect } from "react";
import { DeploymentHub } from "./components/DeploymentHub";

export default function App() {
  const { scrap, wave, luck, status, togglePause } = useGameStore();

  useGameLoop();

  useEffect(() => {
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
    <div className="h-screen w-300 mx-auto flex flex-col bg-slate-950 p-4 gap-4 overflow-hidden relative">
      <header className="flex justify-between items-center bg-slate-900 border-2 border-slate-800 p-4 rounded-xl">
        <div className="flex gap-10">
          <Stat
            label="SCRAP"
            value={scrap.toLocaleString()}
            color="text-scrap"
          />
          <Stat label="LUCK" value={`${luck}`} color="text-energy" />
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-500 font-black tracking-widest uppercase">
            Sector Threat
          </p>
          <p className="text-3xl font-black text-danger leading-none">
            WAVE {wave}
          </p>
        </div>
      </header>

      <main className="flex-1 bg-slate-900/50 border-2 border-slate-800 rounded-xl relative overflow-hidden group">
        <Arena />
        <GameOverlay />
        <DeploymentHub />
      </main>

      <footer className="grid grid-cols-4 gap-4 h-28">
        <ActionSlot
          icon={null}
          label="Ability 1"
          cost="0"
          hotkey="1"
          isLocked
        />
        <ActionSlot
          icon={null}
          label="Ability 2"
          cost="0"
          hotkey="2"
          isLocked
        />
        <ActionSlot
          icon={null}
          label="Ability 3"
          cost="0"
          hotkey="3"
          isLocked
        />
        <ActionSlot
          icon={null}
          label="Ability 4"
          cost="0"
          hotkey="4"
          isLocked
        />
      </footer>
    </div>
  );
}
