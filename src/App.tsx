import { Arena } from "./components/Arena";
import { useGameStore } from "./store/useGameStore";
import { useGameLoop } from "./hooks/useGameLoop";
import { GameOverlay } from "./components/GameOverlay";
import { useEffect } from "react";
import { MainMenu } from "./components/MainMenu";
import { VfxManager } from "./components/VfxManager";

export default function App() {
  const { status, togglePause } = useGameStore();
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
    <div className="h-screen w-screen max-w-5xl mx-auto shadow-xl overflow-hidden relative font-mono">
      <main className="absolute inset-0 ">
        <Arena />
        <VfxManager />
        <MainMenu />
        <GameOverlay />
      </main>
    </div>
  );
}
