import { motion } from "framer-motion";
import { useGameStore } from "../store/useGameStore";

export function GameOverlay() {
  const { status, startGame, resetGame, togglePause } = useGameStore();

  if (status === "PLAYING")
    return (
      <button
        onClick={togglePause}
        className="absolute top-4 right-4 p-2 bg-slate-800 rounded"
      >
        PAUSE
      </button>
    );

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-900 p-8 border-2 border-indigo-500 rounded-2xl text-center shadow-2xl"
      >
        {status === "IDLE" && (
          <>
            <h1 className="text-4xl font-black mb-6 tracking-tighter">
              SCRAP GENERAL
            </h1>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 font-bold rounded-lg transition-all"
            >
              START GAME
            </button>
          </>
        )}

        {status === "PAUSED" && (
          <>
            <h1 className="text-3xl font-bold mb-6">GAME PAUSED</h1>

            <div className="flex flex-col gap-4">
              <button
                onClick={togglePause}
                className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 font-bold rounded-lg"
              >
                RESUME
              </button>
              <button
                onClick={resetGame}
                className="px-8 py-3 bg-red-600 hover:bg-red-500 font-bold rounded-lg"
              >
                RESTART
              </button>
            </div>
          </>
        )}

        {status === "GAME_OVER" && (
          <>
            <h1 className="text-4xl font-black mb-6  text-red-500">
              CORE BREACHED
            </h1>
            <button
              onClick={resetGame}
              className="px-8 py-3 bg-red-600 hover:bg-red-500 font-bold rounded-lg"
            >
              REDEPLOY
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}
